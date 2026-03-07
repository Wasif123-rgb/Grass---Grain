import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Contact from "./components/Contact";

// Temporary placeholders
function Home() {
  return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Home Page</h2>;
}
function Login() {
  return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Login Page</h2>;
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}