import { useEffect, useState } from "react";
import api from "../api";
import socket from "../socket.js";

const next = { Placed: "Cooking", Cooking: "Dispatched", Dispatched: "Delivered" };
const color = { Placed: "#3b82f6", Cooking: "#f97316", Dispatched: "#8b5cf6" };

export default function Kitchen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders").then((r) => setOrders(r.data));
    const onNew = (o) => setOrders((l) => [o, ...l]);
    const onUpdate = (o) =>
      setOrders((l) => l.map((x) => (x._id === o._id ? o : x)));
    socket.on("newOrder", onNew);
    socket.on("orderUpdated", onUpdate);
    return () => {
      socket.off("newOrder", onNew);
      socket.off("orderUpdated", onUpdate);
    };
  }, []);

  const move = (o) =>
    api.put(`/orders/${o._id}/status`, { status: next[o.status] });

  const active = orders.filter((o) => o.status !== "Delivered");

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Kitchen Display (KDS)
      </h2>
      {active.length === 0 && <p>Koi active order nahi hai.</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {active.map((o) => (
          <div
            key={o._id}
            style={{
              background: "white",
              padding: 16,
              borderRadius: 10,
              boxShadow: "0 1px 5px rgba(0,0,0,.2)",
              borderLeft: `6px solid ${color[o.status]}`,
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: 18 }}>
              Room {o.roomNumber}
              <span style={{ marginLeft: 8, fontSize: 13, color: color[o.status] }}>
                {o.status}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
              {o.payment === "room" ? "Charge to Room" : "Paid Online"} | ₹{o.total}
            </div>

            {o.items.map((i, k) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                {i.image ? (
                  <img
                    src={i.image}
                    alt={i.name}
                    style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }}
                  />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: 8, background: "#e5e7eb" }} />
                )}
                <div>
                  <div style={{ fontWeight: 600 }}>{i.name}</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>Qty: {i.qty}</div>
                </div>
              </div>
            ))}

            <button
              onClick={() => move(o)}
              style={{
                marginTop: 10,
                width: "100%",
                background: "#f97316",
                color: "white",
                padding: "8px 14px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Mark {next[o.status]}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}