from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pickle
import joblib
import numpy as np
import pandas as pd
from dotenv import load_dotenv
import requests
from io import BytesIO

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Model file paths - use LOCAL files for complete model with scaler and feature names
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'model')
MODEL_PATH = os.path.join(MODEL_DIR, 'best_model_logistic_regression.pkl')
SCALER_PATH = os.path.join(MODEL_DIR, 'scaler.pkl')
FEATURE_NAMES_PATH = os.path.join(MODEL_DIR, 'feature_names.pkl')

# HuggingFace URLs as backup (though they don't have scaler and feature_names)
MODEL_URL = "https://huggingface.co/datasets/Fares-Gharbi/claude_hack_pickle/resolve/main/best_model_logistic_regression.pkl"

# Global variables to cache the model components
cached_model = None
cached_scaler = None
cached_feature_names = None


def load_from_local(file_path, component_name):
    """Load a pickle/joblib file from local filesystem"""
    try:
        print(f"Loading {component_name} from local file: {file_path}")
        with open(file_path, 'rb') as f:
            # Try loading with joblib first (for sklearn models), fall back to pickle
            try:
                obj = joblib.load(f)
                print(f"{component_name} loaded successfully with joblib")
            except Exception:
                f.seek(0)  # Reset file pointer
                obj = pickle.load(f)
                print(f"{component_name} loaded successfully with pickle")
        return obj
    except Exception as e:
        print(f"Error loading {component_name} from local file: {str(e)}")
        raise


def load_model_components():
    """Load the model, scaler, and feature names from LOCAL files"""
    global cached_model, cached_scaler, cached_feature_names

    if cached_model is not None:
        return cached_model, cached_scaler, cached_feature_names

    try:
        # Load model from local file
        cached_model = load_from_local(MODEL_PATH, "Model")

        # Load scaler from local file
        try:
            cached_scaler = load_from_local(SCALER_PATH, "Scaler")
        except Exception as e:
            print(f"Warning: Could not load scaler: {str(e)}")
            print("Proceeding without scaler (features will not be scaled)")
            cached_scaler = None

        # Load feature names from local file
        try:
            cached_feature_names = load_from_local(FEATURE_NAMES_PATH, "Feature names")
            print(f"Feature names loaded successfully ({len(cached_feature_names)} features)")
        except Exception as e:
            print(f"Warning: Could not load feature names: {str(e)}")
            print("Will use default feature ordering")
            cached_feature_names = None

        return cached_model, cached_scaler, cached_feature_names
    except Exception as e:
        print(f"Error loading model components: {str(e)}")
        raise


