import React, { useState } from "react";
import axiosClient from "../axiosClient";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import GuestGuard from "./GuestGuard";

function Login({ setShowMain }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = async (e) => {
    try {
      let temp = { ...formData };
      temp[e.target.name] = e.target.value;
      setFormData(temp);
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      let result = await axiosClient.post("/api/auth/login", formData);
      const { status, token } = result.data;

      if (!status) {
        toast("Something went wrong");
        return;
      }

      localStorage.setItem("accessToken", token);

      toast("Login successfully");

      if (setShowMain) setShowMain(false);

      navigate("/");

      setFormData({
        email: "",
        password: "",
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <GuestGuard>
      <section style={{ backgroundColor: "#cedce0" }}>
        <div
          className="container d-flex justify-content-center align-items-center vh-100"
          style={{ backgroundColor: "#0a98bf" }}
        >
          <div className="row ">
            <div className="col-md-3"></div>
            <div className="col-12 col-md-6">
              <form
                onSubmit={onSubmit}
                className="bg-white p-5 shadow"
                style={{ borderRadius: 12 }}
              >
                <div className="row">
                  <div className="col-12">
                    <h1>Login here</h1>
                  </div>

                  <div className="col-12 mt-3">
                    <label>Email: </label>
                    <br />
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter here email"
                    />
                  </div>

                  <div className="col-12 mt-3">
                    <label>Password: </label>
                    <br />
                    <input
                      required
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter here password"
                    />
                  </div>

                  <div className="col-12 mt-3 d-flex justify-content-between align-items-center">
                    <button
                      className="btn text-white"
                      style={{ backgroundColor: "#0a98bf" }}
                    >
                      Submit
                    </button>

                    <Link to={"/auth/register"}>Register</Link>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-md-3"></div>
          </div>
        </div>
      </section>
    </GuestGuard>
  );
}

export default Login;
