import { useEffect, useState } from "react";
import api from "../api";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [roomNumber, setRoomNumber] = useState("");
  const [payment, setPayment] = useState("online");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/menu").then((r) => setMenu(r.data));
  }, []);

  const change = (id, d) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) + d) }));

  const items = menu
    .filter((m) => cart[m._id] > 0)
    .map((m) => ({ name: m.name, price: m.price, image: m.image, qty: cart[m._id] }));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const placeOrder = async () => {
    try {
      await api.post("/orders", { roomNumber, items, payment });
      setMsg("Order placed! My Orders me status dekho");
      setCart({});
    } catch (err) {
      setMsg(err.response?.data?.msg || "Pehle login karo");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Cafeteria Menu</h2>
      {menu.map((m) => (
        <div
          key={m._id}
          style={{ display: "flex", alignItems: "center", gap: 14, background: "white",
            padding: 12, borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,.15)", marginBottom: 10 }}
        >
          <img
            src={m.image}
            alt={m.name}
            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, background: "#e5e7eb" }}
          />
          <div style={{ flex: 1 }}>
            <b>{m.name}</b> <span style={{ color: "#6b7280" }}>({m.category})</span>
            <div>₹{m.price}</div>
          </div>
          {m.inStock ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => change(m._id, -1)}
                style={{ padding: "2px 12px", border: "1px solid #999", borderRadius: 6 }}>-</button>
              <span>{cart[m._id] || 0}</span>
              <button onClick={() => change(m._id, 1)}
                style={{ padding: "2px 12px", border: "1px solid #999", borderRadius: 6 }}>+</button>
            </div>
          ) : (
            <span style={{ color: "red" }}>Out of stock</span>
          )}
        </div>
      ))}

      <div style={{ background: "white", padding: 16, borderRadius: 10, marginTop: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,.15)", display: "grid", gap: 10 }}>
        <h3 style={{ fontWeight: "bold" }}>Total: ₹{total}</h3>
        <input style={{ border: "1px solid #999", padding: 8, borderRadius: 6 }}
          placeholder="Room number (e.g. 101)"
          value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
        <select style={{ border: "1px solid #999", padding: 8, borderRadius: 6 }}
          value={payment} onChange={(e) => setPayment(e.target.value)}>
          <option value="online">Online (Mock UPI/Card)</option>
          <option value="room">Charge to Room</option>
        </select>
        {msg && <p style={{ color: "#4338ca", fontWeight: 600 }}>{msg}</p>}
        <button
          disabled={!total || !roomNumber}
          onClick={placeOrder}
          style={{ background: "#4f46e5", color: "white", padding: 10, borderRadius: 6,
            border: "none", opacity: !total || !roomNumber ? 0.4 : 1 }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}