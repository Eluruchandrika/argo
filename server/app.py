from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os


app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///predictions.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

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
    top_3_crops = db.Column(db.String(150), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

# Load model and scaler
model = joblib.load("crop_model.pkl")
scaler = joblib.load("scaler.pkl")  # You must have saved the MinMaxScaler from training

@app.route("/", methods=["GET"])
def home():
    return "Flask API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        required_keys = {"N", "P", "K", "temperature", "humidity", "ph", "rainfall"}
        if not all(key in data for key in required_keys):
            return jsonify({"error": "Missing required fields"}), 400

        # Wrap input into DataFrame to match scaler expectations
        input_df = pd.DataFrame([{
            "N": data["N"],
            "P": data["P"],
            "K": data["K"],
            "temperature": data["temperature"],
            "humidity": data["humidity"],
            "ph": data["ph"],
            "rainfall": data["rainfall"]
        }])

        # Scale input
        scaled_input = scaler.transform(input_df)

        # Predict top 3 crops
        probabilities = model.predict_proba(scaled_input)[0]
        top3_indices = np.argsort(probabilities)[::-1][:3]
        top3_crops = model.classes_[top3_indices]
        top3_crops_list = top3_crops.tolist()

        # Save only top-1 in DB for summary
        top_crop = top3_crops[0]

        new_prediction = PredictionHistory(
            N=data["N"], P=data["P"], K=data["K"],
            temperature=data["temperature"], humidity=data["humidity"],
            ph=data["ph"], rainfall=data["rainfall"],
            predicted_crop=top_crop,
            top_3_crops=", ".join(top3_crops_list)
        )
        db.session.add(new_prediction)
        db.session.commit()

        return jsonify({
            "top_3_crops": top3_crops_list
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/history", methods=["GET"])
def get_history():
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
            "top_3_crops": record.top_3_crops,
            "timestamp": record.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        }
        for record in history
    ]
    return jsonify(history_data)

@app.route("/delete-history/<int:id>", methods=["DELETE"])
def delete_history(id):
    try:
        record = PredictionHistory.query.get(id)
        if not record:
            return jsonify({"error": "Record not found"}), 404

        db.session.delete(record)
        db.session.commit()

        return jsonify({"success": True, "message": f"Record with ID {id} deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))

