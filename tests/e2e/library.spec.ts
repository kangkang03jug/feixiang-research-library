import { test, expect } from '@playwright/test';
test('personal library exposes the paper pool, archive, and paper reports', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      name: '医学图像分割单源域泛化',
    }),
  ).toBeVisible();
  await expect(page.locator('.eyebrow')).toContainText('研究知识库 ·');
  await expect(page.locator('.hero-subtitle')).toHaveText('研究知识库');
  await expect(page.locator('.hero .lede')).toContainText('面向医学图像分割单源域泛化');
  await page.getByRole('link', { name: '论文池', exact: true }).click();
  await expect(page.getByRole('heading', { name: '论文池' })).toBeVisible();
  await expect(
    page.getByRole('link', {
      name: 'Medical Image Segmentation via Single-Source Domain Generalization with Random Amplitude Spectrum Synthesis',
    }),
  ).toBeVisible();

  await page.getByRole('link', { name: '每日归档', exact: true }).click();
  await expect(page.getByRole('heading', { name: '每日归档' })).toBeVisible();
  await page
    .getByRole('link', {
      name: 'Fusing Dual Encoders: Single-source Domain Generalization with Extremely Few Annotations',
    })
    .click();
  await expect(
    page.getByRole('heading', {
      name: 'Fusing Dual Encoders: Single-source Domain Generalization with Extremely Few Annotations',
    }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: '快速阅读' })).toBeVisible();
  await page.getByRole('button', { name: '阅读详情 ↓' }).click();
  await expect(page.getByRole('heading', { name: '研究问题' })).toBeVisible();
});
test('hero title wraps long text without overflowing at desktop and mobile widths', async ({
  page,
}) => {
  await page.goto('/');
  const heroTitle = page.locator('.hero h1');
  await heroTitle.evaluate((element) => {
    element.textContent =
      'A deliberately long research library title that should wrap naturally to fit the available content width without creating horizontal overflow';
  });

  for (const width of [1440, 1024, 390]) {
    await page.setViewportSize({ width, height: 800 });
    const metrics = await heroTitle.evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const lineTops = new Set(Array.from(range.getClientRects(), (rect) => Math.round(rect.top)));
      const titleBounds = element.getBoundingClientRect();
      return {
        whiteSpace: getComputedStyle(element).whiteSpace,
        lineCount: lineTops.size,
        titleOverflows: element.scrollWidth > element.clientWidth + 1,
        titleOutsideViewport: titleBounds.left < -1 || titleBounds.right > window.innerWidth + 1,
      };
    });

    expect(metrics.whiteSpace).not.toBe('nowrap');
    expect(metrics.lineCount).toBeGreaterThan(1);
    expect(metrics.titleOverflows).toBe(false);
    expect(metrics.titleOutsideViewport).toBe(false);
  }
});
