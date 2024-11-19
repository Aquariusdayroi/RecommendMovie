import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Background = styled.div`
  background-image: url("https://example.com/movie-background.jpg"); // Đường dẫn ảnh nền
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  filter: blur(8px);
  opacity: 0.8;
`;

const RegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;
`;

const RegisterBox = styled.div`
  background-color: rgba(0, 0, 0, 0.85);
  padding: 40px;
  width: 300px;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  text-align: center;
  animation: fadeIn 1s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #ffd700;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  color: #333;
  outline: none;
  background: #e0e0e0;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);

  &:focus {
    outline: 2px solid #ffd700;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4f;
  margin-top: 15px;
  font-size: 0.9rem;
`;

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/register/", {
        username,
        email,
        password,
      });
      setMessage("Đăng ký thành công! Chuyển hướng sang đăng nhập...");
      setTimeout(() => navigate("/login"), 2000); // Chuyển sang trang login sau 2 giây
    } catch (error) {
      setMessage(error.response?.data?.error || "Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <RegisterContainer>
      <Background />
      <RegisterBox>
        <Title>Register</Title>
        <form onSubmit={handleRegister}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Đăng Ký</Button>
        </form>
        {message && <ErrorMessage>{message}</ErrorMessage>}
      </RegisterBox>
    </RegisterContainer>
  );
}

export default Register;
