import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    location: "",
    notes: "",
  });

  const [status, setStatus] = useState("");
  const [mediaIndex, setMediaIndex] = useState(0);

  const mediaItems = [
    {
      type: "image",
      src: "/bosco-dealer.jpeg",
      alt: "Bosco Blackjack Dealer",
    },
    {
      type: "video",
      src: "/blackjack-action.mov",
      alt: "Blackjack Action",
    },
    {
      type: "video",
      src: "/bosco-2.mov",
      alt: "Bosco Blackjack Event",
    },
  ];

  const currentMedia = mediaItems[mediaIndex];

  function showPreviousMedia() {
    setMediaIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  }

  function showNextMedia() {
    setMediaIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Submitting...");

    try {
      await addDoc(collection(db, "bookingRequests"), {
        ...formData,
        status: "new",
        createdAt: serverTimestamp(),
      });

      setStatus("Request submitted! Bosco will reach out soon.");

      setFormData({
        name: "",
        phone: "",
        email: "",
        eventDate: "",
        location: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      setStatus("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Private Parties • Corporate Events • Casino Nights</p>

        <h1>
          <span>Bosco Blackjack</span>
        </h1>

        <p className="heroText">
          Bring a real blackjack table to your next event. Professional dealer,
          chips, cards, and setup included.
        </p>

        <a href="#booking" className="button">
          Request Booking
        </a>
      </section>

      <section className="card">
        <h2>What's Included</h2>

        <div className="features">
          <div>♠ Blackjack Table</div>
          <div>♣ Chips & Cards</div>
          <div>♦ Professional Dealer</div>
          <div>♥ Setup & Breakdown</div>
        </div>
      </section>

      <section className="card">
        <h2>Rates</h2>

        <p className="smallText">2 Hour Minimum Booking</p>

        <div className="rates">
          <div>2 Hours .......... $185</div>
          <div>3 Hours .......... $235</div>
          <div>Additional Hour .......... $60+</div>
        </div>

        <p className="smallText">
          Transportation fee varies depending on location.
        </p>
      </section>

      <section id="booking" className="card">
        <h2>Booking Request</h2>

        <form onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" type="email" />
          <input name="eventDate" value={formData.eventDate} onChange={handleChange} placeholder="Event Date" required />
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Event Location" required />
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Tell us about your event..." />
          <button type="submit">Submit Request</button>
        </form>

        {status && <p className="smallText">{status}</p>}
      </section>

      <section className="card contactCard">
        <h2>Contact</h2>
        <p className="smallText">
          Have questions before booking? Reach out anytime.
        </p>
        <a className="emailButton" href="mailto:fatcat5167@gmail.com">
          fatcat5167@gmail.com
        </a>
      </section>

      <section className="card mediaCard">
        <h2>Event Gallery</h2>
        <p className="smallText">
          Real events. Real players. Real casino-night experience.
        </p>

        <div className="mediaViewer">
          <button type="button" className="mediaArrow leftArrow" onClick={showPreviousMedia}>
            ‹
          </button>

          {currentMedia.type === "image" ? (
            <img className="mediaItem" src={currentMedia.src} alt={currentMedia.alt} />
          ) : (
            <video key={currentMedia.src} controls className="mediaItem">
              <source src={currentMedia.src} type="video/quicktime" />
            </video>
          )}

          <button type="button" className="mediaArrow rightArrow" onClick={showNextMedia}>
            ›
          </button>
        </div>

        <p className="mediaCounter">
          {mediaIndex + 1} / {mediaItems.length}
        </p>
      </section>

      <footer>
        <h3>Bosco Blackjack</h3>
        <p>Serving Southern California</p>
      </footer>
    </main>
  );
}

export default App;