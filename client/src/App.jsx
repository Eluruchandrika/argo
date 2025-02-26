import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Predict from "./pages/Predict";


const App = () => {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setAuth(true);
    }, []);

    return (
        <Router>
            <Navbar auth={auth} setAuth={setAuth} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setAuth={setAuth} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard auth={auth} />} />
                <Route path="/predict" element={<Predict />} />

            </Routes>
        </Router>
    );
};

export default App;
