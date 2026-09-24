import { test, expect, type Page } from "@playwright/test";

/**
 * Loads every route in the static export and asserts the page renders with
 * zero console errors - this catches runtime-only issues (deprecation
 * warnings, hydration mismatches, prop-forwarding bugs) that tsc/eslint/next
 * build can't see, since they only ever surface once a browser actually
 * hydrates the page.
 */
const routes = [
  "/",
  "/another",
  "/login",
  "/signup",
  "/confirm",
  "/forgot-password",
  "/reset-password",
  "/protected",
];

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  return errors;
}

for (const route of routes) {
  test(`${route} has no console errors`, async ({ page }) => {
    const errors = collectConsoleErrors(page);

    await page.goto(route);
    await page.waitForLoadState("networkidle");

    expect(errors).toEqual([]);
  });
}
