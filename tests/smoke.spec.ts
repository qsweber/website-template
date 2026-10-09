import { test, expect, type Page } from "@playwright/test";

/**
 * Loads every route in the static export and asserts the page renders with
 * zero console errors - this catches runtime-only issues (deprecation
 * warnings, hydration mismatches, prop-forwarding bugs) that tsc/eslint/next
 * build can't see, since they only ever surface once a browser actually
 * hydrates the page.
 *
 * Known flaky: a real, still-unresolved intermittent hydration mismatch
 * (React error #418) hits a random route on a meaningful fraction of runs,
 * more often against a freshly-started server than a warm/reused one.
 * Ruled out so far: the Turbopack+Emotion dual-module bug (fixed, see
 * next.config.js), a NavBar pathname/trailing-slash bug (fixed), and an
 * AuthContext session-load effect racing hydration (tried deferring it
 * past two animation frames - no effect, reverted). Root cause not found.
 * See https://github.com/qsweber/website-template/issues/28 for tracking.
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
  "/profile",
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
