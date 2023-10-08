import { test, expect, type Page } from "@playwright/test";

test("should sign user up", async ({ page }) => {
  await page.goto("http://localhost/sign-up");
  const name = page.getByLabel("Name");
  await name.fill("John Doe");
  const email = page.getByLabel("Email");
  await email.fill("john.doe@gmail.com");
  const password = page.getByLabel("Password");
  await password.fill("password");
  const role = page.getByLabel("Candidate");
  await role.setChecked(true);
  const submit = page.getByRole("button", { name: "Sign up" });
  await submit.click();
  await page.waitForRequest((request) => {
    return (
      request.url().includes("/user/create") && request.method() === "POST"
    );
  });
  await page.waitForResponse((response) => {
    return response.url().includes("/user/create") && response.status() === 201;
  });
  await page.waitForURL("**/login");
  expect(page.url()).toBe("http://localhost/login");
});

test("should be able to login", async ({ page }) => {
  await page.goto("http://localhost/login");
  const email = page.getByLabel("Email");
  await email.fill("john.doe@gmail.com");
  const password = page.getByLabel("Password");
  await password.fill("password");
  const submit = page.getByRole("button", { name: "Login" });
  await submit.click();
  await page.waitForRequest((request) => {
    return request.url().includes("/auth/login") && request.method() === "POST";
  });
  await page.waitForResponse((response) => {
    return response.url().includes("/auth/login") && response.status() === 200;
  });
  await page.waitForURL("http://localhost/");
  const logOutBtn = page.getByRole("button", { name: "Logout" });
  expect(logOutBtn).toBeTruthy();
  const token = await page.evaluate(() => {
    return window.localStorage.getItem("token");
  });
  expect(token).toBeTruthy();
});
