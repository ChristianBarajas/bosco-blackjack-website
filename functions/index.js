const { setGlobalOptions } = require("firebase-functions/v2");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const { Resend } = require("resend");

setGlobalOptions({ maxInstances: 10, region: "us-west2" });

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
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return "Not specified";
  }
  const [hour, minute] = value.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${period}`;
}

function formatDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value || "Not specified";
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return value;
  }
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  }).format(date);
}

function detailRow(label, value) {
  return `<tr><td style="padding:13px 14px;color:#9eaaa2;font-size:13px;border-bottom:1px solid #273329;vertical-align:top;width:36%;">${escapeHtml(label)}</td><td style="padding:13px 14px;color:#f6f3e9;font-size:14px;font-weight:600;border-bottom:1px solid #273329;vertical-align:top;overflow-wrap:anywhere;">${escapeHtml(value)}</td></tr>`;
}

exports.sendBookingEmail = onDocumentCreated(
  {
    document: "bookingRequests/{bookingId}",
    secrets: [resendApiKey],
  },
  async (event) => {
    const booking = event.data?.data();
    if (!booking) {
      logger.error("No booking data found", { bookingId: event.params.bookingId });
      return;
    }

    const name = String(booking.name || "Not provided");
    const email = String(booking.email || "");
    const phone = String(booking.phone || "Not provided");
    const location = String(booking.location || "Not provided");
    const packageName = String(booking.hours || "Not provided");
    const eventDate = formatDate(booking.eventDate);
    const partyTime = formatTime(booking.eventStartTime);
    const notes = String(booking.notes || "No additional details provided.");
    const replyEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "boscoblackjack@gmail.com";
    const replyLink = `mailto:${encodeURIComponent(replyEmail)}?subject=${encodeURIComponent("Re: Your Bosco Blackjack booking request")}`;

    const html = `
      <!doctype html>
      <html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#eef0ec;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#eef0ec;padding:28px 12px;"><tr><td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:620px;border-collapse:separate;background:#101812;border:1px solid #263629;border-radius:16px;overflow:hidden;">
            <tr><td style="padding:34px 32px 28px;background:#162419;border-bottom:3px solid #c8a652;">
              <div style="color:#d7bb77;font-size:12px;letter-spacing:3px;font-weight:bold;">♠ BOSCO BLACKJACK</div>
              <h1 style="margin:16px 0 8px;color:#fff7e7;font-size:30px;line-height:1.15;">New booking request</h1>
              <p style="margin:0;color:#b9c7bd;font-size:14px;line-height:1.6;">A customer just requested a casino experience. Review the details below and follow up to confirm.</p>
            </td></tr>
            <tr><td style="padding:28px 26px 12px;">
              <div style="font-size:11px;letter-spacing:2px;color:#d7bb77;font-weight:bold;margin-bottom:12px;">EVENT SCHEDULE</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1c2b20;border:1px solid #344636;border-radius:10px;"><tr>
                <td style="padding:22px 20px;vertical-align:top;">
                  <div style="font-size:12px;color:#aebcaf;margin-bottom:8px;">Party start time</div>
                  <div style="font-size:30px;font-weight:bold;color:#f6edcf;">${escapeHtml(partyTime)}</div>
                </td></tr></table>
              <p style="color:#e7ebdf;font-size:14px;margin:16px 2px 0;"><strong>Event date:</strong> ${escapeHtml(eventDate)}</p>
              <p style="color:#aebcaf;font-size:12px;line-height:1.6;margin:10px 2px 0;">Setup typically takes about 5 minutes. Arrival details are coordinated directly with the customer.</p>
            </td></tr>
            <tr><td style="padding:18px 26px 10px;">
              <div style="font-size:11px;letter-spacing:2px;color:#d7bb77;font-weight:bold;margin-bottom:12px;">PACKAGE REQUESTED</div>
              <div style="background:#1c2b20;border-left:4px solid #c8a652;padding:20px 18px;border-radius:6px;color:#fff7e7;font-size:19px;font-weight:bold;line-height:1.45;">${escapeHtml(packageName)}</div>
            </td></tr>
            <tr><td style="padding:20px 26px 10px;">
              <div style="font-size:11px;letter-spacing:2px;color:#d7bb77;font-weight:bold;margin-bottom:12px;">CUSTOMER &amp; LOCATION</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1c2b20;border-collapse:collapse;border-radius:8px;">
                ${detailRow("Name", name)}
                ${detailRow("Email", email || "Not provided")}
                ${detailRow("Phone", phone)}
                ${detailRow("Event location", location)}
              </table>
            </td></tr>
            <tr><td style="padding:20px 26px 12px;">
              <div style="font-size:11px;letter-spacing:2px;color:#d7bb77;font-weight:bold;margin-bottom:12px;">ADDITIONAL EVENT DETAILS</div>
              <div style="background:#1c2b20;padding:18px;color:#e8e9e2;line-height:1.7;font-size:14px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere;">${escapeHtml(notes)}</div>
            </td></tr>
            <tr><td align="center" style="padding:20px 26px 30px;">
              <a href="${escapeHtml(replyLink)}" style="display:block;text-decoration:none;color:#162015;background:#dfc075;border-radius:7px;padding:17px 20px;font-size:16px;font-weight:bold;">Reply to customer →</a>
              <p style="margin:15px 0 0;color:#abb8ac;font-size:12px;line-height:1.6;">This is a booking request, not a confirmed reservation. Reply to coordinate availability and setup details.</p>
            </td></tr>
          </table>
          <p style="font-size:12px;color:#59665e;margin:18px 0 0;">Bosco Blackjack · boscoblackjack.com</p>
        </td></tr></table>
      </body></html>`;

    const resend = new Resend(resendApiKey.value());
    const { data, error } = await resend.emails.send({
      from: "Bosco Blackjack <bookings@mail.boscoblackjack.com>",
      to: ["boscoblackjack@gmail.com"],
      replyTo: replyEmail,
      subject: `New Bosco Blackjack Booking - ${name.replace(/[\r\n]/g, " ")}`,
      html,
    });

    if (error) {
      logger.error("Resend error", { error, bookingId: event.params.bookingId });
      throw new Error(error.message || "Resend failed to send booking email.");
    }

    logger.info("Booking email sent successfully", {
      bookingId: event.params.bookingId,
      resendEmailId: data?.id,
    });
  }
);
