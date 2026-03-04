import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Restaurants from "./components/restaurants";

function RestaurantsWrapper() {
  const navigate = useNavigate();

  return <Restaurants onBack={() => navigate(-1)} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/restaurants" element={<RestaurantsWrapper />} />
    </Routes>
  );
}