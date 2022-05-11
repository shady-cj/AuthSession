import React, { useRef } from "react";
import "./login.css";
import { useNavigate, Navigate } from "react-router-dom";
const Login = () => {
    const inputRef = useRef(null);
    const storage = localStorage.getItem("session-auth");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (inputRef.current != null) {
            const storage = localStorage.getItem("session-auth");
            const username = inputRef.current.value;

            // const accounts = localStorage.getItem("");
            if (storage != null) {
                const account = JSON.parse(storage);
                const userSession = account.find(
                    (user) =>
                        user.username.toLowerCase() === username.toLowerCase()
                );
                // sessionStorage.setItem("activeUser", userSession.username);
                if (userSession) {
                    if (userSession.isActive) {
                        let a = window.open("http://localhost:3000", username);
                        a.focus();
                    } else {
                        window.name = username;
                        account.map((user) => {
                            if (
                                user.username.toLowerCase() ===
                                username.toLowerCase()
                            ) {
                                user.isActive = true;
                                user.lastLogin = new Date().getTime();
                                user.status = "active";
                            }
                            return user;
                        });
                        localStorage.setItem(
                            "session-auth",
                            JSON.stringify(account)
                        );

                        navigate("/");
                    }
                } else {
                    account.push({
                        username: username,
                        isActive: true,
                        lastLogin: new Date().getTime(),
                        status: "active",
                    });

                    window.name = username;
                    localStorage.setItem(
                        "session-auth",
                        JSON.stringify(account)
                    );
                    navigate("/");
                }
            } else {
                // sessionStorage.setItem("activeUser", username);
                const newAccount = [];
                newAccount.push({
                    username: username,
                    isActive: true,
                    lastLogin: new Date().getTime(),
                    status: "active",
                });
                localStorage.setItem(
                    "session-auth",
                    JSON.stringify(newAccount)
                );
                window.name = username;
                navigate("/");
            }
        }
    };
    if (
        window.name !== "" &&
        storage &&
        JSON.parse(storage).find(
            (user) => user.username.toLowerCase() === window.name.toLowerCase()
        )?.isActive === true
    ) {
        return <Navigate to="/" />;
    }
    return (
        <div className="login-container">
            <h2>Auth System</h2>
            <form action="#" onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    className="username-field"
                    ref={inputRef}
                />
                <input type="submit" value="Login" className="login-btn" />
            </form>
        </div>
    );
};

export default Login;
