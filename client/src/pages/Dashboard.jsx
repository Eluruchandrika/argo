import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ auth }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth) {
            navigate("/login");
        }
    }, [auth, navigate]);

    return (
        <div>
            <h2>Welcome to Dashboard</h2>
        </div>
    );
};

export default Dashboard;
