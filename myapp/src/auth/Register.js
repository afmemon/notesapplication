import React, { useState } from "react";
import axiosClient from "../axiosClient";
import { toast } from "react-toastify";
import GuestGuard from "./GuestGuard";
import { Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
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
      let result = await axiosClient.post("/api/auth/signup", formData);
      const { status } = result.data;

      if (!status) {
        toast("Something went wrong");
        return;
      }

      toast("Sign up successfully");

      setFormData({
        name: "",
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
          className="container d-flex justify-content-center align-items-center  vh-100"
          // style={{ backgroundColor: "#08a4d4" }}
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
                    <h1>Register here</h1>
                  </div>

                  <div className="col-12 mt-3">
                    <label>Full Name : </label>
                    <br />
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter here full name"
                    />
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
                    <Link to={"/auth/login"}>Login</Link>
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

export default Register;
