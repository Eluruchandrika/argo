import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

const Login = ({ setAuth }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("🔹 Received Token:", data.token);
    
                localStorage.setItem("token", data.token);
                console.log("Token Saved in localStorage:", localStorage.getItem("token"));
    
                setAuth(true);
    
                setTimeout(() => {
                    navigate("/");
                }, 500);
            } else {
                setError(data.message || "Login failed");
            }
        } catch (error) {
            setError("Something went wrong. Try again.");
        }
    };
    
    

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 " style={{ width: "450px" }}>
                <h2 className="text-center">Login</h2>
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={handleLogin}>
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
                    <button type="submit" className="btn btn-primary w-100 mb-4">Login</button>
                </form>


                <p className="text-center mt-3">
                Do not have account ?{" "}
                    <button className="btn btn-link p-0" onClick={() => navigate("/signup")}>
                    Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
