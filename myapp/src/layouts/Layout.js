import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../axiosClient";
import AuthGuard from "./AuthGuard";

const Layout = ({ children }) => {
  return (
    <AuthGuard>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </AuthGuard>
  );
};

export default Layout;

const Header = () => {
  const navigate = useNavigate();
  const logout = async (e) => {
    try {
      let token = localStorage.getItem("accessToken");
      e.preventDefault();
      let result = await axiosClient.delete("/api/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { status } = result.data;

      if (!status) {
        return;
      }

      localStorage.clear();

      navigate("/auth/login");
      toast("Logout Successfully");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Notes App</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/sharenotes">Shared Notes</Nav.Link>
        </Nav>
        <form onSubmit={logout}>
          <button className="btn btn-warning" type="submit">
            Logout
          </button>
        </form>
      </Container>
    </Navbar>
  );
};
