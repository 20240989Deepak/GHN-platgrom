import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Rooms from "./pages/Rooms";
import Menu from "./pages/Menu";
import MyOrders from "./pages/MyOrders";
import Kitchen from "./pages/Kitchen";

export default function App() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const nav = useNavigate();

  const logout = () => {
    localStorage.clear();
    nav("/login");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-700 text-white px-6 py-3 flex gap-5 items-center">
        <b className="text-lg">GHN</b>
        <Link to="/">Rooms</Link>
        <Link to="/menu">Menu</Link>
        {user && <Link to="/my-orders">My Orders</Link>}
        {user && (user.role === "chef" || user.role === "admin") && (
          <Link to="/kitchen">Kitchen</Link>
        )}
        {user ? (
          <>
            <span className="ml-auto">Hi, {user.name} ({user.role})</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="ml-auto">Login</Link>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Rooms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/kitchen" element={<Kitchen />} />
      </Routes>
    </div>
  );
}