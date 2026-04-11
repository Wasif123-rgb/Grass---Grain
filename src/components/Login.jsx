import { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || null;

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupRole, setSignupRole] = useState("customer");

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful 🚀");

      // ✅ ONLY FIX (NO UI CHANGE)
      const role = data.user.role;

      if (role === "admin") {
        if (redirectTo === "/book-turf") {
          navigate("/turf-admin");
        } else {
          navigate("/admin");
        }
      } else {
        navigate(redirectTo || "/restaurants");
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  /* ================= SIGNUP ================= */
  const handleSignup = async () => {
    if (signupPassword !== signupConfirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          role: signupRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Signup successful 🚀");

      // ✅ SAME FIX HERE ALSO
      const role = data.user.role;

      if (role === "admin") {
        if (redirectTo === "/book-turf") {
          navigate("/turf-admin");
        } else {
          navigate("/admin");
        }
      } else {
        navigate(redirectTo || "/restaurants");
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="login-page">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <div className="login-card">
        <h2 className="brand">🌿 Grass & Grain</h2>

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

        {/* LOGIN */}
        {mode === "login" && (
          <>
            <div className="input-group">
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <label>Email</label>
            </div>

            <div className="input-group">
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <label>Password</label>
            </div>

            <button onClick={handleLogin}>Login</button>
          </>
        )}

        {/* SIGNUP */}
        {mode === "signup" && (
          <>
            <div className="input-group">
              <input
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
              <label>Name</label>
            </div>

            <div className="input-group">
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
              <label>Email</label>
            </div>

            <div className="input-group">
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
              <label>Password</label>
            </div>

            <div className="input-group">
              <input
                type="password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                required
              />
              <label>Confirm Password</label>
            </div>

            <div className="role-select">
              <label>
                <input
                  type="radio"
                  value="customer"
                  checked={signupRole === "customer"}
                  onChange={() => setSignupRole("customer")}
                />
                Customer
              </label>

              <label>
                <input
                  type="radio"
                  value="admin"
                  checked={signupRole === "admin"}
                  onChange={() => setSignupRole("admin")}
                />
                Admin
              </label>
            </div>

            <button onClick={handleSignup}>Create Account</button>
          </>
        )}
      </div>
    </div>
  );
}