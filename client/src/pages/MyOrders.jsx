import { useEffect, useState } from "react";
import api from "../api";
import socket from "../socket.js";

const steps = ["Placed", "Cooking", "Dispatched", "Delivered"];

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my").then((r) => setOrders(r.data));
    const onUpdate = (o) =>
      setOrders((list) => list.map((x) => (x._id === o._id ? o : x)));
    socket.on("orderUpdated", onUpdate);
    return () => socket.off("orderUpdated", onUpdate);
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        My Orders (Live)
      </h2>
      {orders.length === 0 && <p>Abhi koi order nahi hai.</p>}

      {orders.map((o) => (
        <div
          key={o._id}
          style={{
            background: "white",
            padding: 16,
            borderRadius: 10,
            boxShadow: "0 1px 5px rgba(0,0,0,.2)",
            marginBottom: 14,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            Room {o.roomNumber} | ₹{o.total} |{" "}
            {o.payment === "room" ? "Charge to Room" : "Paid Online"}
          </div>

          {o.items.map((i, k) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              {i.image ? (
                <img
                  src={i.image}
                  alt={i.name}
                  style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
                />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: 8, background: "#e5e7eb" }} />
              )}
              <div>
                {i.name} x{i.qty}
              </div>
            </div>
          ))}

          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {steps.map((s) => {
              const done = steps.indexOf(s) <= steps.indexOf(o.status);
              return (
                <span
                  key={s}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 6,
                    fontSize: 14,
                    background: done ? "#16a34a" : "#e5e7eb",
                    color: done ? "white" : "#374151",
                  }}
                >
                  {s}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}