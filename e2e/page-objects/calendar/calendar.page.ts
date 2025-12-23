import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class CalendarPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  private monthViewButton = () => this.page.getByRole('button', { name: /month view/i });
  private listViewButton = () => this.page.getByRole('button', { name: /list view/i });
  private calendar = () => this.page.locator('.react-calendar');
  private selectedDateTitle = () => this.page.locator('h6').first();
  private noEventsMessage = () => this.page.getByText(/no celebrations on this day/i);
  private eventsList = () => this.page.locator('[role="button"]').filter({ hasText: /birthday|nameday/i });
  private eventItems = () => this.page.locator('[role="button"]').filter({ hasText: /birthday|nameday/i });
  private loadingSpinner = () => this.page.getByText(/loading celebrations/i);

  // Get specific calendar elements
  getCalendarTile(date: Date): Locator {
    // Format: "December 25, 2025" (may have event count appended like "December 25, 2025 2")
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    // Find by button role and name (not exact match to handle event counts)
    return this.page.getByRole('button', { name: new RegExp(`^${dateStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) });
  }

  getEventByName(name: string): Locator {
    return this.eventItems().filter({ hasText: name });
  }

  getEventDots(date: Date): Locator {
    const tile = this.getCalendarTile(date);
    return tile.locator('[class*="eventDot"]');
  }

  // Actions
  async navigate() {
    await this.goto('/calendar');
    await this.waitForCalendarToLoad();
  }

  async switchToMonthView() {
    await this.monthViewButton().click();
  }

  async switchToListView() {
    await this.listViewButton().click();
  }

  async selectDate(date: Date) {
    const tile = this.getCalendarTile(date);
    await tile.click();
  }

  async clickEvent(name: string) {
    const event = this.getEventByName(name);
    await event.click();
  }

  async waitForCalendarToLoad() {
    // Wait for loading to finish
    await this.loadingSpinner().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      // If spinner never appears, calendar is already loaded
    });
    // Ensure calendar is visible
    await this.calendar().waitFor({ state: 'visible', timeout: 5000 });
  }

  async getEventCount(): Promise<number> {
    return await this.eventItems().count();
  }

  async getSelectedDateText(): Promise<string> {
    return await this.selectedDateTitle().textContent() || '';
  }

  async navigateToNextMonth() {
    await this.page.locator('.react-calendar__navigation__next-button').click();
  }

  async navigateToPreviousMonth() {
    await this.page.locator('.react-calendar__navigation__prev-button').click();
  }

  async getCurrentMonthYear(): Promise<string> {
    const label = await this.page.locator('.react-calendar__navigation__label').textContent();
    return label || '';
  }

  // Assertions
  async expectToBeOnCalendarPage() {
    await this.expectToBeOnPage('/calendar');
  }

  async expectMonthViewActive() {
    await expect(this.monthViewButton()).toHaveAttribute('aria-pressed', 'true');
  }

  async expectListViewActive() {
    await expect(this.listViewButton()).toHaveAttribute('aria-pressed', 'true');
  }

  async expectNoEventsMessage() {
    await expect(this.noEventsMessage()).toBeVisible();
  }

  async expectEventsVisible() {
    await expect(this.eventsList()).toBeVisible();
    await expect(this.eventItems().first()).toBeVisible();
  }

  async expectEventExists(name: string) {
    await expect(this.getEventByName(name)).toBeVisible({ timeout: 5000 });
  }

  async expectEventCount(count: number) {
    await expect(this.eventItems()).toHaveCount(count);
  }

  async expectEventHasAge(name: string, age: number) {
    const event = this.getEventByName(name);
    await expect(event).toContainText(`Turning ${age} years old`);
  }

  async expectEventHasType(name: string, type: 'birthday' | 'nameday') {
    const event = this.getEventByName(name);
    await expect(event.locator('[class*="eventChip"]')).toContainText(type);
  }

  async expectDateHasEvents(date: Date) {
    const dots = this.getEventDots(date);
    await expect(dots.first()).toBeVisible();
  }

  async expectCalendarVisible() {
    await expect(this.calendar()).toBeVisible();
  }

  async expectSelectedDate(dateText: string) {
    await expect(this.selectedDateTitle()).toContainText(dateText);
  }
}
