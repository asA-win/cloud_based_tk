// src/components/LoginForm.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [regno, setRegno] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: regno,
        password: password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      navigate("/tasks");
    } catch (error) {
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
          Welcome Back 👋
        </h2>

        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">
            Registration Number
          </label>
          <input
            type="text"
            placeholder="Enter your Reg. No"
            value={regno}
            onChange={(e) => setRegno(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-purple-500 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
