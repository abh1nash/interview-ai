import { test, expect, type Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

test.describe.serial("Auth", () => {
  test("should sign user up", async ({ page }) => {
    await page.goto("http://localhost/sign-up");
    const name = page.getByLabel("Name");
    await name.fill("John Doe");
    const email = page.getByLabel("Email");
    await email.fill(EMAIL);
    const password = page.getByLabel("Password");
    await password.fill(PASSWORD);
    const role = page.getByLabel("Candidate");
    await role.setChecked(true);
    const submit = page.getByRole("button", { name: "Sign up" });
    await submit.click();
    await page.waitForResponse((response) => {
      return (
        response.url().includes("/user/create") && response.status() === 201
      );
    });
    await page.waitForURL("**/login");
    expect(page.url()).toBe("http://localhost/login");
  });

  test("should be able to login", async ({ page }) => {
    await page.goto("http://localhost/login");
    const email = page.getByLabel("Email");
    await email.fill(EMAIL);
    const password = page.getByLabel("Password");
    await password.fill(PASSWORD);
    const submit = page.getByRole("button", { name: "Login" });
    await submit.click();
    await page.waitForResponse((response) => {
      return (
        response.url().includes("/auth/login") && response.status() === 200
      );
    });
    await page.waitForURL("http://localhost/");
    const logOutBtn = page.getByRole("button", { name: "Logout" });
    expect(logOutBtn).toBeTruthy();
    const token = await page.evaluate(() => {
      return window.localStorage.getItem("token");
    });
    expect(token).toBeTruthy();
  });
});
