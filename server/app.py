from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import uuid # For generating unique IDs for mock users/tokens

app = Flask(__name__)

# Configure CORS to allow requests ONLY from your frontend's Render URL
# IMPORTANT: Replace 'https://argo-react-frontend.onrender.com' with your actual frontend URL
CORS(app, origins="https://argo-xit.onrender.com", methods=["GET", "POST", "DELETE", "PUT"])
# Database configuration
# Using a relative path for SQLite database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///predictions.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Define the PredictionHistory model for storing crop predictions
class PredictionHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    N = db.Column(db.Float, nullable=False)
    P = db.Column(db.Float, nullable=False)
    K = db.Column(db.Float, nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    ph = db.Column(db.Float, nullable=False)
    rainfall = db.Column(db.Float, nullable=False)
    predicted_crop = db.Column(db.String(50), nullable=False)
    top_3_crops = db.Column(db.String(150), nullable=False) # Store as comma-separated string
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Create database tables if they don't exist
with app.app_context():
    db.create_all()

# Load the pre-trained machine learning model and scaler
# Ensure 'crop_model.pkl' and 'scaler.pkl' are in the same directory as this Flask app
try:
    model = joblib.load("crop_model.pkl")
    scaler = joblib.load("scaler.pkl")  # You must have saved the MinMaxScaler from training
except FileNotFoundError:
    print("Error: 'crop_model.pkl' or 'scaler.pkl' not found.")
    print("Please ensure your trained model and scaler files are in the same directory.")
    # Exit or handle gracefully in a production environment
    model = None
    scaler = None

# --- Mock User Database (for demonstration of login/signup) ---
# In a real application, this would be a proper database table with hashed passwords
MOCK_USERS = {
    "test@example.com": "password123" # Example user: email and password
}

# --- API Routes ---

@app.route("/", methods=["GET"])
def home():
    """
    Home route for the Flask API.
    Returns a simple message to confirm the API is running.
    """
    return "Flask API is running!"

@app.route("/api/auth/signup", methods=["POST"])
def signup():
    """
    Handles user registration (signup).
    For demonstration, it just checks for email and password.
    In a real app, you would:
    1. Hash the password.
    2. Store user details in a database.
    3. Handle duplicate email errors.
    """
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        # Mock: Check if user already exists (case-sensitive for simplicity)
        if email in MOCK_USERS:
            return jsonify({"message": "User with this email already exists"}), 409 # Conflict

        # Mock: Add user to our in-memory "database"
        MOCK_USERS[email] = password # In real app: store hashed password
        print(f"Mock User Registered: {email}")

        return jsonify({"message": "Signup successful!"}), 201 # 201 Created

    except Exception as e:
        print(f"Error during signup: {e}")
        return jsonify({"message": "An error occurred during signup."}), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    """
    Handles user login.
    For demonstration, it checks against mock credentials.
    In a real app, you would:
    1. Verify hashed password.
    2. Generate a JWT (JSON Web Token) upon successful login.
    """
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        # Mock: Authenticate user
        if email in MOCK_USERS and MOCK_USERS[email] == password:
            # In a real application, you would generate a secure JWT token here
            # For this mock, we'll just return a simple dummy token
            token = str(uuid.uuid4()) # Generate a unique ID as a mock token
            print(f"User {email} logged in. Mock Token: {token}")
            return jsonify({"message": "Login successful", "token": token}), 200
        else:
            return jsonify({"message": "Invalid email or password"}), 401 # Unauthorized

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"message": "An error occurred during login."}), 500


@app.route("/predict", methods=["POST"])
def predict():
    """
    Receives crop prediction input, scales it, predicts top 3 crops,
    and saves the prediction to the database.
    """
    if model is None or scaler is None:
        return jsonify({"error": "Machine learning model or scaler not loaded. Please check server logs."}), 500

    try:
        data = request.get_json()
        required_keys = {"N", "P", "K", "temperature", "humidity", "ph", "rainfall"}
        if not all(key in data for key in required_keys):
            return jsonify({"error": "Missing one or more required fields (N, P, K, temperature, humidity, ph, rainfall)"}), 400

        # Convert input to a Pandas DataFrame to match scaler's expected input format
        input_df = pd.DataFrame([{
            "N": data["N"],
            "P": data["P"],
            "K": data["K"],
            "temperature": data["temperature"],
            "humidity": data["humidity"],
            "ph": data["ph"],
            "rainfall": data["rainfall"]
        }])

        # Scale the input features using the loaded scaler
        scaled_input = scaler.transform(input_df)

        # Predict probabilities for all crop classes
        probabilities = model.predict_proba(scaled_input)[0]
        # Get indices of the top 3 probabilities (highest to lowest)
        top3_indices = np.argsort(probabilities)[::-1][:3]
        # Get the actual crop names corresponding to these indices
        top3_crops = model.classes_[top3_indices]
        top3_crops_list = top3_crops.tolist()

        # Save the prediction to the database
        # We save the top predicted crop and the comma-separated string of top 3 crops
        top_crop = top3_crops[0] # The highest predicted crop

        new_prediction = PredictionHistory(
            N=data["N"], P=data["P"], K=data["K"],
            temperature=data["temperature"], humidity=data["humidity"],
            ph=data["ph"], rainfall=data["rainfall"],
            predicted_crop=top_crop,
            top_3_crops=", ".join(top3_crops_list) # Store as a single string
        )
        db.session.add(new_prediction)
        db.session.commit()

        # Return the top 3 predicted crops to the frontend
        return jsonify({
            "top_3_crops": top3_crops_list
        })

    except Exception as e:
        db.session.rollback() # Rollback the session in case of an error
        print(f"Error during prediction: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/history", methods=["GET"])
def get_history():
    """
    Retrieves all past prediction history from the database,
    ordered by timestamp in descending order (newest first).
    """
    try:
        history = PredictionHistory.query.order_by(PredictionHistory.timestamp.desc()).all()
        history_data = [
            {
                "id": record.id,
                "N": record.N,
                "P": record.P,
                "K": record.K,
                "temperature": record.temperature,
                "humidity": record.humidity,
                "ph": record.ph,
                "rainfall": record.rainfall,
                "predicted_crop": record.predicted_crop,
                "top_3_crops": record.top_3_crops, # Already a string
                "timestamp": record.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            }
            for record in history
        ]
        return jsonify(history_data)
    except Exception as e:
        print(f"Error fetching history: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/delete-history/<int:id>", methods=["DELETE"])
def delete_history(id):
    """
    Deletes a specific prediction history record by its ID.
    """
    try:
        record = PredictionHistory.query.get(id)
        if not record:
            return jsonify({"error": "Record not found"}), 404

        db.session.delete(record)
        db.session.commit()

        return jsonify({"success": True, "message": f"Record with ID {id} deleted successfully"}), 200

    except Exception as e:
        db.session.rollback() # Rollback the session in case of an error
        print(f"Error deleting history record: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Get the port from environment variable, default to 5000 for local development
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

