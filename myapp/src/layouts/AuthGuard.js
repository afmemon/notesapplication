import React, { useEffect, useState } from "react";
import Login from "../auth/Login";

function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    checkUserLogin();
  }, []);

  const checkUserLogin = async () => {
    try {
      let token = localStorage.getItem("accessToken");

      if (!token) {
        setShowMain(true);
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  if (loading) {
    return "Loading...";
  }

  if (showMain) {
    return <Login setShowMain={setShowMain} />;
  }

  return children;
}

export default AuthGuard;
