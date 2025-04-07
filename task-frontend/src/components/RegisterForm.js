import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [regno, setRegno] = useState("");
  const [email, setEmail] = useState(""); // ✅ Add email
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/register/", {
        username: regno,
        email: email, // ✅ Include email
        password: password,
      });
      alert("Registration successful. Please login.");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      alert("Registration failed. Try a different Reg No.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
          Create Account 📝
        </h2>

        {/* Registration Number */}
        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">
            Registration Number
          </label>
          <input
            type="text"
            placeholder="Enter Reg. No"
            value={regno}
            onChange={(e) => setRegno(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-600 font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Register
        </button>

        {/* Link to login */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/" className="text-green-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
