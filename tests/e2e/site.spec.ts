import { expect, test, type Page } from "@playwright/test";

const ROUTES = [
  "/",
  "/shop",
  "/category/eyeglasses",
  "/category/sunglasses",
  "/category/kids",
  "/category/premium",
  "/category/everyday",
  "/category/blue-light",
  "/new-arrivals",
  "/offers",
  "/product/aurora-rectangle-acetate",
  "/search?q=round",
  "/wishlist",
  "/cart",
  "/checkout",
  "/appointments",
  "/stores",
  "/stores/the-optical-express",
  "/stores/universal-eyecare",
  "/reviews",
  "/about",
  "/contact",
  "/account",
  "/policies/shipping",
  "/policies/returns",
  "/policies/privacy",
  "/policies/terms",
];

async function noBrokenImages(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await page.waitForLoadState("networkidle");
  const broken = await page.evaluate(() =>
    [...document.images]
      .filter((i) => i.complete && i.naturalWidth === 0)
      .map((i) => i.currentSrc || i.src),
  );
  expect(broken, "broken images").toEqual([]);
}

test.describe("routing & rendering", () => {
  test("root redirects to a locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });

  test("redirects to Marathi for a Marathi browser", async ({ browser }) => {
    const ctx = await browser.newContext({
      locale: "mr-IN",
      extraHTTPHeaders: { "accept-language": "mr-IN,mr;q=0.9" },
    });
    const page = await ctx.newPage();
    await page.goto("/shop");
    await expect(page).toHaveURL(/\/mr\/shop$/);
    await ctx.close();
  });

  for (const locale of ["en", "mr", "hi"]) {
    test(`every primary page renders in ${locale}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const route of ROUTES) {
        const res = await page.goto(`/${locale}${route === "/" ? "" : route}`);
        expect(res?.status(), route).toBe(200);
        await expect(page.locator("h1").first(), route).toBeVisible();
        await expect(page.locator("html")).toHaveAttribute("lang", new RegExp(`^${locale}`));
      }
      expect(errors).toEqual([]);
    });
  }

  test("unknown pages show a localized 404", async ({ page }) => {
    const res = await page.goto("/hi/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("हमें यह पेज नहीं मिला")).toBeVisible();
  });

  test("homepage has no broken images and every nav link works", async ({ page }) => {
    await page.goto("/en");
    await noBrokenImages(page);
    const nav = page.getByRole("navigation", { name: "Main navigation" }).first();
    const hrefs = await nav
      .getByRole("link")
      .evaluateAll((els) => els.map((e) => e.getAttribute("href")!));
    expect(hrefs.length).toBe(7);
    for (const href of hrefs) {
      const res = await page.goto(href);
      expect(res?.status(), href).toBe(200);
    }
  });
});

test.describe("language switching", () => {
  test("keeps the path, filters and cart when switching language", async ({ page }) => {
    await page.goto("/en/product/nova-geometric-tr90");
    await page.getByRole("button", { name: "Add to Bag", exact: true }).click();
    await page.goto("/en/shop?shape=round&sort=price-asc");
    await page.getByRole("combobox", { name: "Language" }).first().selectOption("mr");
    await expect(page).toHaveURL(/\/mr\/shop\?shape=round&sort=price-asc$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "mr-IN");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("सर्व चष्मे");
    await expect(page.getByRole("link", { name: /शॉपिंग बॅग, 1/ })).toBeVisible();
  });
});

test.describe("catalogue", () => {
  test("search finds matching frames", async ({ page }) => {
    await page.goto("/en");
    const search = page.getByRole("searchbox", { name: "Search the catalogue" }).first();
    await search.fill("aviator");
    await search.press("Enter");
    await expect(page).toHaveURL(/\/en\/search\?q=aviator/);
    await expect(page.getByText("2 frames")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Coast Aviator" })).toBeVisible();
  });

  test("search shows an empty state for no matches", async ({ page }) => {
    await page.goto("/en/search?q=zzzz");
    await expect(page.getByText("No frames match these filters")).toBeVisible();
  });

  test("filters, sorting and clear-all work and sync to the URL", async ({ page }) => {
    await page.goto("/en/shop");
    await expect(page.getByText("15 frames")).toBeVisible();
    await page.getByRole("checkbox", { name: "Round" }).check();
    await expect(page).toHaveURL(/shape=round/);
    await expect(page.getByText("4 frames")).toBeVisible();
    await page.getByRole("button", { name: "Gold", pressed: false }).click();
    await expect(page.getByText("2 frames")).toBeVisible();
    await page.getByRole("combobox", { name: "Sort by" }).selectOption("price-desc");
    await expect(page).toHaveURL(/sort=price-desc/);
    const prices = await page.locator("article h3").allTextContents();
    expect(prices[0]).toBe("Air Titanium Round");
    await page.getByRole("button", { name: "Clear all" }).first().click();
    await expect(page.getByText("15 frames")).toBeVisible();
  });

  test("price and category filters", async ({ page }) => {
    await page.goto("/en/shop");
    await page.getByRole("radio", { name: "Under ₹1,500" }).check();
    await expect(page.getByText("3 frames")).toBeVisible();
    await page.getByRole("radio", { name: "Kids' Eyewear" }).check();
    await expect(page.getByText("2 frames")).toBeVisible();
  });

  test("category pages only list their category", async ({ page }) => {
    await page.goto("/en/category/sunglasses");
    await expect(page.getByText("4 frames")).toBeVisible();
  });

  test("mobile filter drawer @mobile", async ({ page }) => {
    await page.goto("/en/shop");
    await page.getByRole("button", { name: /^Filters/ }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("checkbox", { name: "Aviator" }).check();
    await dialog.getByRole("button", { name: "Show 2 results" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByText("2 frames")).toBeVisible();
  });
});

test.describe("cart, coupons and delivery", () => {
  test("add, change quantity, persist, coupon, delivery, remove", async ({ page }) => {
    // ₹1,499 frame
    await page.goto("/en/product/nova-geometric-tr90");
    await page.getByRole("button", { name: "Add to Bag", exact: true }).click();
    await expect(page.getByRole("link", { name: "Shopping bag, 1 items" })).toBeVisible();

    await page.goto("/en/cart");
    const summary = page.getByRole("complementary");
    await expect(summary.getByText("₹1,499").first()).toBeVisible();

    // Pune: free delivery
    await expect(summary.getByText("Free", { exact: true })).toBeVisible();

    // Outside Pune ≥ ₹999: still free
    await page.locator("label", { hasText: "Outside Pune" }).first().click();
    await expect(page.getByRole("radio", { name: "Outside Pune" })).toBeChecked();
    await expect(summary.getByText("Free", { exact: true })).toBeVisible();

    // Invalid coupon
    await page.getByLabel("Coupon code").fill("NOPE");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByText("This code isn't valid.")).toBeVisible();

    // Expired coupon
    await page.getByLabel("Coupon code").fill("MONSOON15");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByText("This code has expired.")).toBeVisible();

    // WELCOME10 → ₹149.90 off → total ₹1,349.10
    await page.getByLabel("Coupon code").fill("welcome10");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByText(/WELCOME10 applied/)).toBeVisible();
    await expect(summary.getByText("₹1,349.1")).toBeVisible();

    // FRAME100 replaces it (no stacking) → total ₹1,399
    await page.getByLabel("Coupon code").fill("FRAME100");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByText(/WELCOME10 was replaced by FRAME100/)).toBeVisible();
    await expect(summary.getByText("₹1,399", { exact: true })).toBeVisible();

    // Quantity 2 → subtotal ₹2,998
    await page.getByRole("button", { name: "Increase quantity" }).click();
    await expect(summary.getByText("₹2,998")).toBeVisible();

    // Persistence across reload
    await page.reload();
    await expect(summary.getByText("₹2,998")).toBeVisible();
    await expect(page.getByRole("link", { name: "Shopping bag, 2 items" })).toBeVisible();

    // Remove → empty state
    await page.getByRole("button", { name: "Remove Nova Geometric from bag" }).click();
    await expect(page.getByText("Your bag is empty")).toBeVisible();
  });

  test("outside-Pune courier fee applies below ₹999 and coupon minimum is enforced", async ({
    page,
  }) => {
    // Scout Rectangle is ₹899 — below the ₹999 free-shipping threshold.
    await page.goto("/en/product/scout-kids-rectangle");
    await page.getByRole("button", { name: "Add to Bag", exact: true }).click();
    await page.goto("/en/cart");
    const summary = page.getByRole("complementary");

    // Within Pune: free
    await expect(summary.getByText("Free", { exact: true })).toBeVisible();
    await expect(summary.getByText("₹899").last()).toBeVisible();

    // Outside Pune below ₹999: illustrative ₹99 courier charge
    await page.locator("label", { hasText: "Outside Pune" }).first().click();
    await expect(page.getByRole("radio", { name: "Outside Pune" })).toBeChecked();
    await expect(summary.getByText("₹99", { exact: true })).toBeVisible();
    await expect(summary.getByText("₹998")).toBeVisible();
    await expect(summary.getByText("Add ₹100 more for free delivery outside Pune.")).toBeVisible();
    await expect(summary.getByText(/illustrative until confirmed/)).toBeVisible();

    // FRAME100 needs ₹999
    await page.getByLabel("Coupon code").fill("FRAME100");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByText("Add items worth at least ₹999 to use this code.")).toBeVisible();

    // Second unit → ₹1,798 ≥ ₹999 → delivery becomes free and FRAME100 now applies
    await page.getByRole("button", { name: "Increase quantity" }).click();
    await expect(summary.getByText("Free", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByText(/FRAME100 applied/)).toBeVisible();
    await expect(summary.getByText("₹1,698")).toBeVisible();

    // Back to one unit → coupon no longer qualifies and is flagged, courier fee returns
    await page.getByRole("button", { name: "Decrease quantity" }).click();
    await expect(page.getByText(/Coupon FRAME100 was removed/)).toBeVisible();
    await expect(summary.getByText("₹998")).toBeVisible();
  });

  test("wishlist toggles and persists", async ({ page }) => {
    await page.goto("/en/product/sienna-cat-eye");
    await page.getByRole("button", { name: "Add Sienna Cat-Eye to wishlist" }).click();
    await page.goto("/en/wishlist");
    await expect(page.getByRole("heading", { name: "Sienna Cat-Eye" })).toBeVisible();
    await page.getByRole("button", { name: "Remove Sienna Cat-Eye from wishlist" }).click();
    await expect(page.getByText("Your wishlist is empty")).toBeVisible();
  });

  test("out-of-stock variants cannot be added", async ({ page }) => {
    await page.goto("/en/product/harbour-browline-sunglasses");
    await page.getByText("Tortoiseshell").click();
    await expect(page.getByRole("button", { name: "Out of stock" })).toBeDisabled();
  });
});

test.describe("checkout (demo)", () => {
  test("validates and shows a clearly-labelled demo confirmation", async ({ page }) => {
    await page.goto("/en/product/aurora-rectangle-acetate");
    await page.getByRole("button", { name: "Add to Bag", exact: true }).click();
    await page.goto("/en/checkout");
    await expect(page.getByText(/Demo checkout — no payment will be taken/).first()).toBeVisible();

    await page.getByRole("button", { name: "Place demo order" }).click();
    await expect(page.getByText("Please correct the highlighted fields.")).toBeVisible();
    await expect(page.getByText("This field is required.").first()).toBeVisible();
    // Focus moves to the first invalid field
    await expect(page.getByLabel("Full name")).toBeFocused();

    await page.getByLabel("Full name").fill("Asha Patil");
    await page.getByLabel("Email").fill("asha@example");
    await page.getByLabel("Mobile number").fill("12345");
    await page.getByLabel("Address").fill("12, Tulshibagwale Colony Road");
    await page.getByLabel("PIN code").fill("011009");
    await page.getByRole("button", { name: "Place demo order" }).click();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Enter a valid 10-digit Indian mobile number.")).toBeVisible();
    await expect(page.getByText("Enter a valid 6-digit PIN code.")).toBeVisible();

    await page.getByLabel("Email").fill("asha@example.com");
    await page.getByLabel("Mobile number").fill("98765 43210");
    await page.getByLabel("PIN code").fill("411009");
    await page.getByRole("button", { name: "Place demo order" }).click();

    await expect(page.getByRole("heading", { name: "Demo order complete" })).toBeVisible();
    await expect(page.getByText(/has NOT been sent to the store/)).toBeVisible();
    await expect(page.getByText(/^DEMO-\d{6}-[A-Z0-9]{4}$/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Shopping bag, 0 items" })).toBeVisible();
  });
});

test.describe("appointments (demo)", () => {
  test("books a demo appointment with validation and slot rules", async ({ page }) => {
    await page.goto("/en/appointments?store=universal-eyecare");
    await expect(page.getByLabel("Store")).toHaveValue("universal-eyecare");

    await page.getByRole("button", { name: "Request appointment" }).click();
    await expect(page.getByText("Choose a date.")).toBeVisible();

    const dateInput = page.getByLabel("Preferred date");
    const min = await dateInput.getAttribute("min");
    expect(min).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const d = new Date(`${min}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 2);
    await dateInput.fill(d.toISOString().slice(0, 10));

    const disabled = page.locator('input[name="time"]:disabled');
    expect(await disabled.count()).toBeGreaterThan(0);
    await page.locator('input[name="time"]:not(:disabled)').first().check({ force: true });

    await page.getByLabel("Full name").fill("Ravi Kulkarni");
    await page.getByLabel("Mobile number").fill("9876543210");
    await page.getByRole("button", { name: "Request appointment" }).click();

    await expect(page.getByRole("heading", { name: "Demo request received" })).toBeVisible();
    await expect(page.getByText(/has NOT been sent to Universal Eyecare/)).toBeVisible();
  });

  test("rejects a past date", async ({ page }) => {
    await page.goto("/en/appointments?store=the-optical-express");
    await page.getByLabel("Preferred date").fill("2020-01-01");
    await page.getByLabel("Full name").fill("Ravi");
    await page.getByLabel("Mobile number").fill("9876543210");
    await page.getByRole("button", { name: "Request appointment" }).click();
    await expect(page.getByText("Choose today or a future date.")).toBeVisible();
  });
});

