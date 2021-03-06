import React, { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import AuthService from "../services/auth-service";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Stack,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import Link from "next/link";

export default function Login() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [inputsLogin, setInputsLogin] = useState({});

  const handleChangeLogin = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputsLogin((values) => ({ ...values, [name]: value }));
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const user = await AuthService.login(
      inputsLogin.studentId,
      inputsLogin.password
    );
    if (user) {
      setCurrentUser(user);
    }
  };

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      Router.push("/");
    }
  }, [currentUser, handleSubmitLogin]);

  return (
    <Container>
      <Row className="vh-100 d-flex justify-content-center align-items-center">
        <Col xs={12} md={4} className="shadow py-3">
          <h3 className="text-center">Kantin Kejujuran</h3>
          <h4 className="text-center">Login</h4>
          <Form onSubmit={handleSubmitLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                type="text"
                name="studentId"
                value={inputsLogin.studentId || ""}
                onChange={handleChangeLogin}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={inputsLogin.password || ""}
                onChange={handleChangeLogin}
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="info" onClick={handleSubmitLogin}>
                Login
              </Button>
              <Link href="/register" passHref>
                <Button variant="outline-info">Register</Button>
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
