import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [isReg, setIsReg] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isReg) {
        await api.post("/auth/register", form);
        setIsReg(false);
        setMsg("Registered! Ab login karo");
        return;
      }
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      nav(data.user.role === "chef" ? "/kitchen" : "/");
      window.location.reload();
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error");
    }
  };

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-16 p-6 bg-white rounded-xl shadow space-y-3">
      <h2 className="text-2xl font-bold text-center">{isReg ? "Register" : "Login"}</h2>
      {isReg && (
        <input className="w-full border p-2 rounded" placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
      )}
      <input className="w-full border p-2 rounded" placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="w-full border p-2 rounded" type="password" placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {msg && <p className="text-sm text-red-600">{msg}</p>}
      <button className="w-full bg-indigo-600 text-white p-2 rounded">
        {isReg ? "Register" : "Login"}
      </button>
      <p className="text-sm text-center text-indigo-600 cursor-pointer"
        onClick={() => setIsReg(!isReg)}>
        {isReg ? "Already account? Login" : "New user? Register"}
      </p>
    </form>
  );
}