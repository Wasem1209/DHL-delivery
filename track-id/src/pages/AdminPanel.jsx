import React, { useState } from "react";
import "./AdminPanel.css"

function AdminPanel() {
  const [trackingID, setTrackingID] = useState("");
  const [progress, setProgress] = useState(0);
  const [note, setNote] = useState("");
  const [shipper, setShipper] = useState({ name: "", address: "" });
  const [receiver, setReceiver] = useState({ name: "", address: "" });
  const [contents, setContents] = useState([
    { serial: 1, quantity: 1, item: "" }
  ]);
  const [history, setHistory] = useState([
    { date: "", activity: "", details: "" }
  ]);

  const generateTrackingID = () => {
    const num = Math.floor(Math.random() * 90000000) + 10000000;
    setTrackingID(`AA${num}US`);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();


    
    

    const payload = {
      tracking_id: trackingID,
      progress,
      note,
      shipper,
      receiver,
      contents,
      travel_history: history
    };
    

    try {
      
      const res = await fetch(`https://asema-5.onrender.com/api/admin/add`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      alert(result.message || "Shipment saved!");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit shipment.");
    }
    
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <button onClick={generateTrackingID}>Create Tracking ID</button>
      <p><strong>Tracking ID:</strong> {trackingID}</p>

      <form onSubmit={handleSubmit}>
        <h3>Progress</h3>
        <input
          type="number"
          value={progress}
          min={0}
          max={4}
          onChange={(e) => setProgress(Number(e.target.value))}
          placeholder="0–4"
          required
        />

        <h3>Note</h3>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Shipment note"
          required
        />

        <h3>Shipper</h3>
        <input
          type="text"
          value={shipper.name}
          onChange={(e) => setShipper({ ...shipper, name: e.target.value })}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={shipper.address}
          onChange={(e) => setShipper({ ...shipper, address: e.target.value })}
          placeholder="Address"
          required
        />

        <h3>Receiver</h3>
        <input
          type="text"
          value={receiver.name}
          onChange={(e) => setReceiver({ ...receiver, name: e.target.value })}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={receiver.address}
          onChange={(e) => setReceiver({ ...receiver, address: e.target.value })}
          placeholder="Address"
          required
        />

        <h3>Contents</h3>
        {contents.map((item, index) => (
          <div key={index}>
            <input
              type="number"
              value={item.serial}
              onChange={(e) => {
                const newContents = [...contents];
                newContents[index].serial = parseInt(e.target.value);
                setContents(newContents);
              }}
              placeholder="Serial"
              required
            />
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => {
                const newContents = [...contents];
                newContents[index].quantity = parseInt(e.target.value);
                setContents(newContents);
              }}
              placeholder="Quantity"
              required
            />
            <input
              type="text"
              value={item.item}
              onChange={(e) => {
                const newContents = [...contents];
                newContents[index].item = e.target.value;
                setContents(newContents);
              }}
              placeholder="Item"
              required
            />
          </div>
        ))}

        <h3>Travel History</h3>
        {history.map((event, index) => (
          <div key={index}>
            <input
              type="text"
              value={event.date}
              onChange={(e) => {
                const newHistory = [...history];
                newHistory[index].date = e.target.value;
                setHistory(newHistory);
              }}
              placeholder="Date"
              required
            />
            <input
              type="text"
              value={event.activity}
              onChange={(e) => {
                const newHistory = [...history];
                newHistory[index].activity = e.target.value;
                setHistory(newHistory);
              }}
              placeholder="Activity"
              required
            />
            <input
              type="text"
              value={event.details}
              onChange={(e) => {
                const newHistory = [...history];
                newHistory[index].details = e.target.value;
                setHistory(newHistory);
              }}
              placeholder="Details"
              required
            />
          </div>
        ))}

        <button type="submit">Save Shipment</button>
      </form>
    </div>
  );
}

export default AdminPanel;
