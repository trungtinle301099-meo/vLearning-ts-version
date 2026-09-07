import { expect, test } from '../../../src/fixtures/ui.fixture';
import { HomePageUiEndpoint } from '../../../src/endpoints/ui-endpoints/homePage.ui.endpoint';
import { CourseCategory } from '../../../src/pages/homePage/homeHeaderHomePage/homeHeaderHomePage.type';

test.describe('Home - Danh mục khóa học', () => {
  test('DANH_MUC_UI_001 - should navigate to Backend course category page when clicking Lập trình Backend', async ({
    page,
    homeHeaderHomePage,
    danhMucHomePage,
  }) => {
    // Define the target course category.
    const category: CourseCategory = 'Lập trình Backend';

    // Navigate to the Home page.
    await homeHeaderHomePage.gotoHomePage();

    // Open the category dropdown.
    await homeHeaderHomePage.hoverHeaderLink('Danh mục');

    // Click the Backend course category link.
    await homeHeaderHomePage.clickCourseCategoryLink(category);

    // Verify the page URL is correct.
    await expect(page).toHaveURL(new RegExp(HomePageUiEndpoint.backendCourseCategory));

    // Verify the category heading is visible.
    await expect(danhMucHomePage.button.categoryHeading).toBeVisible();

    // Verify the selected category button is visible.
    await expect(danhMucHomePage.button.selectedCategoryButton(category)).toBeVisible();
  });

  test('DANH_MUC_UI_002 - should navigate to Design course category page when clicking Thiết kế web', async ({
    page,
    homeHeaderHomePage,
    danhMucHomePage,
  }) => {
    // Define the target course category.
    const category: CourseCategory = 'Thiết kế Web';

    // Navigate to the Home page.
    await homeHeaderHomePage.gotoHomePage();

    // Open the category dropdown.
    await homeHeaderHomePage.hoverHeaderLink('Danh mục');

    // Click the Design course category link.
    await homeHeaderHomePage.clickCourseCategoryLink(category);

    // Verify the page URL is correct.
    await expect(page).toHaveURL(new RegExp(HomePageUiEndpoint.designCourseCategory));

    // Verify the category heading is visible.
    await expect(danhMucHomePage.button.categoryHeading).toBeVisible();

    // Verify the selected category button displays the correct text.
    await expect(danhMucHomePage.button.selectedCategoryButton(category)).toHaveText(category);
  });

    test('DANH_MUC_UI_003 - should navigate to Mobile course category page when clicking Lập trình di động', async ({
    page,
    homeHeaderHomePage,
    danhMucHomePage,
  }) => {
    // Define the target course category.
    const category: CourseCategory = 'Lập trình di động';

    // Navigate to the Home page.
    await homeHeaderHomePage.gotoHomePage();

    // Open the category dropdown.
    await homeHeaderHomePage.hoverHeaderLink('Danh mục');

    // Click the Mobile course category link.
    await homeHeaderHomePage.clickCourseCategoryLink(category);

    // Verify the page URL is correct.
    await expect(page).toHaveURL(new RegExp(HomePageUiEndpoint.mobileCourseCategory));

    // Verify the category heading is visible.
    await expect(danhMucHomePage.button.categoryHeading).toBeVisible();

    // Verify the selected category button displays the correct text.
    await expect(danhMucHomePage.button.selectedCategoryButton(category)).toHaveText(category);
  });

  test('DANH_MUC_UI_004 - should navigate to Frontend course category page when clicking Lập trình Front end', async ({
    page,
    homeHeaderHomePage,
    danhMucHomePage,
  }) => {
    // Define the target course category.
    const category: CourseCategory = 'Lập trình Front end';

    // Navigate to the Home page.
    await homeHeaderHomePage.gotoHomePage();

    // Open the category dropdown.
    await homeHeaderHomePage.hoverHeaderLink('Danh mục');

    // Click the Frontend course category link.
    await homeHeaderHomePage.clickCourseCategoryLink(category);

    // Verify the page URL is correct.
    await expect(page).toHaveURL(new RegExp(HomePageUiEndpoint.frontendCourseCategory));

    // Verify the category heading is visible.
    await expect(danhMucHomePage.button.categoryHeading).toBeVisible();

    // Verify the selected category button displays the correct text.
    await expect(danhMucHomePage.button.selectedCategoryButton(category)).toHaveText(category);
  });

  test('DANH_MUC_UI_005 - should navigate to Full Stack course category page when clicking Lập trình Full Stack', async ({
    page,
    homeHeaderHomePage,
    danhMucHomePage,
  }) => {
    // Define the target course category.
    const category: CourseCategory = 'Lập trình Full Stack';

    // Navigate to the Home page.
    await homeHeaderHomePage.gotoHomePage();

    // Open the category dropdown.
    await homeHeaderHomePage.hoverHeaderLink('Danh mục');

    // Click the Full Stack course category link.
    await homeHeaderHomePage.clickCourseCategoryLink(category);

    // Verify the page URL is correct.
    await expect(page).toHaveURL(new RegExp(HomePageUiEndpoint.fullStackCourseCategory));

    // Verify the category heading is visible.
    await expect(danhMucHomePage.button.categoryHeading).toBeVisible();

    // Verify the selected category button displays the correct text.
    await expect(danhMucHomePage.button.selectedCategoryButton(category)).toHaveText(category);
  });

  test('DANH_MUC_UI_006 - should navigate to Thinking course category page when clicking Tư duy lập trình', async ({
    page,
    homeHeaderHomePage,
    danhMucHomePage,
  }) => {
    // Define the target course category.
    const category: CourseCategory = 'Tư duy lập trình';

    // Navigate to the Home page.
    await homeHeaderHomePage.gotoHomePage();

    // Open the category dropdown.
    await homeHeaderHomePage.hoverHeaderLink('Danh mục');

    // Click the Thinking course category link.
    await homeHeaderHomePage.clickCourseCategoryLink(category);

    // Verify the page URL is correct.
    await expect(page).toHaveURL(new RegExp(HomePageUiEndpoint.thinkingCourseCategory));

    // Verify the category heading is visible.
    await expect(danhMucHomePage.button.categoryHeading).toBeVisible();

    // Verify the selected category button displays the correct text.
    await expect(danhMucHomePage.button.selectedCategoryButton(category)).toHaveText(category);
  });
});