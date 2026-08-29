const { setGlobalOptions } = require("firebase-functions/v2");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const { Resend } = require("resend");

setGlobalOptions({
  maxInstances: 10,
  region: "us-west2",
});

const resendApiKey = defineSecret("RESEND_API_KEY");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

exports.sendBookingEmail = onDocumentCreated(
  {
    document: "bookingRequests/{bookingId}",
    secrets: [resendApiKey],
  },
  async (event) => {
    const booking = event.data?.data();

    if (!booking) {
      logger.error("No booking data found.");
      return;
    }

    const resend = new Resend(resendApiKey.value());

    const name = escapeHtml(booking.name || "Not provided");
    const phone = escapeHtml(booking.phone || "Not provided");
    const email = escapeHtml(booking.email || "Not provided");
    const eventDate = escapeHtml(booking.eventDate || "Not provided");
    const hours = escapeHtml(booking.hours || "Not provided");
    const location = escapeHtml(booking.location || "Not provided");
    const notes = escapeHtml(
      booking.notes || "No additional information provided."
    );

    const { data, error } = await resend.emails.send({
      from: "Bosco Blackjack <bookings@mail.boscoblackjack.com>",
      to: ["boscoblackjack@gmail.com"],
      replyTo: booking.email,
      subject: `New Bosco Blackjack Booking - ${booking.name || "New Customer"}`,

      html: `
        <div style="
          max-width: 620px;
          margin: 0 auto;
          background: #080b09;
          color: #f4f1e8;
          font-family: Arial, Helvetica, sans-serif;
          border: 1px solid #cba54a;
        ">

          <div style="
            padding: 32px;
            background: linear-gradient(135deg, #111812, #080b09);
            border-bottom: 1px solid #cba54a;
          ">
            <div style="
              color: #d8af4a;
              font-size: 12px;
              letter-spacing: 3px;
              text-transform: uppercase;
              margin-bottom: 12px;
            ">
              New Booking Request
            </div>

            <h1 style="
              margin: 0;
              color: #f1d478;
              font-size: 30px;
            ">
              Bosco Blackjack
            </h1>
          </div>

          <div style="padding: 32px;">
            <p style="
              margin-top: 0;
              color: #aaa;
              line-height: 1.6;
            ">
              A new booking request was submitted through
              boscoblackjack.com.
            </p>

            <table
              cellpadding="0"
              cellspacing="0"
              style="
                width: 100%;
                border-collapse: collapse;
                margin-top: 28px;
              "
            >
              <tr>
                <td style="padding: 14px 0; color: #888;">Name</td>
                <td style="padding: 14px 0; text-align: right;">
                  <strong>${name}</strong>
                </td>
              </tr>

              <tr style="border-top: 1px solid #282c29;">
                <td style="padding: 14px 0; color: #888;">Phone</td>
                <td style="padding: 14px 0; text-align: right;">
                  ${phone}
                </td>
              </tr>

              <tr style="border-top: 1px solid #282c29;">
                <td style="padding: 14px 0; color: #888;">Email</td>
                <td style="padding: 14px 0; text-align: right;">
                  ${email}
                </td>
              </tr>

              <tr style="border-top: 1px solid #282c29;">
                <td style="padding: 14px 0; color: #888;">Event Date</td>
                <td style="padding: 14px 0; text-align: right;">
                  ${eventDate}
                </td>
              </tr>

              <tr style="border-top: 1px solid #282c29;">
                <td style="padding: 14px 0; color: #888;">
                  Hours Requested
                </td>
                <td style="padding: 14px 0; text-align: right;">
                  ${hours}
                </td>
              </tr>

              <tr style="border-top: 1px solid #282c29;">
                <td style="padding: 14px 0; color: #888;">
                  Event Location
                </td>
                <td style="padding: 14px 0; text-align: right;">
                  ${location}
                </td>
              </tr>
            </table>

            <div style="
              margin-top: 28px;
              padding: 20px;
              background: #101411;
              border-left: 3px solid #d8af4a;
            ">
              <div style="
                color: #d8af4a;
                font-size: 11px;
                font-weight: bold;
                letter-spacing: 2px;
                text-transform: uppercase;
                margin-bottom: 10px;
              ">
                Event Details
              </div>

              <div style="
                color: #d2d4d2;
                line-height: 1.7;
                white-space: pre-wrap;
              ">
                ${notes}
              </div>
            </div>

            <p style="
              margin: 30px 0 0;
              color: #777;
              font-size: 12px;
              line-height: 1.6;
            ">
              Reply directly to this email to respond to the customer.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      logger.error("Resend error", {
        error,
        bookingId: event.params.bookingId,
      });

      throw new Error(error.message || "Resend failed to send booking email.");
    }

    logger.info("Booking email sent successfully", {
      bookingId: event.params.bookingId,
      resendEmailId: data?.id,
    });
  }
);