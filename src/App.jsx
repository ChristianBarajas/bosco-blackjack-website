import { useEffect, useRef, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

function Reveal({ children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("show");
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
      }
    );

    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

function App() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    hours: "",
    location: "",
    notes: "",
  });

  const [status, setStatus] = useState("");
  const [mediaIndex, setMediaIndex] = useState(0);

  const mediaItems = [
    {
      type: "image",
      src: "/bosco-dealer.jpeg",
      alt: "Bosco Blackjack professional dealer",
    },
    {
      type: "image",
      src: "/bosco-action.jpeg",
      alt: "Bosco Blackjack event",
    },
    {
      type: "video",
      src: "/blackjack-action.mp4",
      alt: "Blackjack event action",
    },
    {
      type: "video",
      src: "/bosco-2.mp4",
      alt: "Bosco Blackjack private event",
    },
  ];

  const currentMedia = mediaItems[mediaIndex];

  function showPreviousMedia() {
    setMediaIndex((current) =>
      current === 0 ? mediaItems.length - 1 : current - 1
    );
  }

  function showNextMedia() {
    setMediaIndex((current) =>
      current === mediaItems.length - 1 ? 0 : current + 1
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function selectPackage(packageValue) {
    setFormData((previous) => ({
      ...previous,
      hours: packageValue,
    }));
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
        hours: "",
        location: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      setStatus("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="site">
      <nav className="nav">
        <a href="#top" className="brand">
          <span className="brandMark">BB</span>
          <span>Bosco Blackjack</span>
        </a>

        <div className="navLinks">
          <a href="#experience">Experience</a>
          <a href="#rates">Rates</a>
          <a href="#gallery">Gallery</a>
          <a href="#booking" className="navBook">
            Book Now
          </a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="heroGlow heroGlowOne" />
        <div className="heroGlow heroGlowTwo" />

        <div className="floatingSuit suitOne">♠</div>
        <div className="floatingSuit suitTwo">♦</div>
        <div className="floatingSuit suitThree">♣</div>

        <div className="heroContent">
          <div className="heroCopy">
            <p className="eyebrow">
              Private Parties · Corporate Events · Casino Nights
            </p>

            <h1>
              Casino energy.
              <span>Your event.</span>
            </h1>

            <p className="heroText">
              Bring the blackjack experience directly to your event with a
              professional table setup, casino chips, cards, card shuffler,
              and optional professional dealer.
            </p>

            <div className="heroButtons">
              <a href="#booking" className="primaryButton">
                Book Your Event
                <span>→</span>
              </a>

              <a href="#rates" className="secondaryButton">
                View Packages
              </a>
            </div>

            <div className="heroStats">
              <div>
                <strong>♠</strong>
                <span>Professional Table</span>
              </div>

              <div>
                <strong>♦</strong>
                <span>Dealer Available</span>
              </div>

              <div>
                <strong>♣</strong>
                <span>Full Setup Included</span>
              </div>
            </div>
          </div>

          <div className="heroVisual">
            <div className="heroFrame">
              <img
                src="/bosco-dealer.jpeg"
                alt="Bosco Blackjack professional dealer"
              />

              <div className="heroFrameOverlay" />

              <div className="heroBadge">
                <span className="liveDot" />
                Southern California
              </div>

              <div className="heroCaption">
                <span>Private Casino Experience</span>
                <strong>Bosco Blackjack</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ticker">
        <div className="tickerTrack">
          <span>♠ PRIVATE PARTIES</span>
          <span>♦ CORPORATE EVENTS</span>
          <span>♣ CASINO NIGHTS</span>
          <span>♥ BIRTHDAYS</span>
          <span>♠ PRIVATE PARTIES</span>
          <span>♦ CORPORATE EVENTS</span>
          <span>♣ CASINO NIGHTS</span>
          <span>♥ BIRTHDAYS</span>
        </div>
      </section>

      <section className="section" id="experience">
        <Reveal>
          <div className="sectionHeading">
            <p className="sectionEyebrow">THE EXPERIENCE</p>

            <h2>Everything you need for the table.</h2>

            <p>
              Every rental comes ready for blackjack night with the equipment
              you need to get the game going.
            </p>
          </div>
        </Reveal>

        <div className="featureGrid">
          <Reveal>
            <article className="featureCard">
              <span className="featureNumber">01</span>
              <div className="featureIcon">♠</div>
              <h3>Blackjack Table</h3>

              <p>
                A dedicated blackjack table setup that brings the casino
                experience directly to your party or event.
              </p>
            </article>
          </Reveal>

          <Reveal>
            <article className="featureCard">
              <span className="featureNumber">02</span>
              <div className="featureIcon redSuit">♦</div>
              <h3>Professional Dealer</h3>

              <p>
                Choose our full-service package and have a professional dealer
                run the table throughout your event.
              </p>
            </article>
          </Reveal>

          <Reveal>
            <article className="featureCard">
              <span className="featureNumber">03</span>
              <div className="featureIcon">♣</div>
              <h3>Chips, Cards & Shuffler</h3>

              <p>
                Casino chips, playing cards, and a card shuffler are included
                with every table rental.
              </p>
            </article>
          </Reveal>

          <Reveal>
            <article className="featureCard">
              <span className="featureNumber">04</span>
              <div className="featureIcon redSuit">♥</div>
              <h3>Setup & Breakdown</h3>

              <p>
                Bosco handles the table setup and breakdown so you can focus
                on your guests and enjoy the event.
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="ratesSection" id="rates">
        <Reveal>
          <div className="sectionHeading">
            <p className="sectionEyebrow">EVENT PACKAGES</p>

            <h2>Choose your setup.</h2>

            <p>
              Rent the complete blackjack table setup or add a professional
              dealer to run the game.
            </p>
          </div>
        </Reveal>

        <div className="pricingGrid">
          <Reveal>
            <article className="priceCard">
              <p className="priceLabel">TABLE RENTAL</p>

              <h3>3–4 Hours · No Dealer</h3>

              <div className="price">$185</div>

              <p>
                Includes the blackjack table, casino chips, playing cards,
                card shuffler, setup, and breakdown.
              </p>

              <a
                href="#booking"
                onClick={() =>
                  selectPackage("3-4 Hours - Table Rental - No Dealer")
                }
              >
                Request Table Rental →
              </a>
            </article>
          </Reveal>

          <Reveal className="featuredPriceWrap">
            <article className="priceCard featuredPrice">
              <div className="popularBadge">FULL SERVICE</div>

              <p className="priceLabel">TABLE + DEALER</p>

              <h3>3–4 Hours · Dealer Included</h3>

              <div className="price">$240</div>

              <p>
                Includes the blackjack table, professional dealer, casino
                chips, playing cards, card shuffler, setup, and breakdown.
              </p>

              <a
                href="#booking"
                onClick={() =>
                  selectPackage("3-4 Hours - Table + Professional Dealer")
                }
              >
                Request Full Service →
              </a>
            </article>
          </Reveal>

          <Reveal>
            <article className="priceCard">
              <p className="priceLabel">EXTENDED RENTAL</p>

              <h3>8 Hours · No Dealer</h3>

              <div className="price">$220</div>

              <p>
                Keep the table for up to 8 hours. Includes casino chips,
                playing cards, card shuffler, setup, and breakdown.
              </p>

              <a
                href="#booking"
                onClick={() =>
                  selectPackage("8 Hours - Extended Table Rental - No Dealer")
                }
              >
                Request Extended Rental →
              </a>
            </article>
          </Reveal>

          <Reveal>
            <article className="priceCard">
              <p className="priceLabel">DOUBLE TABLE PACKAGE</p>

              <h3>3–4 Hours · 2 Tables + 2 Dealers</h3>

              <div className="price">$600</div>

              <p>
                Includes two blackjack tables, two professional dealers,
                casino chips, playing cards, card shufflers, setup, and
                breakdown.
              </p>

              <a
                href="#booking"
                onClick={() =>
                  selectPackage(
                    "3-4 Hours - 2 Tables + 2 Professional Dealers"
                  )
                }
              >
                Request Double Table Package →
              </a>
            </article>
          </Reveal>
        </div>

        <p className="transportNote">
          All packages include chips, cards, and a card shuffler.
          Transportation fee may vary depending on event location.
        </p>
      </section>

      <section className="gallerySection" id="gallery">
        <Reveal>
          <div className="sectionHeading leftHeading">
            <p className="sectionEyebrow">RECENT EVENTS</p>

            <h2>See Bosco in action.</h2>

            <p>
              Actual setups, actual events, and the experience your guests can
              expect.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="galleryLayout">
            <div className="mediaViewer">
              <button
                type="button"
                className="mediaArrow leftArrow"
                onClick={showPreviousMedia}
                aria-label="Previous media"
              >
                ‹
              </button>

              {currentMedia.type === "image" ? (
                <img
                  key={currentMedia.src}
                  className="mediaItem"
                  src={currentMedia.src}
                  alt={currentMedia.alt}
                  loading="lazy"
                />
              ) : (
                <video
                  key={currentMedia.src}
                  className="mediaItem"
                  controls
                  preload="metadata"
                  playsInline
                >
                  <source src={currentMedia.src} type="video/mp4" />
                </video>
              )}

              <button
                type="button"
                className="mediaArrow rightArrow"
                onClick={showNextMedia}
                aria-label="Next media"
              >
                ›
              </button>

              <div className="mediaLabel">
                {currentMedia.type === "video"
                  ? "WATCH EVENT"
                  : "EVENT PHOTO"}
              </div>
            </div>

            <div className="gallerySide">
              <div>
                <span className="galleryCount">
                  0{mediaIndex + 1}
                  <small>/ 0{mediaItems.length}</small>
                </span>

                <h3>Real casino-night energy.</h3>

                <p>
                  Use the arrows to look through recent Bosco Blackjack events.
                  Videos only load when selected, helping the site stay fast.
                </p>
              </div>

              <div className="galleryDots">
                {mediaItems.map((item, index) => (
                  <button
                    type="button"
                    key={item.src}
                    className={index === mediaIndex ? "activeDot" : ""}
                    onClick={() => setMediaIndex(index)}
                    aria-label={`View media ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bookingSection" id="booking">
        <Reveal>
          <div className="bookingShell">
            <div className="bookingIntro">
              <p className="sectionEyebrow">REQUEST YOUR DATE</p>

              <h2>
                Ready to bring the
                <span>casino to you?</span>
              </h2>

              <p>
                Send the event details below. Bosco will follow up to confirm
                availability, your selected package, and transportation.
              </p>

              <div className="bookingDetails">
                <div>
                  <span>01</span>
                  Choose your table package
                </div>

                <div>
                  <span>02</span>
                  Submit your event details
                </div>

                <div>
                  <span>03</span>
                  Bosco confirms availability
                </div>
              </div>
            </div>

            <form className="bookingForm" onSubmit={handleSubmit}>
              <div className="formRow">
                <label>
                  Full Name
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </label>

                <label>
                  Phone Number
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 555-5555"
                    required
                  />
                </label>
              </div>

              <div className="formRow">
                <label>
                  Email
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    type="email"
                    required
                  />
                </label>

                <label>
                  Event Date
                  <input
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    type="date"
                    required
                  />
                </label>
              </div>

              <div className="formRow">
                <label>
                  Package
                  <select
                    name="hours"
                    value={formData.hours}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select package</option>

                    <option value="3-4 Hours - Table Rental - No Dealer">
                      $185 — 3–4 Hours — No Dealer
                    </option>

                    <option value="3-4 Hours - Table + Professional Dealer">
                      $240 — 3–4 Hours — With Dealer
                    </option>

                    <option value="8 Hours - Extended Table Rental - No Dealer">
                      $220 — 8 Hours — No Dealer
                    </option>

                    <option value="3-4 Hours - 2 Tables + 2 Professional Dealers">
                      $600 — 3–4 Hours — 2 Tables + 2 Dealers
                    </option>
                  </select>
                </label>

                <label>
                  Event Location
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City or venue"
                    required
                  />
                </label>
              </div>

              <label>
                Event Details
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Tell Bosco about the party, estimated guests, or anything else he should know..."
                />
              </label>

              <button type="submit" className="submitButton">
                Submit Booking Request
                <span>→</span>
              </button>

              {status && <p className="formStatus">{status}</p>}
            </form>
          </div>
        </Reveal>
      </section>

      <section className="localSection">
        <Reveal>
          <div className="localCard">
            <p className="sectionEyebrow">BASED IN BELLFLOWER, CALIFORNIA</p>

            <h2>
              Based in Bellflower.
              <span> Bringing the casino to you.</span>
            </h2>

            <p>
              Bosco Blackjack is based out of Bellflower, CA and proudly serves
              Los Angeles County, Orange County, and surrounding areas. From
              backyard parties to private events, we bring the tables, chips,
              cards, shufflers, and dealers straight to your event.
            </p>

            <div className="localTags">
              <span>Bellflower, CA</span>
              <span>Los Angeles County</span>
              <span>Orange County</span>
              <span>We Travel To You</span>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="contactSection">
        <Reveal>
          <p>QUESTIONS BEFORE BOOKING?</p>

          <h2>Talk directly with Bosco.</h2>

          <a href="mailto:boscoblackjack@gmail.com">
            boscoblackjack@gmail.com
            <span>↗</span>
          </a>
        </Reveal>
      </section>

      <footer>
        <div className="footerBrand">
          <span className="brandMark">BB</span>

          <div>
            <strong>Bosco Blackjack</strong>
            <p>Private casino experiences in Southern California.</p>
          </div>
        </div>

        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}

export default App;