import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ResultPage.css";

function ResultsPage() {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://asema-5.onrender.com/track/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.message) {
          setShipment(data);
        } else {
          setShipment(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching shipment:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loader">Loading shipment info...</div>;
  if (!shipment) return <p>🚫 No shipment found for ID: {id}</p>;

  const {
    shipper = {},
    receiver = {},
    contents = [],
    travel_history = [],
    note = "",
    progress = 0,
    on_hold = false, // 👈 Default false if not present
  } = shipment;

  return (
    <div className="results-page">
      <h2>Tracking Info for: <strong>{id}</strong></h2>

      <section className="progress-container">
        <h3>Shipment Progress</h3>
        <div className="progress-bar">
          {["Ordered", "Processed", "Shipped", "In Transit", "Delivered"].map((step, index) => {
            let stepClass = "progress-step";
            if (progress >= index) {
              stepClass += " active";
            }

            // Special case: "In Transit" & on_hold === true
            if (index === 3 && on_hold) {
              stepClass += " on-hold";
            }

            return (
              <div key={index} className={stepClass}>
                <div className="circle">{index + 1}</div>
                <p>{step}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="shipment-profile">
        <h3>Shipment Profile</h3>
        <div className="profile-columns">
          <div className="column">
            <h4>Shipper</h4>
            <p><strong>Name:</strong> {shipper.name}</p>
            <p><strong>Address:</strong> {shipper.address}</p>
          </div>
          <div className="column">
            <h4>Receiver</h4>
            <p><strong>Name:</strong> {receiver.name}</p>
            <p><strong>Address:</strong> {receiver.address}</p>
          </div>
        </div>
      </section>

      <section>
        <h3>Shipment Description</h3>
        <table className="description-table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Quantity</th>
              <th>Item</th>
            </tr>
          </thead>
          <tbody>
            {contents.length > 0 ? (
              contents.map((item, index) => (
                <tr key={index}>
                  <td>{item.serial}</td>
                  <td>{item.quantity}</td>
                  <td>{item.item}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3">No contents listed.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Shipment Travel History</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Activity</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {travel_history.length > 0 ? (
              travel_history.map((event, index) => (
                <tr key={index}>
                  <td>{event.date}</td>
                  <td>{event.activity}</td>
                  <td>{event.details}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3">No travel history available.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Status Note</h3>
        <p>{note || "No note provided."}</p>
      </section>
    </div>
  );
}

export default ResultsPage;
