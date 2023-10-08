import { test, expect, type Page } from "@playwright/test";

const EMPLOYER_EMAIL = "employer@gmail.com";
const EMPLOYER_PASSWORD = "password";

test.describe("Jobs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost/");

    // check if there's a logout button, meaning the user is logged in
    const logOutBtn = page.locator("text=Logout");
    if (await logOutBtn.isVisible()) {
      return;
    }

    await page.goto("http://localhost/sign-up");
    const name = page.getByLabel("Name");
    await name.fill("John Doe");
    const email = page.getByLabel("Email");
    await email.fill(EMPLOYER_EMAIL);
    const password = page.getByLabel("Password");
    await password.fill(EMPLOYER_PASSWORD);
    const role = page.getByLabel("Employer");
    await role.setChecked(true);
    const submit = page.getByRole("button", { name: "Sign up" });
    await submit.click();
    await page.waitForResponse((response) => {
      return response.url().includes("/user/create");
    });
    await page.goto("http://localhost/login");
    const loginEmail = page.getByLabel("Email");
    await loginEmail.fill(EMPLOYER_EMAIL);
    const loginPassword = page.getByLabel("Password");
    await loginPassword.fill(EMPLOYER_PASSWORD);
    const loginSubmit = page.getByRole("button", { name: "Login" });
    await loginSubmit.click();
    await page.waitForRequest((request) => {
      return (
        request.url().includes("/auth/login") && request.method() === "POST"
      );
    });
    await page.waitForResponse((response) => {
      return (
        response.url().includes("/auth/login") && response.status() === 200
      );
    });
    await page.waitForURL("http://localhost/");
  });

  test("should create a new job", async ({ page }) => {
    await page.goto("http://localhost/jobs/new");
    const title = page.getByLabel("Title");
    await title.fill("Software Engineer");
    const description = page.getByLabel("Description");
    await description.fill(
      "As a software engineer, you will be responsible for managing the production deployment of our Nuxt systems. You will be working with a team of 5 engineers to ensure that our systems are running smoothly."
    );
    const submit = page.getByRole("button", { name: "Submit Job" });
    await submit.click();
    let jobId: number = 0;
    await page.waitForResponse(async (response) => {
      const json = await response.json();
      jobId = json.id;
      return (
        response.url().includes("/jobs/create") && response.status() === 201
      );
    });
    await page.waitForURL(`**/jobs/${jobId}`);
    expect(page.url()).toContain(`http://localhost/jobs/${jobId}`);
    expect(page.locator("text=Software Engineer")).toBeTruthy();
  });
});
