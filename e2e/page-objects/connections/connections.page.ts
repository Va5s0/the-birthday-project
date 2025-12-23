import { Page, expect, Locator } from '@playwright/test';

export class ConnectionsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators for connections within a contact card
  getContactCard(contactFirstName: string, contactLastName?: string): Locator {
    const fullName = contactLastName ? `${contactFirstName} ${contactLastName}` : contactFirstName;
    return this.page.locator('[id^="contact-"]').filter({ hasText: fullName }).first();
  }

  getConnectionsContent(contactFirstName: string, contactLastName?: string): Locator {
    const contactCard = this.getContactCard(contactFirstName, contactLastName);
    // The connections content is inside a Collapse component
    return contactCard.locator('[class*="connectionsContent"]').first();
  }

  getConnectionToggleButton(contactFirstName: string, contactLastName?: string): Locator {
    const contactCard = this.getContactCard(contactFirstName, contactLastName);
    // The connections toggle button has the EmojiPeopleIcon (only visible when connections exist)
    return contactCard.locator('button').filter({ has: this.page.locator('[data-testid="EmojiPeopleIcon"]') }).first();
  }

  getAddConnectionButton(contactFirstName: string, contactLastName?: string): Locator {
    const contactCard = this.getContactCard(contactFirstName, contactLastName);
    // Add connection button has AddIcon, located in the card's connections row
    return contactCard.locator('button').filter({ has: this.page.locator('[data-testid="AddIcon"]') }).first();
  }

  getConnectionByName(
    contactFirstName: string,
    connectionFirstName: string,
    contactLastName?: string,
    connectionLastName?: string
  ): Locator {
    const contactCard = this.getContactCard(contactFirstName, contactLastName);
    const fullConnectionName = connectionLastName
      ? `${connectionFirstName} ${connectionLastName}`
      : connectionFirstName;
    // Connection cards have id="connection-{id}" and are divs with the connection name
    return contactCard.locator('[id^="connection-"]').filter({ hasText: fullConnectionName }).first();
  }

  getConnectionsList(contactFirstName: string, contactLastName?: string): Locator {
    const contactCard = this.getContactCard(contactFirstName, contactLastName);
    // All connections have id starting with "connection-"
    return contactCard.locator('[id^="connection-"]');
  }

  // Actions
  async openConnections(contactFirstName: string, contactLastName?: string) {
    // First ensure the contact card is visible
    const contactCard = this.getContactCard(contactFirstName, contactLastName);
    await contactCard.waitFor({ state: 'visible', timeout: 5000 });

    // Check if connections are already visible (expanded)
    const connectionsList = this.getConnectionsList(contactFirstName, contactLastName);
    const firstConnection = connectionsList.first();

    // If a connection is already visible, no need to toggle
    if (await firstConnection.isVisible().catch(() => false)) {
      return; // Already open
    }

    // The toggle button has EmojiPeopleIcon and only appears when connections exist
    const toggleButton = this.getConnectionToggleButton(contactFirstName, contactLastName);

    // Wait for toggle button to appear (it should be there if connections exist)
    try {
      await toggleButton.waitFor({ state: 'visible', timeout: 5000 });
      await toggleButton.click();
      // Wait for the Collapse animation to complete
      await this.page.waitForTimeout(800);
    } catch (e) {
      // Toggle button doesn't exist, which means no connections exist yet
    }
  }

  async closeConnections(contactFirstName: string, contactLastName?: string) {
    const toggleButton = this.getConnectionToggleButton(contactFirstName, contactLastName);
    await toggleButton.click();
    await this.page.waitForTimeout(500);
  }

  async clickAddConnection(contactFirstName: string, contactLastName?: string) {
    // The Add button is always visible, no need to open connections first
    const addButton = this.getAddConnectionButton(contactFirstName, contactLastName);
    await addButton.click();
  }

  async editConnection(
    contactFirstName: string,
    connectionFirstName: string,
    contactLastName?: string,
    connectionLastName?: string
  ) {
    await this.openConnections(contactFirstName, contactLastName);
    const connection = this.getConnectionByName(
      contactFirstName,
      connectionFirstName,
      contactLastName,
      connectionLastName
    );

    // Hover over connection to reveal actions
    await connection.hover();

    // Find edit button in the connection card
    const editButton = connection.locator('button').filter({ has: this.page.locator('[data-testid="EditIcon"]') }).first();
    await editButton.click();
  }

  async deleteConnection(
    contactFirstName: string,
    connectionFirstName: string,
    contactLastName?: string,
    connectionLastName?: string
  ) {
    await this.openConnections(contactFirstName, contactLastName);
    const connection = this.getConnectionByName(
      contactFirstName,
      connectionFirstName,
      contactLastName,
      connectionLastName
    );

    // Wait for connection to be visible
    await connection.waitFor({ state: 'visible', timeout: 5000 });

    // Hover over connection to reveal actions
    await connection.hover();
    await this.page.waitForTimeout(300);

    // Find delete button in the connection card (uses CloseIcon, not DeleteIcon)
    const deleteButton = connection.locator('button').filter({ has: this.page.locator('[data-testid="CloseIcon"]') }).first();
    await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
    await deleteButton.click();

    // Confirm deletion if a modal appears
    const confirmButton = this.page.getByRole('button', { name: /^delete$/i });
    if (await confirmButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await confirmButton.click();
    }
  }

  async getConnectionsCount(contactFirstName: string, contactLastName?: string): Promise<number> {
    await this.openConnections(contactFirstName, contactLastName);
    const connectionsList = this.getConnectionsList(contactFirstName, contactLastName);
    return await connectionsList.count();
  }

  // Assertions
  async expectConnectionsVisible(contactFirstName: string, contactLastName?: string) {
    // Instead of checking for the container, check if at least one connection is visible
    const connectionsList = this.getConnectionsList(contactFirstName, contactLastName);
    await expect(connectionsList.first()).toBeVisible({ timeout: 5000 });
  }

  async expectConnectionExists(
    contactFirstName: string,
    connectionFirstName: string,
    contactLastName?: string,
    connectionLastName?: string
  ) {
    await this.openConnections(contactFirstName, contactLastName);
    const connection = this.getConnectionByName(
      contactFirstName,
      connectionFirstName,
      contactLastName,
      connectionLastName
    );
    await expect(connection).toBeVisible({ timeout: 5000 });
  }

  async expectConnectionNotExists(
    contactFirstName: string,
    connectionFirstName: string,
    contactLastName?: string,
    connectionLastName?: string
  ) {
    await this.openConnections(contactFirstName, contactLastName);
    const connection = this.getConnectionByName(
      contactFirstName,
      connectionFirstName,
      contactLastName,
      connectionLastName
    );
    await expect(connection).not.toBeVisible({ timeout: 5000 });
  }

  async expectConnectionsCount(contactFirstName: string, count: number, contactLastName?: string) {
    const actualCount = await this.getConnectionsCount(contactFirstName, contactLastName);
    expect(actualCount).toBe(count);
  }

  async expectConnectionHasEmail(
    contactFirstName: string,
    connectionFirstName: string,
    email: string,
    contactLastName?: string,
    connectionLastName?: string
  ) {
    const connection = this.getConnectionByName(
      contactFirstName,
      connectionFirstName,
      contactLastName,
      connectionLastName
    );
    await expect(connection).toContainText(email);
  }

  async expectConnectionHasBirthday(
    contactFirstName: string,
    connectionFirstName: string,
    contactLastName?: string,
    connectionLastName?: string
  ) {
    const connection = this.getConnectionByName(
      contactFirstName,
      connectionFirstName,
      contactLastName,
      connectionLastName
    );
    // Check for birthday icon or text
    const birthdayIcon = connection.locator('[data-testid="CakeIcon"]');
    await expect(birthdayIcon).toBeVisible();
  }
}
