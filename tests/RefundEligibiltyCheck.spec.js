/**
 * EventHub — refund eligibility: 1 ticket vs 3 tickets.
 *
 * Credentials: EVENTHUB_EMAIL / EVENTHUB_PASSWORD or edit defaults.
 */

const { test, expect } = require("@playwright/test");

const BASE_URL = "https://eventhub.rahulshettyacademy.com";

const EVENTHUB_EMAIL =
  process.env.EVENTHUB_EMAIL ?? "ankit@example.com";
const EVENTHUB_PASSWORD =
  process.env.EVENTHUB_PASSWORD ?? "Ankit@123";

/**
 * Logs in and confirms the post-login hero CTA is visible.
 * @param {import('@playwright/test').Page} page
 */
async function loginAndGoToBooking(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder("you@email.com").fill(EVENTHUB_EMAIL);
  await page.getByLabel("Password", { exact: true }).fill(EVENTHUB_PASSWORD);
  await page.locator("#login-btn").click();
  await expect(
    page.getByRole("link", { name: "Browse Events →" }),
  ).toBeVisible();
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {{ ticketClicks?: number }} [opts] — extra clicks on the "+" quantity button (2 => 3 tickets total)
 */
async function bookFirstEventOnListing(page, opts = {}) {
  await page.goto(`${BASE_URL}/events`);
  await page
    .locator('[data-testid="event-card"]')
    .first()
    .getByTestId("book-now-btn")
    .click();

  const bookingPanel = page.locator("main").filter({ hasText: "Book Tickets" });
  await expect(bookingPanel.getByRole("heading", { name: "Book Tickets" })).toBeVisible();

  const extraPlus = opts.ticketClicks ?? 0;
  const plusBtn = bookingPanel.locator('button:has-text("+")').first();
  for (let i = 0; i < extraPlus; i++) {
    await plusBtn.click();
  }

  await bookingPanel.getByLabel("Full Name*").fill("Refund Test User");
  await bookingPanel.getByLabel("Email*").fill(EVENTHUB_EMAIL);
  await bookingPanel.getByLabel("Phone Number*").fill("+91 9876543210");
  await bookingPanel.locator(".confirm-booking-btn").click();
}

/**
 * After landing on My Bookings, open first booking detail.
 * @param {import('@playwright/test').Page} page
 */
async function openFirstBookingDetails(page) {
  await page.getByRole("link", { name: /View My Bookings/i }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);
  await page.getByRole("link", { name: /View Details/i }).first().click();
  await expect(page.getByText("Booking Information")).toBeVisible();
}

/**
 * Booking detail page shows the reference next to the "confirmed" badge — not `.booking-ref`.
 * @param {import('@playwright/test').Page} page
 */
async function readBookingRefFromDetailPage(page) {
  const confirmed = page.locator("main").getByText("confirmed", { exact: true }).first();
  await expect(confirmed).toBeVisible();
  return (await confirmed.locator("xpath=preceding-sibling::*[1]").innerText()).trim();
}

test.describe("Refund eligibility", () => {
  test("single-ticket booking is eligible for refund", async ({ page }) => {
    await loginAndGoToBooking(page);
    await bookFirstEventOnListing(page, { ticketClicks: 0 });

    await openFirstBookingDetails(page);

    const bookingRef = await readBookingRefFromDetailPage(page);
    const eventTitle = (await page.locator("main h1").first().innerText()).trim();
    expect(bookingRef.length).toBeGreaterThan(0);
    expect(eventTitle.length).toBeGreaterThan(0);
    expect(bookingRef[0]).toBe(eventTitle[0]);

    await page
      .getByRole("button", { name: /Check eligibility for refund/i })
      .click();

    const spinner = page.locator("#refund-spinner");
    await expect(spinner).toBeVisible();
    await expect(spinner).toBeHidden({ timeout: 6000 });

    const result = page.locator("#refund-result");
    await expect(result).toBeVisible();
    await expect(result).toContainText("Eligible for refund");
    await expect(result).toContainText(
      "Single-ticket bookings qualify for a full refund",
    );
  });

  test("group ticket booking (3) is NOT eligible for refund", async ({ page }) => {
    await loginAndGoToBooking(page);
    await bookFirstEventOnListing(page, { ticketClicks: 2 });

    await openFirstBookingDetails(page);

    const bookingRef = await readBookingRefFromDetailPage(page);
    const eventTitle = (await page.locator("main h1").first().innerText()).trim();
    expect(bookingRef[0]).toBe(eventTitle[0]);

    await page
      .getByRole("button", { name: /Check eligibility for refund/i })
      .click();

    const spinner = page.locator("#refund-spinner");
    await expect(spinner).toBeVisible();
    await expect(spinner).toBeHidden({ timeout: 6000 });

    const result = page.locator("#refund-result");
    await expect(result).toBeVisible();
    await expect(result).toContainText("Not eligible for refund");
    await expect(result).toContainText(
      "Group bookings (3 tickets) are non-refundable",
    );
  });
});

module.exports = { loginAndGoToBooking, BASE_URL };
