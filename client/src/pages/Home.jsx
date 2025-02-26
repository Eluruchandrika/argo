import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import heroImage from "../assets/farm.jpeg"; 

const Home = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Fetch token again whenever Home mounts
        const fetchToken = () => {
            const token = localStorage.getItem("token");
            console.log("🔍 Checking stored token:", token);

            if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };

        fetchToken();

        // Ensure it updates when navigating
        window.addEventListener("storage", fetchToken);
        return () => window.removeEventListener("storage", fetchToken);
    }, []);

    const handlePredictClick = () => {
        if (isAuthenticated) {
            console.log("✅ User is logged in. Navigating to Predict Page...");
            navigate("/predict");
        } else {
            console.log("❌ User is NOT logged in. Redirecting to Login Page...");
            navigate("/login");
        }
    };

    return (
        <div className="home-container mt-3">
            {/* Hero Section */}
            <header className="hero">
                <img src={heroImage} alt="Farm" className="hero-img" />
                <div className="hero-content">
                    <h1>Welcome to Agriculture Assistant</h1>
                    <p>AI-powered solutions to enhance farming and crop prediction.</p>
                    <button className="cta-button" onClick={handlePredictClick}>
                        Predict Your Crop
                    </button>
                </div>
            </header>

            {/* Features Section */}
            <section className="features">
                <h2>Our Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <h3>🌱 Crop Prediction</h3>
                        <p>Get AI-based recommendations for the best crops to grow.</p>
                    </div>
                    <div className="feature-card">
                        <h3>📊 Market Prices</h3>
                        <p>Track live crop prices to make better selling decisions.</p>
                    </div>
                    <div className="feature-card">
                        <h3>🛒 Marketplace</h3>
                        <p>Buy and sell agricultural products with ease.</p>
                    </div>
                    <div className="feature-card">
                        <h3>👥 Community Forum</h3>
                        <p>Connect with fellow farmers and share knowledge.</p>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter">
                <h2>Stay Updated</h2>
                <p>Subscribe to our newsletter for the latest farming updates.</p>
                <input type="email" placeholder="Enter your email" />
                <button>Subscribe</button>
            </section>

            {/* Footer */}
            <footer>
                <p>&copy; 2025 Agriculture Assistant. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
