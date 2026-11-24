import { useEffect, useState } from "react";
import api from "../api";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/rooms").then((r) => setRooms(r.data));
  }, []);

  const book = async (roomId) => {
    try {
      await api.post("/rooms/book", { roomId, ...dates });
      setMsg("Booking confirmed!");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Pehle login karo");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Rooms</h2>
      <div className="flex gap-3 mb-4">
        <input type="date" className="border p-2 rounded"
          onChange={(e) => setDates({ ...dates, checkIn: e.target.value })} />
        <input type="date" className="border p-2 rounded"
          onChange={(e) => setDates({ ...dates, checkOut: e.target.value })} />
      </div>
      {msg && <p className="mb-3 font-semibold text-indigo-700">{msg}</p>}
      <div className="grid sm:grid-cols-2 gap-4">
        {rooms.map((r) => (
          <div key={r._id} className="bg-white rounded-xl shadow overflow-hidden">
            <img src={r.image} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-bold">{r.type} (Room {r.number})</h3>
              <p>₹{r.price} / night</p>
              <button onClick={() => book(r._id)}
                className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}