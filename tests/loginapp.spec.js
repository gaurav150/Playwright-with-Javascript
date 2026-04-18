/**
 * EventHub E2E: admin creates event → user books → seats decrease by 1.
 *
 * Credentials: set EVENTHUB_EMAIL and EVENTHUB_PASSWORD, or edit defaults below.
 * Register at https://eventhub.rahulshettyacademy.com if needed.
 */

const { test, expect } = require("@playwright/test");

const BASE_URL = "https://eventhub.rahulshettyacademy.com";

/** @type {string} */
const EVENTHUB_EMAIL =
  process.env.EVENTHUB_EMAIL ?? "ankit@example.com";
/** @type {string} */
const EVENTHUB_PASSWORD =
  process.env.EVENTHUB_PASSWORD ?? "Ankit@123";

/**
 * Returns a value suitable for HTML datetime-local inputs (future date).
 */
function futureDateValue() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  d.setHours(18, 30, 0, 0);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * @param {import('@playwright/test').Page} page
 */
async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder("you@email.com").fill(EVENTHUB_EMAIL);
  await page.getByLabel("Password", { exact: true }).fill(EVENTHUB_PASSWORD);
  await page.locator("#login-btn").click();
  // Hero CTA is "Browse Events →"; footer also has "Browse Events" — use exact name to avoid strict mode violation.
  await expect(
    page.getByRole("link", { name: "Browse Events →" }),
  ).toBeVisible();
}

/**
 * @param {import('@playwright/test').Locator} card
 */
async function readSeatCountFromCard(card) {
  const seatLine = card.getByText(/seat/i).first();
  await seatLine.waitFor({ state: "visible", timeout: 5000 });
  const text = await seatLine.innerText();
  const m = text.match(/\d+/);
  if (!m) {
    throw new Error(`Could not parse seat count from: ${text}`);
  }
  return parseInt(m[0], 10);
}

test.describe("EventHub — create event, book, verify seats -1", () => {
  test("admin creates event, booking completes, seat count drops by 1", async ({
    page,
  }) => {
    const eventTitle = `Test Event ${Date.now()}`;
    let seatsBeforeBooking;
    let bookingRef;

    // Step 1 — Login
    await login(page);

    // Step 2 — Create a new event
    await page.goto(`${BASE_URL}/admin/events`);
    await page.locator("#event-title-input").fill(eventTitle);
    await page.locator("#admin-event-form textarea").fill(
      "Automated test event description.",
    );
    const adminForm = page.locator("#admin-event-form");
    // Labels in the UI include required markers (e.g. "City*") — getByLabel("City") does not match.
    await adminForm.getByLabel("City*").fill("Bengaluru");
    await adminForm.getByLabel("Venue*").fill("Test Arena");
    await adminForm.getByLabel("Event Date & Time*").fill(futureDateValue());
    await adminForm.getByLabel("Price ($)*").fill("100");
    await adminForm.getByLabel("Total Seats*").fill("50");
    await page.locator("#add-event-btn").click();
    await expect(page.getByText(/Event created!/)).toBeVisible();

    // Step 3 — Find the event card and capture seats
    await page.goto(`${BASE_URL}/events`);
    const eventCards = page.locator('[data-testid="event-card"]');
    await expect(eventCards.first()).toBeVisible();
    const myEventCard = eventCards.filter({ hasText: eventTitle });
    await expect(myEventCard).toBeVisible({ timeout: 5000 });
    seatsBeforeBooking = await readSeatCountFromCard(myEventCard);

    // Step 4 — Start booking
    await myEventCard.getByTestId("book-now-btn").click();

    // Step 5 — Fill booking form (labels use required asterisks: "Full Name*", "Email*", etc.)
    const bookingPanel = page.locator("main").filter({ hasText: "Book Tickets" });
    await expect(bookingPanel.getByRole("heading", { name: "Book Tickets" })).toBeVisible();
    await expect(
      bookingPanel.getByRole("button", { name: "+" }).locator("xpath=preceding-sibling::*[1]"),
    ).toHaveText("1");
    await bookingPanel.getByLabel("Full Name*").fill("Automation User");
    await bookingPanel.getByLabel("Email*").fill("customer@test.example.com");
    await bookingPanel.getByLabel("Phone Number*").fill("+91 9876543210");
    await bookingPanel.getByRole("button", { name: "Confirm Booking" }).click();

    // Step 6 — Verify booking confirmation
    const bookingRefEl = page.locator(".booking-ref").first();
    await expect(bookingRefEl).toBeVisible();
    bookingRef = (await bookingRefEl.innerText()).trim();

    // Step 7 — Verify in My Bookings
    await page.getByRole("link", { name: /View My Bookings/i }).click();
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);
    const bookingCards = page.locator("#booking-card");
    await expect(bookingCards.first()).toBeVisible();
    const myBookingCard = bookingCards.filter({ hasText: bookingRef });
    await expect(myBookingCard).toBeVisible();
    await expect(myBookingCard).toContainText(eventTitle);

    // Step 8 — Verify seat reduction
    await page.goto(`${BASE_URL}/events`);
    await expect(page.locator('[data-testid="event-card"]').first()).toBeVisible();
    const myCardAgain = page
      .locator('[data-testid="event-card"]')
      .filter({ hasText: eventTitle });
    await expect(myCardAgain).toBeVisible();
    const seatsAfterBooking = await readSeatCountFromCard(myCardAgain);

    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
  });
});

module.exports = { login, futureDateValue, BASE_URL };
