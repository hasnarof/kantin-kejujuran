import React, { useState } from "react";
import axios from "axios";
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

export default function Login() {
  const [inputsLogin, setInputsLogin] = useState({});

  const handleChangeLogin = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputsLogin((values) => ({ ...values, [name]: value }));
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    axios
      .post(`/api/login`, inputsLogin)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };
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
              <Button variant="outline-info" onClick={handleSubmitLogin}>
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
