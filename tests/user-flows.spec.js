import { test, expect } from "@playwright/test";

const EMAIL = process.env.TEST_EMAIL;
const PASSWORD = process.env.TEST_PASSWORD;

// shared steps so each test doesn't repeat them
async function login(page) {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(EMAIL);
  await page.getByPlaceholder("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL("/");
}

test("user can log in with the fixed test account", async ({ page }) => {
  await login(page);
  await expect(page.getByRole("heading", { name: "Study Progress" })).toBeVisible();
});

test("wrong password shows an error", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(EMAIL);
  await page.getByPlaceholder("Password").fill("definitely-wrong");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByText("Wrong email or password")).toBeVisible();
});

test("logged-out user is redirected to login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);
});

test("user can create a post and see it in the feed", async ({ page }) => {
  await login(page);
  const title = `Test post ${Date.now()}`;
  await page.getByRole("button", { name: /New Post/ }).click();
  await page.getByPlaceholder("Title").fill(title);
  await page.getByPlaceholder("Content").fill("Automated test post");
  await page.getByLabel("Skill", { exact: true }).selectOption("Piano");
  await page.getByLabel("Hours studied").fill("1.5");
  await page.getByLabel("Visibility").selectOption("Friends-Only");
  await page.getByRole("button", { name: "Publish" }).click();
  await expect(page.getByText(title)).toBeVisible();
});
