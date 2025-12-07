import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import axios from "axios";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const prevenSubmit = (e) => {
    e.preventDefault();
  };

  const handleRegisterUser = async () => {
    setError(null);
    let passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: "user",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="brand">Quiz Craft</h2>
        <p className="lead">Create an account</p>
        <form className="auth-form" onSubmit={prevenSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="John Doe"
          />
          {username.length > 0 && username.length < 3 && <div className="error">'Username must be atleast 3 characters'</div>}

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@gmail.com"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="*********"
          />
          {password.trim().length>0 && password.trim().length<12 && <div className="error">'Password must be under 12 characters'</div>}
          <button
            onClick={handleRegisterUser}
            className="btn"
            disabled={loading}
          >
            {loading ? "Creating" : "Sign Up"}
          </button>
          {error && <div className="error">{error}</div>}
          <div className="smail">
            Already Have An Account? <Link to="/">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
