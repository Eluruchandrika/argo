import React, { useState } from "react";
import "./Predict.css"; // Importing the CSS file

const Predict = () => {
    const [formData, setFormData] = useState({
        N: "",
        P: "",
        K: "",
        temperature: "",
        humidity: "",
        ph: "",
        rainfall: "",
    });

    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setPrediction(null);
    
        // Convert form values to numbers
        const formattedData = {
            N: Number(formData.N),
            P: Number(formData.P),
            K: Number(formData.K),
            temperature: Number(formData.temperature),
            humidity: Number(formData.humidity),
            ph: Number(formData.ph),
            rainfall: Number(formData.rainfall),
        };
    
        try {
            const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setPrediction(data.predicted_crop);
            } else {
                setError(data.error || "Prediction failed");
            }
        } catch (err) {
            setError("Something went wrong. Try again.");
        }
    };

    return (
        <div className="predict-container">
            <h2>Crop Prediction</h2>
            <form onSubmit={handleSubmit} className="predict-form">
                {Object.keys(formData).map((key) => (
                    <div key={key} className="form-group">
                        <label>{key.toUpperCase()}:</label>
                        <input
                            type="number"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <button type="submit" className="predict-button">Predict Crop</button>
            </form>

            {prediction && <h3 className="prediction-result">Predicted Crop: {prediction}</h3>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Predict;
