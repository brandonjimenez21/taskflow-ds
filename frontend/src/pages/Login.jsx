import React, { useState, useEffect } from "react";
import './login.css';
import { Form, Button, useNavigate, Container, Card } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {navigate("/");}},[isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");


        try {

            const res = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error("Credenciales inválidas");

            const data = await res.json();

            // Guardar el token en el contexto de autenticación en la cookie
            res.cookie("token", data.token, { httpOnly: true, secure: true, sameSite: "Strict" });
            await login(data.token);


            navigate("/");
        } catch (err) {
            setError(err.message || "Error al iniciar sesión");
        }
    };


    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100" controlId="formBasicEmail">
            <Card className="p-4 shadow login-card" controlId="loginCard">
                <h2 className="mb-4 text-center">Iniciar Sesión</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit} controlId="loginForm">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Ingresa tu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100" controlId="submitButton">
                        Iniciar Sesión
                    </Button>
                </Form>
            </Card>
        </Container>
    );
}

export default Login;