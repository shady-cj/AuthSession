import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./home.css";
const Home = () => {
    const navigate = useNavigate();
    const [activeUser, setActiveUser] = useState(null);
    const [users, setUsers] = useState([]);

    const changeUser = (e) => {
        e.preventDefault();
        window.name = "";
        // setActiveUser({ ...activeUser, isActive: false });
        navigate("/login");
    };

    const handleLogout = (e) => {
        e.preventDefault();
        const updateStatus = users.map((user) => {
            if (user.username === activeUser.username) {
                user.isActive = false;
                user.status = "inactive";
            }
            return user;
        });

        setUsers(updateStatus);
        localStorage.setItem("session-auth", JSON.stringify(updateStatus));
        setActiveUser({ ...activeUser, isActive: false });
        navigate("/login");
    };
    const handleSessionLogout = (username) => {
        const updateStatus = users.map((user) => {
            if (user.username === username) {
                user.isActive = false;
                user.status = "inactive";
            }

            return user;
        });

        setUsers(updateStatus);
        localStorage.setItem("session-auth", JSON.stringify(updateStatus));
    };

    // useEffect(() => {
    //     const handleUnload = (e) => {
    //         // e.preventDefault();
    //         const getReloaded = sessionStorage.getItem("reloaded");
    //         let pageReloaded = window.performance
    //             .getEntriesByType("navigation")
    //             .map((nav) => nav.type);

    //         console.log(pageReloaded);
    //         console.log(pageReloaded.includes("reload"));
    //         if (getReloaded) {
    //             if (pageReloaded.includes("reload") === false) {
    //                 localStorage.setItem("test", "set");
    //                 const updatedStorage = users.map((user) => {
    //                     if (user.username === activeUser.username) {
    //                         user.isActive = false;
    //                         user.status = "inactive";
    //                     }
    //                     return user;
    //                 });
    //                 localStorage.setItem(
    //                     "gone",
    //                     JSON.stringify(updatedStorage)
    //                 );

    //                 localStorage.setItem(
    //                     "session-auth",
    //                     JSON.stringify(updatedStorage)
    //                 );
    //             } else {
    //                 localStorage.setItem("test", pageReloaded);
    //             }
    //         } else {
    //             sessionStorage.setItem("reloaded", true);
    //         }

    //         // console.log("closing now ");
    //         // return "Take care and bye bye";
    //     };

    //     window.addEventListener("beforeunload", handleUnload);
    //     return () => {
    //         window.removeEventListener("beforeunload", handleUnload);
    //     };
    // }, [activeUser]);

    useEffect(() => {
        let timeOut;
        const checkVisibility = () => {
            if (activeUser !== null && activeUser.isActive) {
                if (document.visibilityState === "hidden") {
                    timeOut = setTimeout(() => {
                        const accounts = JSON.parse(
                            localStorage.getItem("session-auth")
                        );
                        const updatedValue = accounts.map((user) => {
                            if (
                                user.username.toLowerCase() ===
                                activeUser.username.toLowerCase()
                            ) {
                                user.status = "idle";
                            }
                            return user;
                        });

                        localStorage.setItem(
                            "session-auth",
                            JSON.stringify(updatedValue)
                        );
                    }, 60000);
                } else if (document.visibilityState === "visible") {
                    clearTimeout(timeOut);

                    const accounts = JSON.parse(
                        localStorage.getItem("session-auth")
                    );

                    const updatedValue = accounts?.map((user) => {
                        if (
                            user.username.toLowerCase() ===
                            activeUser.username.toLowerCase()
                        ) {
                            user.status = "active";
                        }
                        return user;
                    });

                    localStorage.setItem(
                        "session-auth",
                        JSON.stringify(updatedValue)
                    );
                }
            }
        };
        document.addEventListener("visibilitychange", checkVisibility);

        return () => {
            document.removeEventListener("visibilitychange", checkVisibility);
        };
    }, [activeUser]);

    useEffect(() => {
        const accounts = JSON.parse(localStorage.getItem("session-auth"));

        setUsers(accounts);

        const user = accounts?.find((user) => {
            return user.username.toLowerCase() === window.name.toLowerCase();
        });

        if (user?.isActive) {
            setActiveUser(user);
        } else if (activeUser === null && window.name === "") {
            const sortedAcc = accounts
                ?.map((user) => user.lastLogin)
                .sort((a, b) => b - a);
            const lastUser = accounts?.find(
                (user) => user.lastLogin === sortedAcc[0]
            );

            accounts?.map((user) => {
                if (
                    user.username.toLowerCase() ===
                    lastUser.username.toLowerCase()
                ) {
                    user.isActive = true;
                    user.lastLogin = new Date().getTime();
                }
                return user;
            });
            if (accounts !== null) {
                localStorage.setItem("session-auth", JSON.stringify(accounts));

                window.name = lastUser ? lastUser.username : "";
            }

            setActiveUser(lastUser);
        } else {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "session-auth") {
                const newState = JSON.parse(e.newValue);
                console.log(e);

                setUsers(newState);
                if (activeUser) {
                    const getUser = newState.find(
                        (user) =>
                            user.username.toLowerCase() ===
                            activeUser.username.toLowerCase()
                    );
                    if (activeUser.isActive) {
                        setActiveUser(getUser);
                    }
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [activeUser]);

    if (
        localStorage.getItem("session-auth") === null ||
        activeUser?.isActive === false
    ) {
        return <Navigate to="/login" />;
    } else if (window.name !== "" && activeUser?.isActive === false) {
        <Navigate to="/login" />;
    }
    return (
        <div className="user-main">
            <section className="active-user">
                <h2>Your Profile</h2>
                <p>
                    <span style={{ color: "black", fontSize: "1.1rem" }}>
                        Logged in as:
                    </span>
                    {activeUser?.username}
                </p>
                <button onClick={changeUser}>
                    Sign in with another username
                </button>
                <br></br>
                <button
                    onClick={handleLogout}
                    style={{ color: "red", borderColor: "red" }}
                >
                    Logout
                </button>
            </section>
            <section className="session-users">
                <h2>Sessions</h2>
                {users.map((user) => {
                    return (
                        <p key={user.username}>
                            {user.username}
                            {user.username === activeUser.username ? (
                                ` - (You)`
                            ) : user.isActive ? (
                                <>
                                    ({user.status}) -{" "}
                                    <button
                                        className="session-logout"
                                        onClick={() =>
                                            handleSessionLogout(user.username)
                                        }
                                    >
                                        Logout of session
                                    </button>
                                </>
                            ) : (
                                <>
                                    (
                                    <span style={{ color: "red" }}>
                                        Logged Out
                                    </span>
                                    )
                                </>
                            )}
                        </p>
                    );
                })}
                {/* <p>{activeUser?.username}</p>
                <button>Logout</button> */}
            </section>
        </div>
    );
};

export default Home;
