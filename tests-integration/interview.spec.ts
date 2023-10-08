import { test, expect, type Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

let UID: string = "";

test.describe.serial("Interview", () => {
  const EMPLOYER_EMAIL = faker.internet.email();
  const EMPLOYER_PASSWORD = faker.internet.password();
  const CANDIDATE_EMAIL = faker.internet.email();
  const CANDIDATE_PASSWORD = faker.internet.password();

  let jobId: number;
  let candidateId: number;
  let employerId: number;

  test.beforeAll(async ({ request }) => {
    UID = faker.string.nanoid(4);
    // create an employer
    const employerResponse = await request.post(
      "http://localhost/api/user/user/create",
      {
        data: {
          name: faker.person.fullName(),
          email: EMPLOYER_EMAIL,
          password: EMPLOYER_PASSWORD,
          role: "employer",
        },
      }
    );
    const employer = await employerResponse.json();
    employerId = employer.id;

    // create a job
    const jobResponse = await request.post(
      "http://localhost/api/jobs/jobs/create",
      {
        headers: {
          Authorization: `Bearer ${employer.token}`,
        },
        data: {
          title: `Software Engineer - ${UID}`,
          description:
            "As a software engineer, you will be responsible for managing the production deployment of our Nuxt systems. You will be working with a team of 5 engineers to ensure that our systems are running smoothly.",
        },
      }
    );
    const job = await jobResponse.json();
    jobId = job.id;

    // create a candidate
    const candidateResponse = await request.post(
      "http://localhost/api/user/user/create",
      {
        data: {
          name: faker.person.fullName(),
          email: CANDIDATE_EMAIL,
          password: CANDIDATE_PASSWORD,
          role: "candidate",
        },
      }
    );
    const candidate = await candidateResponse.json();
    candidateId = candidate.id;
  });

  test("should start new interview for a job", async ({ page }) => {
    await page.goto("http://localhost/");
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByLabel("Email").click();
    await page.getByLabel("Email").fill(CANDIDATE_EMAIL);
    await page.getByLabel("Password").fill(CANDIDATE_PASSWORD);
    await page.getByLabel("Password").press("Enter");
    await page.waitForURL("http://localhost/");
    await page
      .getByRole("link", { name: `Software Engineer - ${UID}` })
      .first()
      .click();
    await page.waitForURL(`**/jobs/**`);
    await page.getByRole("button", { name: "Apply" }).click();
    await page.waitForURL(`**/interviews/**`);
    await page.waitForResponse((response) => {
      return response.url().includes("/next") && response.status() === 200;
    });
    await page.getByPlaceholder("Type your answer here...").fill("no");
    await page.getByRole("button", { name: "Send" }).click();
    await page.waitForResponse((response) => {
      return response.url().includes("/next") && response.status() === 200;
    });
    await page
      .getByPlaceholder("Type your answer here...")
      .fill("lets end this");
    await page.getByRole("button", { name: "Send" }).click();
    await page.waitForResponse((response) => {
      return response.url().includes("/next") && response.status() === 200;
    });
    const thankYouText = page.locator("text=Thank you!");
    expect(thankYouText).toBeTruthy();
  });

  test("should have prepared report for employer", async ({ page }) => {
    await page.waitForTimeout(10000); // wait for report to be prepared
    await page.goto("http://localhost/");
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByLabel("Email").click();
    await page.getByLabel("Email").fill(EMPLOYER_EMAIL);
    await page.getByLabel("Password").fill(EMPLOYER_PASSWORD);
    await page.getByLabel("Password").press("Enter");
    await page.waitForURL("http://localhost/");
    await page.getByRole("link", { name: "Reports" }).click();
    await page
      .getByRole("link", { name: `Software Engineer - ${UID}` })
      .first()
      .click();
    const link = page.getByRole("link", { name: "Full Report" }).first();
    await link.click();
    await page.waitForURL(/\/reports\/\d+\/\d+$/);
    const reportHeadline = page.locator("text=" + CANDIDATE_EMAIL);
    expect(reportHeadline).toBeTruthy();
  });
});
