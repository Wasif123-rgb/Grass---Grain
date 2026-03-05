import { useState } from "react";
import "./Login.css";

export default function Login() {

  const [mode, setMode] = useState("login");

  return (
    <div className="login-page">

      <div className="login-card">

        <h2 className="brand">🌿 Grass & Grain</h2>

        {(mode === "login" || mode === "signup") && (
          <div className="tabs">
            <span
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </span>

            <span
              className={mode === "signup" ? "active" : ""}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </span>
          </div>
        )}

        {/* LOGIN */}
        {mode === "login" && (
          <>
            <div className="input-group">
              <input type="email" required />
              <label>Email</label>
            </div>

            <div className="input-group">
              <input type="password" required />
              <label>Password</label>
            </div>

            <button>Login</button>

            <p className="small" onClick={() => setMode("forgot")}>
              Forgot password?
            </p>
          </>
        )}

        {/* SIGNUP */}
        {mode === "signup" && (
          <>
            <div className="input-group">
              <input required />
              <label>Full Name</label>
            </div>

            <div className="input-group">
              <input type="email" required />
              <label>Email</label>
            </div>

            <div className="input-group">
              <input type="password" required />
              <label>Password</label>
            </div>

            <div className="input-group">
              <input type="password" required />
              <label>Confirm Password</label>
            </div>

            <button>Create Account</button>

            <p className="small" onClick={() => setMode("login")}>
              Already have an account?
            </p>
          </>
        )}

        {/* FORGOT */}
        {mode === "forgot" && (
          <>
            <h3>Reset Password</h3>

            <div className="input-group">
              <input type="email" required />
              <label>Email</label>
            </div>

            <button>Send Reset Link</button>

            <p className="small" onClick={() => setMode("login")}>
              Back to Login
            </p>
          </>
        )}

      </div>
    </div>
  );
}