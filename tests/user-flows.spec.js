import { test, expect } from "@playwright/test";

const EMAIL = "test@checkpoint2.com";
const PASSWORD = "hello";

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
  await page.getByPlaceholder("Title").fill(title);
  await page.getByPlaceholder("Content").fill("Automated test post");
  await page.getByLabel("Visibility").selectOption("Friends-Only");
  await page.getByRole("button", { name: "Post", exact: true }).click();
  await expect(page.getByText(title)).toBeVisible();
});


/*
What each part does:

login(page) is a helper that fills the form and clicks, so the login steps are written once.
getByPlaceholder, getByRole and getByLabel find elements the way a user would, by what they see.
expect(...).toBeVisible() waits a few seconds for the thing to appear, then fails if it doesn’t.
Date.now() in the title makes each run’s post unique, so the test finds the right one.


*/