import { useEffect, useState } from "react";
import Login from "./components/views/LoginView";
import Dashboard from "./components/Dashboard";
import api from "./services/api";

function App() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("access_token");

        if (!token) {
            setLoading(false);
            return;
        }

        api.get("/auth/me")
            .then((response) => {
                setUser(response.data.user);
            })
            .catch(() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    if (loading) {
        return (
            <div className="loading">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <Login
                onLogin={async (credentials) => {
                    const response = await api.post("/auth/login", {
                        username: credentials.username,
                        password: credentials.password,
                    });

                    localStorage.setItem(
                        "access_token",
                        response.data.access_token
                    );

                    const me = await api.get("/auth/me");

                    setUser(me.data.user);
                }}
            />
        );
    }

    return (
        <Dashboard
            user={user}
            onLogout={() => {
                localStorage.removeItem("access_token");
                setUser(null);
            }}
        />
    );
}

export default App;