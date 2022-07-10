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

export default function Register() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [inputsRegister, setInputsRegister] = useState({});

  const handleChangeRegister = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputsRegister((values) => ({ ...values, [name]: value }));
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    const user = await AuthService.register(
      inputsRegister.studentId,
      inputsRegister.name,
      inputsRegister.password
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
  }, [currentUser, handleSubmitRegister]);

  return (
    <Container>
      <Row className="vh-100 d-flex justify-content-center align-items-center">
        <Col xs={12} md={4} className="shadow py-3">
          <h3 className="text-center">Kantin Kejujuran</h3>
          <h4 className="text-center">Register</h4>
          <Form onSubmit={handleSubmitRegister}>
            <Form.Group className="mb-3">
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                type="text"
                name="studentId"
                value={inputsRegister.studentId || ""}
                onChange={handleChangeRegister}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={inputsRegister.name || ""}
                onChange={handleChangeRegister}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={inputsRegister.password || ""}
                onChange={handleChangeRegister}
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="info" onClick={handleSubmitRegister}>
                Register
              </Button>
              <Link href="/login" passHref>
                <Button variant="outline-info">Login</Button>
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
