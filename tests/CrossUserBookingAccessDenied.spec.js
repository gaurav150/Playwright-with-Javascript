/**
 * Cross-user booking: Yahoo creates booking via API; Gmail user cannot open it in the UI.
 * Fill in credentials or set EVENTHUB_* env vars (see YAHOO_USER / GMAIL_USER below).
 * API docs: https://api.eventhub.rahulshettyacademy.com/api/docs/
 */

const { test, expect } = require("@playwright/test");

const BASE_URL = "https://eventhub.rahulshettyacademy.com";
const API_URL =
  process.env.EVENTHUB_API_URL ??
  "https://api.eventhub.rahulshettyacademy.com/api";

/** Yahoo — API login + booking */
const YAHOO_USER = {
  email:
    process.env.EVENTHUB_YAHOO_EMAIL ??
    process.env.EVENTHUB_EMAIL ??
    "Use your own credentials - 1",
  password:
    process.env.EVENTHUB_YAHOO_PASSWORD ?? process.env.EVENTHUB_PASSWORD ?? "",
};

/** Gmail — UI login (must differ from Yahoo) */
const GMAIL_USER = {
  email:
    process.env.EVENTHUB_GMAIL_EMAIL ??
    process.env.EVENTHUB_SECOND_EMAIL ??
    "Use your own credentials - 2",
  password:
    process.env.EVENTHUB_GMAIL_PASSWORD ??
    process.env.EVENTHUB_SECOND_PASSWORD ??
    "",
};

/**
 * @param {import('@playwright/test').Page} page
 * @param {{ email: string; password: string }} user
 */
async function loginAs(page, user) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder("you@email.com").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  const signIn = page.getByRole("button", { name: /Sign In/i });
  if (await signIn.isVisible().catch(() => false)) {
    await signIn.click();
  } else {
    await page.locator("#login-btn").click();
  }
  await expect(page.getByRole("link", { name: "Browse Events →" })).toBeVisible();
}

/**
 * @param {unknown} body
 * @returns {string}
 */
function readToken(body) {
  if (typeof body !== "object" || body === null) {
    throw new Error("Login response JSON is not an object");
  }
  const b = /** @type {Record<string, unknown>} */ (body);
  const nested =
    typeof b.data === "object" && b.data !== null
      ? /** @type {Record<string, unknown>} */ (b.data)
      : null;
  const token =
    (typeof b.token === "string" && b.token) ||
    (nested && typeof nested.token === "string" && nested.token);
  if (!token) {
    throw new Error(`No token in login response: ${JSON.stringify(body)}`);
  }
  return token;
}

test("gmail user sees Access Denied when viewing yahoo user booking", async ({
  page,
  request,
}) => {
  // ── Step 1: Login as Yahoo user via API and get token ─────────────────────
  const loginRes = await request.post(`${API_URL}/auth/login`, {
    data: { email: YAHOO_USER.email, password: YAHOO_USER.password },
  });
  expect(loginRes.ok()).toBeTruthy();
  const loginJson = await loginRes.json();
  const token = readToken(loginJson);

  // ── Step 2: Fetch events via API to get a valid event ID ──────────────────
  const eventsRes = await request.get(`${API_URL}/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(eventsRes.ok()).toBeTruthy();
  const eventsData = await eventsRes.json();
  const eventId = eventsData.data[0].id;

  // ── Step 3: Create a booking via API as Yahoo user ────────────────────────
  const bookingRes = await request.post(`${API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      eventId,
      customerName: "Yahoo User",
      customerEmail: YAHOO_USER.email,
      customerPhone: "9999999999",
      quantity: 1,
    },
  });
  expect(bookingRes.ok()).toBeTruthy();
  const bookingJson = await bookingRes.json();
  const yahooBookingId = bookingJson.data.id;

  console.log(`Yahoo booking created via API. ID: ${yahooBookingId}`);

  // ── Step 4: Login as Gmail user via UI ────────────────────────────────────
  await loginAs(page, GMAIL_USER);

  // ── Step 5: Navigate directly to Yahoo's booking URL as Gmail user ────────
  await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`, {
    waitUntil: "networkidle",
  });

  // ── Step 6: Validate Access Denied ───────────────────────────────────────
  await expect(page.getByText("Access Denied")).toBeVisible();
  await expect(
    page.getByText("You are not authorized to view this booking"),
  ).toBeVisible();
});
