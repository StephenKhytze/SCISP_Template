import api from "../services/api";

function Dashboard({ user, onLogout }) {

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout request failed:", error);
        }

        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        onLogout();
    };

    return (
        <div className="dashboard">

            <header className="dashboard-header">
                <div>
                    <h1>SCISP</h1>
                    <span>Authentication Module</span>
                </div>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <main className="dashboard-content">

                <h2>Welcome, {user.username}</h2>

                <div className="user-card">

                    <div>
                        <strong>User ID</strong>
                        <span>{user.id}</span>
                    </div>

                    <div>
                        <strong>Username</strong>
                        <span>{user.username}</span>
                    </div>

                    <div>
                        <strong>Role</strong>
                        <span>{user.role}</span>
                    </div>

                </div>

                <div className="status-card">
                    <h3>Authentication Status</h3>

                    <p>
                        ✓ You are authenticated.
                    </p>

                    <p>
                        Your JWT token is currently being
                        used for protected API requests.
                    </p>
                </div>

            </main>

        </div>
    );
}

export default Dashboard;