def prepare_features(data):
    """
    Prepare features from the input data to match the model's expected format.
    Includes feature engineering and one-hot encoding to match training data.
    """
    # Extract base features from input data
    base_data = {
        'reactor_age_years': data.get('reactor_age_years', 20),
        'reactor_nominal_power_mw': data.get('reactor_nominal_power_mw', 1000),
        'load_factor_pct': data.get('load_factor_pct', 75),
        'population_within_30km': data.get('population_within_30km', 100000),
        'ambient_temp_c': data.get('ambient_temp_c', 15),
        'co2_avoided_tons_per_hour': data.get('co2_avoided_tons_per_hour', 500),
        'core_temp_c': data.get('core_temp_c', 285),
        'coolant_pressure_bar': data.get('coolant_pressure_bar', 155),
        'neutron_flux': data.get('neutron_flux', 500),
        'control_rod_position_pct': data.get('control_rod_position_pct', 20),
        'coolant_flow_rate': data.get('coolant_flow_rate', 5000),
        'radiation_inside_uSv': data.get('radiation_inside_uSv', 10),
        'radiation_outside_uSv': data.get('radiation_outside_uSv', 0.1),
        'maintenance_score': data.get('maintenance_score', 80),
        'days_since_maintenance': data.get('days_since_maintenance', 90),
        'sensor_anomaly_flag': int(data.get('sensor_anomaly_flag', False)),
        'grid_demand_index': data.get('grid_demand_index', 50),
        'market_price_eur_mwh': data.get('market_price_eur_mwh', 50),
        'backup_generator_health': data.get('backup_generator_health', 90),
        'staff_fatigue_index': data.get('staff_fatigue_index', 30),
        'public_anxiety_index': data.get('public_anxiety_index', 20),
        'social_media_rumour_index': data.get('social_media_rumour_index', 10),
        'regulator_scrutiny_score': data.get('regulator_scrutiny_score', 30),
        'env_risk_index': data.get('env_risk_index', 20),
        'weather_severity_index': data.get('weather_severity_index', 15),
        'seismic_activity_index': data.get('seismic_activity_index', 10),
        'cyber_attack_score': data.get('cyber_attack_score', 5),
        'avalon_raw_risk_score': data.get('avalon_raw_risk_score', 30),
        'avalon_learned_reward_score': data.get('avalon_learned_reward_score', 40),
        'true_risk_level': data.get('true_risk_level', 0),
        'avalon_evac_recommendation': int(data.get('avalon_evac_recommendation', False)),
        'avalon_shutdown_recommendation': int(data.get('avalon_shutdown_recommendation', False)),
        'human_override': int(data.get('human_override', False)),
    }

    # Engineered features (replicating model training transformations)
    base_data['core_temp_x_pressure'] = base_data['core_temp_c'] * base_data['coolant_pressure_bar']
    base_data['neutron_x_temp'] = base_data['neutron_flux'] * base_data['core_temp_c']
    base_data['age_x_maintenance'] = base_data['reactor_age_years'] * base_data['days_since_maintenance']
    base_data['radiation_inside_outside_ratio'] = base_data['radiation_inside_uSv'] / (base_data['radiation_outside_uSv'] + 1e-5)
    base_data['load_factor_normalized'] = base_data['load_factor_pct'] / 100.0
    base_data['maintenance_per_day'] = base_data['maintenance_score'] / (base_data['days_since_maintenance'] + 1)

    # Composite risk scores
    base_data['technical_risk_score'] = (
        base_data['core_temp_c'] + base_data['coolant_pressure_bar'] +
        base_data['neutron_flux'] + base_data['radiation_inside_uSv']
    ) / 4
    base_data['social_pressure_score'] = (
        base_data['public_anxiety_index'] + base_data['social_media_rumour_index'] +
        base_data['regulator_scrutiny_score']
    ) / 3
    base_data['environmental_threat_score'] = (
        base_data['env_risk_index'] + base_data['weather_severity_index'] +
        base_data['seismic_activity_index']
    ) / 3

    # Time-based features
    year = data.get('year', 2025)
    base_data['years_since_1991'] = year - 1991
    base_data['is_recent'] = int(year >= 2020)

    # Binary risk indicators
    base_data['maintenance_overdue'] = int(base_data['days_since_maintenance'] > 180)
    base_data['poor_maintenance'] = int(base_data['maintenance_score'] < 50)
    base_data['maintenance_risk'] = int(base_data['maintenance_overdue'] or base_data['poor_maintenance'])
    base_data['old_reactor'] = int(base_data['reactor_age_years'] > 40)
    base_data['high_core_temp'] = int(base_data['core_temp_c'] > 320)
    base_data['high_radiation_inside'] = int(base_data['radiation_inside_uSv'] > 50)
    base_data['low_coolant_flow'] = int(base_data['coolant_flow_rate'] < 3000)
    base_data['high_control_rod'] = int(base_data['control_rod_position_pct'] > 80)
    base_data['operational_stress'] = int(
        base_data['high_core_temp'] or base_data['high_radiation_inside'] or
        base_data['low_coolant_flow'] or base_data['high_control_rod']
    )

    # One-hot encode country (default to France if not provided)
    country = data.get('country', 'France')
    countries = [
        'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark',
        'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland',
        'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands',
        'Norway', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain',
        'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom'
    ]
    for c in countries:
        base_data[f'country_{c}'] = int(country == c)

    # One-hot encode reactor type (2, 3, 4; type 1 is baseline)
    reactor_type_code = data.get('reactor_type_code', 1)
    if isinstance(reactor_type_code, str):
        type_mapping = {"PWR": 1, "BWR": 2, "PHWR": 3, "GCR": 4}
        reactor_type_code = type_mapping.get(reactor_type_code, 1)

    base_data['reactor_type_2'] = int(reactor_type_code == 2)
    base_data['reactor_type_3'] = int(reactor_type_code == 3)
    base_data['reactor_type_4'] = int(reactor_type_code == 4)

    # One-hot encode decade (2000, 2010, 2020; 1990s is baseline)
    decade = (year // 10) * 10
    base_data['decade_2000'] = int(decade == 2000)
    base_data['decade_2010'] = int(decade == 2010)
    base_data['decade_2020'] = int(decade == 2020)

    # Load feature names to ensure correct order
    _, _, feature_names = load_model_components()

    # Create DataFrame with all features in correct order
    df = pd.DataFrame([base_data])

    # If feature names are available, ensure all expected features are present in correct order
    if feature_names is not None:
        # Ensure all expected features are present in correct order
        for feature in feature_names:
            if feature not in df.columns:
                df[feature] = 0

        # Select features in the exact order expected by the model
        df = df[feature_names]
    else:
        print("Warning: Using features in default order (no feature_names file available)")
        # Sort columns alphabetically for consistency
        df = df[sorted(df.columns)]

    return df


def calculate_feature_importance(data, prediction):
    """
    Calculate top contributing features to the prediction.
    This is a simplified version - you may want to use SHAP or similar for real feature importance.
    """
    # Define feature importance weights (these should ideally come from your model)
    feature_weights = {
        'core_temp_c': data.get('core_temp_c', 0) / 400.0,  # Normalize
        'coolant_pressure_bar': data.get('coolant_pressure_bar', 0) / 200.0,
        'maintenance_score': (100 - data.get('maintenance_score', 100)) / 100.0,
        'neutron_flux': data.get('neutron_flux', 0) / 1000.0,
        'radiation_inside_uSv': data.get('radiation_inside_uSv', 0) / 100.0,
        'cyber_attack_score': data.get('cyber_attack_score', 0) / 100.0,
        'staff_fatigue_index': data.get('staff_fatigue_index', 0) / 100.0,
    }

    # Sort by impact
    sorted_features = sorted(feature_weights.items(), key=lambda x: x[1], reverse=True)

    # Get top 3 contributors
    top_contributors = [
        {
            'feature': feature,
            'impact': round(impact, 2),
            'value': data.get(feature, 0)
        }
        for feature, impact in sorted_features[:3]
    ]

    return top_contributors


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Backend API is running'}), 200


@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Prediction endpoint that receives simulation data and returns predictions.
    """
    try:
        # Get JSON data from request
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Load model components
        model, scaler, feature_names = load_model_components()

        # Prepare features (returns a DataFrame)
        features_df = prepare_features(data)

        # Scale features if scaler is available
        if scaler is not None:
            features_scaled = scaler.transform(features_df)
        else:
            print("Warning: Scaler not available, using unscaled features")
            features_scaled = features_df.values

        # Make prediction (0 = no incident, 1 = incident)
        prediction = model.predict(features_scaled)
        prediction_proba = model.predict_proba(features_scaled)

        # Extract prediction results
        incident_predicted = bool(prediction[0])
        incident_probability = float(prediction_proba[0][1])  # Probability of incident
        confidence = float(np.max(prediction_proba[0]))

        # Calculate risk level based on probability
        if incident_probability < 0.25:
            risk_level = 0  # Low risk
        elif incident_probability < 0.5:
            risk_level = 1  # Medium risk
        elif incident_probability < 0.75:
            risk_level = 2  # High risk
        else:
            risk_level = 3  # Critical risk

        # Determine incident type based on parameters
        core_temp = data.get('core_temp_c', 0)
        coolant_pressure = data.get('coolant_pressure_bar', 0)
        radiation = data.get('radiation_inside_uSv', 0)
        coolant_flow = data.get('coolant_flow_rate', 0)

        incident_type = 'Normal Operation'
        if core_temp > 320:
            incident_type = 'Core Overheat'
        elif coolant_pressure > 170:
            incident_type = 'Coolant Overpressure'
        elif radiation > 50:
            incident_type = 'Radiation Leak'
        elif coolant_flow < 3000:
            incident_type = 'Coolant System Failure'
        elif incident_predicted:
            incident_type = 'General Safety Concern'

        # Prepare response with model metadata for verification
        response = {
            'incident_occurred': incident_predicted,
            'incident_probability': round(incident_probability, 3),
            'confidence': round(confidence, 3),
            'true_risk_level': risk_level,
            'avalon_evac_recommendation': data.get('avalon_evac_recommendation', False),
            'avalon_shutdown_recommendation': data.get('avalon_shutdown_recommendation', False),
            'human_override': data.get('human_override', False),
            'top_contributors': calculate_feature_importance(data, prediction),
            'incident_type': incident_type,
            # Model verification metadata
            'model_metadata': {
                'model_type': type(model).__name__,
                'model_source': 'Local: /model/ directory (trained on avalon_nuclear.csv)',
                'model_path': MODEL_PATH,
                'n_features': model.n_features_in_ if hasattr(model, 'n_features_in_') else None,
                'using_scaler': scaler is not None,
                'using_feature_names': feature_names is not None,
                'is_real_model': True  # Flag to confirm this is NOT mock data
            }
        }

        return jsonify(response), 200

    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/model-info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    try:
        model, scaler, feature_names = load_model_components()

        info = {
            'model_type': type(model).__name__,
            'model_loaded': True,
            'n_features': len(feature_names),
            'feature_names': feature_names[:10],  # First 10 features
            'scaler_loaded': scaler is not None
        }

        # Try to get additional model info if available
        if hasattr(model, 'n_features_in_'):
            info['n_features_in_model'] = model.n_features_in_

        return jsonify(info), 200
    except Exception as e:
        return jsonify({'error': str(e), 'model_loaded': False}), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_ENV') == 'development')
