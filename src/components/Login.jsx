import { useState, useEffect } from "react";
import "./Login.css";

export default function Login() {

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [user, setUser] = useState(null);

  /* =====================================================
     AUTO LOGIN AFTER REFRESH
  ===================================================== */

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);


  /* =====================================================
     LOGIN
  ===================================================== */

  const handleLogin = async () => {

    try {

      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // ✅ Store Token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      alert("Login successful 🚀");

      window.location.href = "/restaurants";

    } catch (error) {
      alert("Something went wrong");
    }
  };


  /* =====================================================
     SIGNUP
  ===================================================== */

  const handleSignup = async () => {

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // ✅ Store Token After Signup
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      alert("Signup successful ✅");

      setMode("login");

    } catch (error) {
      alert("Something went wrong");
    }
  };


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    window.location.href = "/login";
  };


  return (

    <div className="login-page">

      <div className="login-card">

        <h2 className="brand">🌿 Grass & Grain</h2>

        {user && (
          <div>
            <h3>Welcome {user.name}</h3>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}

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

        {/* ================= LOGIN ================= */}

        {mode === "login" && (
          <>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>

            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>

            <button onClick={handleLogin}>Login</button>

          </>
        )}

        {/* ================= SIGNUP ================= */}

        {mode === "signup" && (
          <>
            <div className="input-group">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>Name</label>
            </div>

            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>

            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>

            <div className="input-group">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label>Confirm Password</label>
            </div>

            <button onClick={handleSignup}>Create Account</button>

          </>
        )}

      </div>
    </div>
  );
}