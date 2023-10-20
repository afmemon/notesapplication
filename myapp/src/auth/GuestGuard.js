import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function GuestGuard({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    checkUserLogin();
  }, []);

  const checkUserLogin = async () => {
    try {
      let token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      setShowMain(true);
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
    navigate("/");
    return;
  }

  return children;
}

export default GuestGuard;
