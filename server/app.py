from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the trained model
model = joblib.load("crop_prediction_model.pkl")

@app.route('/', methods=['GET'])
def home():
    return "Flask API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Validate input keys
        required_keys = {'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'}
        if not all(key in data for key in required_keys):
            return jsonify({'error': 'Missing required fields'}), 400

        features = np.array([[data['N'], data['P'], data['K'],
                              data['temperature'], data['humidity'],
                              data['ph'], data['rainfall']]])

        prediction = model.predict(features)[0]

        return jsonify({'predicted_crop': prediction})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
