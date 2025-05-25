import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Signup successful! Redirecting to login...");
                navigate("/login");
            } else {
                setError(data.message || "Signup failed");
            }
        } catch (error) {
            setError("Something went wrong. Try again.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: "450px" }}>
                <h2 className="text-center">Sign Up</h2>
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={handleSignup}>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100">Sign Up</button>
                </form>

                <p className="text-center mt-3">
                    Already have an account?{" "}
                    <button className="btn btn-link p-0" onClick={() => navigate("/login")}>
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;
