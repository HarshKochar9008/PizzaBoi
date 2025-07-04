import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register as registerAction, setError, clearError, login } from "../redux/auth/slice";
import { selectAuthError } from "../redux/auth/selectors";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      dispatch(setError("Email and password are required."));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(setError(data.message || "Registration failed"));
        setLoading(false);
        return;
      }
      dispatch(login({ email }));
      dispatch(clearError());
      navigate("/");
    } catch (err) {
      dispatch(setError("Network error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Register; 