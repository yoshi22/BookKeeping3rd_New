const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const TARGET_URL = "http://localhost:8081";
const SCREENSHOT_DIR = path.join(__dirname, "..", ".logs", "web");
const TIMEOUT = 30000;

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function takeScreenshot(page, name, description) {
  const filename = `${name}-${Date.now()}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);

  try {
    await page.screenshot({
      path: filepath,
      fullPage: true,
    });
    console.log(`Screenshot saved: ${filename} - ${description}`);
    return filename;
  } catch (error) {
    console.error(`Screenshot failed (${name}):`, error.message);
    return null;
  }
}

async function waitForElementWithTimeout(page, selector, timeout = 10000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    console.warn(`Element not found (${timeout}ms): ${selector}`);
    return false;
  }
}

async function runWebSmokeTest() {
  console.log("Starting Web Smoke Test...");
  console.log(`Target URL: ${TARGET_URL}`);

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    console.log(`Created screenshot directory: ${SCREENSHOT_DIR}`);
  }

  let browser;
  let testResults = {
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    screenshots: [],
    errors: [],
  };

  try {
    console.log("Launching browser...");
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 800 },
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    page.on("console", (msg) => {
      const type = msg.type();
      if (type === "error") {
        console.error(`Console Error: ${msg.text()}`);
        testResults.errors.push(`Console Error: ${msg.text()}`);
      } else if (type === "warn") {
        console.warn(`Console Warning: ${msg.text()}`);
      } else {
        console.log(`Console ${type}: ${msg.text()}`);
      }
    });

    page.on("pageerror", (error) => {
      console.error(`Page Error: ${error.message}`);
      testResults.errors.push(`Page Error: ${error.message}`);
    });

    console.log(`Accessing ${TARGET_URL}...`);

    // Try different common Expo web ports
    const possibleUrls = [
      "http://localhost:8081",
      "http://localhost:19006",
      "http://localhost:3000",
      "http://localhost:19000",
      "http://127.0.0.1:8081",
      "http://127.0.0.1:19006",
    ];

    let successfulUrl = null;
    testResults.totalTests++;

    for (const url of possibleUrls) {
      try {
        console.log(`Trying ${url}...`);
        await page.goto(url, {
          waitUntil: "networkidle0",
          timeout: 10000,
        });
        console.log(`Page access successful at ${url}`);
        successfulUrl = url;
        testResults.passedTests++;
        break;
      } catch (error) {
        console.log(`Failed to access ${url}: ${error.message}`);
      }
    }

    if (!successfulUrl) {
      console.error("Page access failed on all attempted URLs");
      testResults.failedTests++;
      testResults.errors.push("Page access failed on all attempted URLs");
      return testResults;
    }

    const screenshot1 = await takeScreenshot(
      page,
      "initial-load",
      "Initial page load",
    );
    if (screenshot1) testResults.screenshots.push(screenshot1);

    await delay(3000);

    console.log("\nTest 1: Title/Header verification");
    testResults.totalTests++;

    try {
      const title = await page.title();
      console.log(`Page title: "${title}"`);

      const headerSelectors = [
        "h1",
        "h2",
        '[role="banner"]',
        "header",
        ".header",
        "#header",
      ];

      let headerFound = false;
      for (const selector of headerSelectors) {
        if (await waitForElementWithTimeout(page, selector, 2000)) {
          console.log(`Header element found: ${selector}`);
          headerFound = true;
          break;
        }
      }

      if (
        headerFound ||
        title.includes("BookKeeping") ||
        title.includes("?") ||
        title.includes("f�")
      ) {
        console.log("Title/Header verification - SUCCESS");
        testResults.passedTests++;
      } else {
        console.log("Title/Header verification - FAILED");
        testResults.failedTests++;
        testResults.errors.push("Header/title not found with expected content");
      }
    } catch (error) {
      console.error("Title/Header check error:", error.message);
      testResults.failedTests++;
      testResults.errors.push(`Header check error: ${error.message}`);
    }

    console.log("\nTest 2: Start button verification and click");
    testResults.totalTests++;

    try {
      const startButtonSelectors = ["button", '[role="button"]', "a"];

      let startButtonFound = false;
      let startButtonSelector = null;

      for (const selector of startButtonSelectors) {
        const elements = await page.$$(selector);
        for (let i = 0; i < elements.length; i++) {
          try {
            const textContent = await page.evaluate(
              (el) => el.textContent,
              elements[i],
            );
            if (
              textContent &&
              (textContent.includes("学習開始") ||
                textContent.includes("学習") ||
                textContent.includes("開始") ||
                textContent.includes("Start"))
            ) {
              console.log(
                `Start button found: ${selector} with text "${textContent}"`,
              );
              startButtonFound = true;
              startButtonSelector = selector;

              const screenshot2 = await takeScreenshot(
                page,
                "start-button-found",
                "Start button found",
              );
              if (screenshot2) testResults.screenshots.push(screenshot2);

              await elements[i].click();
              console.log("Start button clicked successfully");

              await delay(2000);

              const screenshot3 = await takeScreenshot(
                page,
                "after-start-click",
                "After start button click",
              );
              if (screenshot3) testResults.screenshots.push(screenshot3);

              break;
            }
          } catch (err) {
            continue;
          }
        }
        if (startButtonFound) break;
      }

      if (startButtonFound) {
        testResults.passedTests++;
      } else {
        console.log("Start button not found");
        testResults.failedTests++;
        testResults.errors.push("Start button not found");
      }
    } catch (error) {
      console.error("Start button error:", error.message);
      testResults.failedTests++;
      testResults.errors.push(`Start button error: ${error.message}`);
    }

    console.log("\nTest 3: Tab navigation verification");
    testResults.totalTests++;

    try {
      const tabSelectors = ["button", '[role="tab"]', "a"];

      let tabsFound = [];

      for (const selector of tabSelectors) {
        const elements = await page.$$(selector);
        for (let i = 0; i < elements.length; i++) {
          try {
            const textContent = await page.evaluate(
              (el) => el.textContent,
              elements[i],
            );
            if (
              textContent &&
              (textContent.includes("復習") ||
                textContent.includes("q") ||
                textContent.includes("Mock") ||
                textContent.includes("Stats"))
            ) {
              console.log(`Tab found: ${selector} with text "${textContent}"`);
              tabsFound.push({ element: elements[i], text: textContent });
            }
          } catch (err) {
            continue;
          }
        }
      }

      if (tabsFound.length > 0) {
        console.log(`Found ${tabsFound.length} tabs`);

        const mockExamTab = tabsFound.find(
          (tab) => tab.text.includes("!f") || tab.text.includes("Mock"),
        );
        if (mockExamTab) {
          try {
            await mockExamTab.element.click();
            console.log("Mock exam tab clicked successfully");
            await delay(1000);

            const screenshot4 = await takeScreenshot(
              page,
              "mock-exam-tab",
              "Mock exam tab clicked",
            );
            if (screenshot4) testResults.screenshots.push(screenshot4);
          } catch (clickError) {
            console.warn("Mock exam tab click failed:", clickError.message);
          }
        }

        const statsTab = tabsFound.find(
          (tab) => tab.text.includes("q") || tab.text.includes("Stats"),
        );
        if (statsTab) {
          try {
            await statsTab.element.click();
            console.log("Statistics tab clicked successfully");
            await delay(1000);

            const screenshot5 = await takeScreenshot(
              page,
              "stats-tab",
              "Statistics tab clicked",
            );
            if (screenshot5) testResults.screenshots.push(screenshot5);
          } catch (clickError) {
            console.warn("Statistics tab click failed:", clickError.message);
          }
        }

        testResults.passedTests++;
      } else {
        console.log("Tab navigation not found");
        testResults.failedTests++;
        testResults.errors.push("Tab navigation not found");
      }
    } catch (error) {
      console.error("Tab navigation error:", error.message);
      testResults.failedTests++;
      testResults.errors.push(`Tab navigation error: ${error.message}`);
    }

    const screenshotFinal = await takeScreenshot(
      page,
      "final-state",
      "Final test state",
    );
    if (screenshotFinal) testResults.screenshots.push(screenshotFinal);
  } catch (error) {
    console.error("Test execution error:", error.message);
    testResults.errors.push(`Test execution error: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  }

  return testResults;
}

async function main() {
  const startTime = Date.now();
  console.log("BookKeeping App Web Smoke Test");
  console.log("=====================================");

  const results = await runWebSmokeTest();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log("\nTest Results Summary");
  console.log("=====================================");
  console.log(`Duration: ${duration}s`);
  console.log(`Passed: ${results.passedTests}/${results.totalTests}`);
  console.log(`Failed: ${results.failedTests}/${results.totalTests}`);
  console.log(`Screenshots: ${results.screenshots.length}`);

  if (results.screenshots.length > 0) {
    console.log("\nSaved Screenshots:");
    results.screenshots.forEach((screenshot) => {
      console.log(`  - ${screenshot}`);
    });
  }

  if (results.errors.length > 0) {
    console.log("\nError Details:");
    results.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }

  const successRate = (
    (results.passedTests / results.totalTests) *
    100
  ).toFixed(1);
  console.log(`\nSuccess Rate: ${successRate}%`);

  if (results.failedTests === 0) {
    console.log("All tests passed successfully!");
    process.exit(0);
  } else {
    console.log("Some tests failed");
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

module.exports = { runWebSmokeTest };
