
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

function formatTime(value) {
  if (
    typeof value !== "string" ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)
  ) {
    return "Not specified";
  }

  const [hour, minute] = value.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";

  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${period}`;
}

function formatDate(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return value || "Not specified";
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function detailRow(label, value) {
  return `
    <tr>
      <td style="
        padding: 14px;
        color: #9eaaa2;
        font-size: 13px;
        border-bottom: 1px solid #344636;
        vertical-align: top;
        width: 36%;
      ">
        ${escapeHtml(label)}
      </td>
      <td style="
        padding: 14px;
        color: #f6f3e9;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #344636;
        vertical-align: top;
        overflow-wrap: anywhere;
      ">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
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

    const name = String(booking.name || "Not provided");
    const email = String(booking.email || "");
    const phone = String(booking.phone || "Not provided");
    const location = String(booking.location || "Not provided");
    const packageName = String(booking.hours || "Not provided");

    const eventDate = formatDate(booking.eventDate);
    const partyTime = formatTime(booking.eventStartTime);
    const setupTime = formatTime(booking.setupTime);

    const notes = String(
      booking.notes || "No additional details provided."
    );

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const replyEmail = validEmail
      ? email
      : "boscoblackjack@gmail.com";

    const replyLink =
      `mailto:${encodeURIComponent(replyEmail)}` +
      `?subject=${encodeURIComponent(
        "Re: Your Bosco Blackjack booking request"
      )}`;

    const html = `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background: #eef0ec;
        font-family: Arial, Helvetica, sans-serif;
      ">

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="background:#eef0ec;padding:28px 12px;"
        >
          <tr>
            <td align="center">

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  max-width:620px;
                  background:#101812;
                  border:1px solid #263629;
                  border-radius:16px;
                  overflow:hidden;
                "
              >

                <!-- HEADER -->
                <tr>
                  <td style="
                    padding:36px 32px;
                    background:#162419;
                    border-bottom:3px solid #c8a652;
                  ">

                    <div style="
                      color:#d7bb77;
                      font-size:12px;
                      letter-spacing:3px;
                      font-weight:bold;
                    ">
                      ♠ BOSCO BLACKJACK
                    </div>

                    <h1 style="
                      margin:18px 0 10px;
                      color:#fff7e7;
                      font-size:32px;
                      line-height:1.2;
                    ">
                      New Booking Request
                    </h1>

                    <p style="
                      margin:0;
                      color:#b9c7bd;
                      font-size:14px;
                      line-height:1.7;
                    ">
                      A customer has requested a private casino
                      experience. Review their event information below.
                    </p>

                  </td>
                </tr>

                <!-- EVENT SCHEDULE -->
                <tr>
                  <td style="padding:30px 26px 12px;">

                    <div style="
                      font-size:12px;
                      letter-spacing:2px;
                      color:#d7bb77;
                      font-weight:bold;
                      margin-bottom:14px;
                    ">
                      EVENT SCHEDULE
                    </div>

                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background:#1c2b20;
                        border:1px solid #344636;
                        border-radius:10px;
                      "
                    >
                      <tr>

                        <td width="50%" style="
                          padding:22px 16px;
                          border-right:1px solid #344636;
                          vertical-align:top;
                        ">
                          <div style="
                            color:#aebcaf;
                            font-size:12px;
                            margin-bottom:10px;
                          ">
                            Party Starts
                          </div>

                          <div style="
                            color:#f6edcf;
                            font-size:23px;
                            font-weight:bold;
                          ">
                            ${escapeHtml(partyTime)}
                          </div>
                        </td>

                        <td width="50%" style="
                          padding:22px 16px;
                          vertical-align:top;
                        ">
                          <div style="
                            color:#aebcaf;
                            font-size:12px;
                            margin-bottom:10px;
                          ">
                            Preferred Setup
                          </div>

                          <div style="
                            color:#f6edcf;
                            font-size:23px;
                            font-weight:bold;
                          ">
                            ${escapeHtml(setupTime)}
                          </div>
                        </td>

                      </tr>
                    </table>

                    <p style="
                      color:#e7ebdf;
                      font-size:15px;
                      margin:20px 2px 0;
                      line-height:1.6;
                    ">
                      <strong>Event Date:</strong>
                      ${escapeHtml(eventDate)}
                    </p>

                  </td>
                </tr>

                <!-- PACKAGE -->
                <tr>
                  <td style="padding:24px 26px 10px;">

                    <div style="
                      font-size:12px;
                      letter-spacing:2px;
                      color:#d7bb77;
                      font-weight:bold;
                      margin-bottom:14px;
                    ">
                      PACKAGE REQUESTED
                    </div>

                    <div style="
                      background:#1c2b20;
                      border-left:4px solid #c8a652;
                      padding:22px 18px;
                      border-radius:6px;
                      color:#fff7e7;
                      font-size:19px;
                      font-weight:bold;
                      line-height:1.5;
                    ">
                      ${escapeHtml(packageName)}
                    </div>

                  </td>
                </tr>

                <!-- CUSTOMER DETAILS -->
                <tr>
                  <td style="padding:26px 26px 10px;">

                    <div style="
                      font-size:12px;
                      letter-spacing:2px;
                      color:#d7bb77;
                      font-weight:bold;
                      margin-bottom:14px;
                    ">
                      CUSTOMER INFORMATION
                    </div>

                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background:#1c2b20;
                        border-collapse:collapse;
                        border-radius:8px;
                      "
                    >
                      ${detailRow("Name", name)}
                      ${detailRow("Email", email || "Not provided")}
                      ${detailRow("Phone", phone)}
                      ${detailRow("Event Location", location)}
                    </table>

                  </td>
                </tr>

                <!-- NOTES -->
                <tr>
                  <td style="padding:26px 26px 12px;">

                    <div style="
                      font-size:12px;
                      letter-spacing:2px;
                      color:#d7bb77;
                      font-weight:bold;
                      margin-bottom:14px;
                    ">
                      ADDITIONAL EVENT DETAILS
                    </div>

                    <div style="
                      background:#1c2b20;
                      padding:20px;
                      border-radius:8px;
                      color:#e8e9e2;
                      line-height:1.8;
                      font-size:14px;
                      white-space:pre-wrap;
                      overflow-wrap:anywhere;
                    ">
                      ${escapeHtml(notes)}
                    </div>

                  </td>
                </tr>

                <!-- ACTION -->
                <tr>
                  <td align="center" style="
                    padding:26px 26px 34px;
                  ">

                    <a
                      href="${escapeHtml(replyLink)}"
                      style="
                        display:block;
                        text-decoration:none;
                        color:#162015;
                        background:#dfc075;
                        border-radius:7px;
                        padding:18px 20px;
                        font-size:16px;
                        font-weight:bold;
                      "
                    >
                      Reply to Customer →
                    </a>

                    <p style="
                      margin:18px 0 0;
                      color:#abb8ac;
                      font-size:12px;
                      line-height:1.7;
                    ">
                      This is a booking request, not a confirmed
                      reservation. Contact the customer to confirm
                      availability and setup details.
                    </p>

                  </td>
                </tr>

              </table>

              <p style="
                font-size:12px;
                color:#59665e;
                margin:20px 0 0;
              ">
                Bosco Blackjack · boscoblackjack.com
              </p>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `;

    const resend = new Resend(resendApiKey.value());

    const { data, error } = await resend.emails.send({
      from: "Bosco Blackjack <bookings@mail.boscoblackjack.com>",
      to: ["boscoblackjack@gmail.com"],
      replyTo: replyEmail,
      subject: `New Bosco Blackjack Booking - ${name.replace(
        /[\r\n]/g,
        " "
      )}`,
      html,
    });

    if (error) {
      logger.error("Resend error", {
        error,
        bookingId: event.params.bookingId,
      });

      throw new Error(
        error.message || "Resend failed to send booking email."
      );
    }

    logger.info("Booking email sent successfully", {
      bookingId: event.params.bookingId,
      resendEmailId: data?.id,
    });
  }
);
