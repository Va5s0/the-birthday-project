import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class ContactsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  private addContactButton = () => this.page.getByRole('button', { name: /add/i }).last();
  private contactCards = () => this.page.locator('[id^="contact-"]');
  private toggleViewButtons = () => this.page.getByRole('group', { name: /contacts view toggle/i });
  private cardsViewButton = () => this.page.getByRole('button', { name: /cards view/i });
  private treeViewButton = () => this.page.getByRole('button', { name: /tree.*view/i });
  private loadingText = () => this.page.getByText(/loading contacts/i);

  // Contact card selectors
  getContactCard(contactId: string): Locator {
    return this.page.locator(`#contact-${contactId}`);
  }

  getContactByName(firstName: string, lastName?: string): Locator {
    const fullName = lastName ? `${firstName} ${lastName}` : firstName;
    // Find the contact card by looking for text content within contact cards
    return this.page.locator('[id^="contact-"]').filter({ hasText: fullName }).first();
  }

  // Actions
  async navigate() {
    await this.goto('/');
  }

  async clickAddContact() {
    await this.addContactButton().click();
  }

  async switchToCardsView() {
    await this.cardsViewButton().click();
  }

  async switchToTreeView() {
    await this.treeViewButton().click();
  }

  async waitForContactsToLoad() {
    await this.loadingText().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      // If loading text never appears, contacts are already loaded
    });
  }

  async getContactCount(): Promise<number> {
    await this.waitForContactsToLoad();
    return await this.contactCards().count();
  }

  async deleteContactByName(firstName: string, lastName?: string) {
    const contact = this.getContactByName(firstName, lastName);
    await contact.hover();

    // Find the more actions button - it's the last MoreVertIcon in the card
    const cardWrapper = contact.locator('xpath=ancestor::div[@id]').first();
    const moreButton = cardWrapper.locator('button').filter({ has: this.page.locator('[data-testid="MoreVertIcon"]') }).last();
    await moreButton.click();

    // Click delete in the menu
    await this.page.getByRole('menuitem').filter({ hasText: /delete/i }).click();

    // Confirm deletion in modal
    await this.page.getByRole('button', { name: /^delete$/i }).click();
  }

  async editContactByName(firstName: string, lastName?: string) {
    const contact = this.getContactByName(firstName, lastName);
    await contact.hover();

    // Find the more actions button - it's the last MoreVertIcon in the card
    const cardWrapper = contact.locator('xpath=ancestor::div[@id]').first();
    const moreButton = cardWrapper.locator('button').filter({ has: this.page.locator('[data-testid="MoreVertIcon"]') }).last();
    await moreButton.click();

    // Click edit in the menu
    await this.page.getByRole('menuitem').filter({ hasText: /edit/i }).click();
  }

  // Assertions
  async expectToBeOnContactsPage() {
    await this.expectToBeOnPage('/');
  }

  async expectContactExists(firstName: string, lastName?: string) {
    await expect(this.getContactByName(firstName, lastName)).toBeVisible({ timeout: 5000 });
  }

  async expectContactNotExists(firstName: string, lastName?: string) {
    await expect(this.getContactByName(firstName, lastName)).not.toBeVisible({ timeout: 5000 });
  }

  async expectContactCount(count: number) {
    await this.waitForContactsToLoad();
    await expect(this.contactCards()).toHaveCount(count);
  }

  async expectAddContactButtonVisible() {
    await expect(this.addContactButton()).toBeVisible();
  }
}