test.describe("stores, reviews, WhatsApp", () => {
  test("each store shows only its own reviews", async ({ page }) => {
    await page.goto("/en/stores/the-optical-express");
    await expect(page.getByText("Kishori Upadhye")).toBeVisible();
    await page.goto("/en/stores/universal-eyecare");
    await expect(page.getByText("Kishori Upadhye")).toHaveCount(0);
    await expect(page.getByText("Reviews coming soon")).toBeVisible();
  });

  test("WhatsApp is disabled until numbers are verified, maps/review links are real", async ({
    page,
  }) => {
    await page.goto("/en/stores");
    const disabled = page.locator('[aria-disabled="true"]', { hasText: "WhatsApp" });
    await expect(disabled).toHaveCount(2);
    const maps = await page
      .getByRole("link", { name: /Get directions/ })
      .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    expect(maps.every((h) => h?.startsWith("https://www.google.com/maps/"))).toBe(true);
    await page.getByRole("button", { name: "Chat on WhatsApp" }).click();
    await expect(
      page
        .getByRole("dialog", { name: "Chat on WhatsApp" })
        .getByText("WhatsApp number pending verification"),
    ).toHaveCount(2);
  });
});

test.describe("responsive @mobile", () => {
  test("mobile menu opens, navigates and closes @mobile", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Main navigation" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("link", { name: "Sunglasses" }).click();
    await expect(page).toHaveURL(/\/en\/category\/sunglasses$/);
    await expect(dialog).toBeHidden();
  });

  for (const route of [
    "/en",
    "/mr/shop",
    "/hi/product/coast-aviator-sunglasses",
    "/en/cart",
    "/mr/appointments",
    "/hi/stores",
  ]) {
    test(`no horizontal overflow at 360px: ${route} @mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 780 });
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      await noBrokenImages(page);
    });
  }
});
