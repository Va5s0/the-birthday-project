import { test as authTest, expect } from '../../fixtures/auth.fixture';
import { ContactsPage } from '../../page-objects/contacts/contacts.page';
import { ConnectionsPage } from '../../page-objects/connections/connections.page';
import { AddContactModal } from '../../page-objects/contacts/add-contact-modal.page';
import { EditContactModal } from '../../page-objects/contacts/edit-contact-modal.page';
import { createTestContact, addTestConnection, updateTestConnection, deleteTestConnection } from '../../helpers/api-helpers';

authTest.describe('Connection CRUD Operations', () => {
  let contactsPage: ContactsPage;
  let connectionsPage: ConnectionsPage;
  let addContactModal: AddContactModal;
  let editContactModal: EditContactModal;

  authTest.beforeEach(async ({ authenticatedPage }) => {
    contactsPage = new ContactsPage(authenticatedPage);
    connectionsPage = new ConnectionsPage(authenticatedPage);
    addContactModal = new AddContactModal(authenticatedPage);
    editContactModal = new EditContactModal(authenticatedPage);

    await contactsPage.navigate();
    await contactsPage.waitForContactsToLoad();
  });

  authTest('should add a connection to a contact via API and view it in UI', async ({ authenticatedPage, accessToken }) => {
    // Create a contact first
    const contact = await createTestContact(accessToken, {
      firstName: 'MainContact',
      lastName: 'Test',
    });

    // Add a connection via API
    await addTestConnection(accessToken, contact.id, {
      firstName: 'Connected',
      lastName: 'Person',
      email: 'connected@example.com',
    });

    // Hard reload to clear React Query cache
    await authenticatedPage.reload({ waitUntil: 'networkidle' });
    await contactsPage.waitForContactsToLoad();

    // Verify connection exists
    await connectionsPage.expectConnectionExists('MainContact', 'Connected', 'Test', 'Person');
    await connectionsPage.expectConnectionHasEmail('MainContact', 'Connected', 'connected@example.com', 'Test', 'Person');
  });

  authTest('should add a connection via UI', async ({ authenticatedPage, accessToken }) => {
    // Create a contact first
    await createTestContact(accessToken, {
      firstName: 'UIContact',
      lastName: 'Test',
    });

    // Reload page
    await authenticatedPage.reload({ waitUntil: 'networkidle' });
    await contactsPage.waitForContactsToLoad();

    // Click add connection
    await connectionsPage.clickAddConnection('UIContact', 'Test');

    // Fill in connection form (connections don't have email/phone fields in the UI)
    await addContactModal.waitForModalToOpen();
    await addContactModal.createContact({
      firstName: 'UIConnection',
      lastName: 'Person',
    });

    // Verify connection was added
    await connectionsPage.expectConnectionExists('UIContact', 'UIConnection', 'Test', 'Person');
  });

  authTest('should edit a connection via API and verify in UI', async ({ accessToken }) => {
    // Create a contact
    const contact = await createTestContact(accessToken, {
      firstName: 'EditContact',
      lastName: 'Test',
    });

    // Add a connection
    const connection = await addTestConnection(accessToken, contact.id, {
      firstName: 'Original',
      lastName: 'Name',
      email: 'original@example.com',
    });

    // Reload page
    await contactsPage.navigate();
    await contactsPage.waitForContactsToLoad();

    // Verify original connection
    await connectionsPage.expectConnectionExists('EditContact', 'Original', 'Test', 'Name');

    // Update connection via API
    await updateTestConnection(accessToken, contact.id, connection.id, {
      firstName: 'Updated',
      lastName: 'Name',
      email: 'updated@example.com',
    });

    // Reload page to see changes
    await contactsPage.navigate();
    await contactsPage.waitForContactsToLoad();

    // Verify connection was updated
    await connectionsPage.expectConnectionExists('EditContact', 'Updated', 'Test', 'Name');
    await connectionsPage.expectConnectionNotExists('EditContact', 'Original', 'Test', 'Name');
  });

  authTest('should edit a connection via UI', async ({ authenticatedPage, accessToken }) => {
    // Create a contact
    const contact = await createTestContact(accessToken, {
      firstName: 'UIEditContact',
      lastName: 'Test',
    });

    // Add a connection
    await addTestConnection(accessToken, contact.id, {
      firstName: 'UIEdit',
      lastName: 'Original',
    });

    // Reload page
    await authenticatedPage.reload({ waitUntil: 'networkidle' });
    await contactsPage.waitForContactsToLoad();

    // Edit the connection
    await connectionsPage.editConnection('UIEditContact', 'UIEdit', 'Test', 'Original');

    // Update in modal (connections don't have email/phone fields in the UI)
    await editContactModal.waitForModalToOpen();
    await editContactModal.updateContact({
      firstName: 'UIEdit',
      lastName: 'Updated',
    });

    // Verify connection was updated
    await connectionsPage.expectConnectionExists('UIEditContact', 'UIEdit', 'Test', 'Updated');
    await connectionsPage.expectConnectionNotExists('UIEditContact', 'UIEdit', 'Test', 'Original');
  });

  authTest('should delete a connection via API and verify in UI', async ({ accessToken }) => {
    // Create a contact
    const contact = await createTestContact(accessToken, {
      firstName: 'DeleteContact',
      lastName: 'Test',
    });

    // Add a connection
    const connection = await addTestConnection(accessToken, contact.id, {
      firstName: 'ToDelete',
      lastName: 'Person',
    });

    // Reload page
    await contactsPage.navigate();
    await contactsPage.waitForContactsToLoad();

    // Verify connection exists
    await connectionsPage.expectConnectionExists('DeleteContact', 'ToDelete', 'Test', 'Person');

    // Delete connection via API
    await deleteTestConnection(accessToken, contact.id, connection.id);

    // Reload page
    await contactsPage.navigate();
    await contactsPage.waitForContactsToLoad();

    // Verify connection was deleted
    await connectionsPage.expectConnectionNotExists('DeleteContact', 'ToDelete', 'Test', 'Person');
  });

  authTest('should delete a connection via UI', async ({ authenticatedPage, accessToken }) => {
    // Create a contact
    const contact = await createTestContact(accessToken, {
      firstName: 'UIDeleteContact',
      lastName: 'Test',
    });

    // Add a connection
    await addTestConnection(accessToken, contact.id, {
      firstName: 'UIDelete',
      lastName: 'Person',
    });

    // Reload page
    await authenticatedPage.reload({ waitUntil: 'networkidle' });
    await contactsPage.waitForContactsToLoad();

    // Verify connection exists initially
    const initialCount = await connectionsPage.getConnectionsCount('UIDeleteContact', 'Test');
    await connectionsPage.expectConnectionExists('UIDeleteContact', 'UIDelete', 'Test', 'Person');

    // Delete the connection
    await connectionsPage.deleteConnection('UIDeleteContact', 'UIDelete', 'Test', 'Person');

    // Verify connection was deleted
    await connectionsPage.expectConnectionNotExists('UIDeleteContact', 'UIDelete', 'Test', 'Person');
    await connectionsPage.expectConnectionsCount('UIDeleteContact', initialCount - 1, 'Test');
  });

  authTest('should show multiple connections for a contact', async ({ accessToken }) => {
    // Create a contact
    const contact = await createTestContact(accessToken, {
      firstName: 'MultipleConnections',
      lastName: 'Test',
    });

    // Add multiple connections
    await addTestConnection(accessToken, contact.id, {
      firstName: 'Connection',
      lastName: 'One',
    });

    await addTestConnection(accessToken, contact.id, {
      firstName: 'Connection',
      lastName: 'Two',
    });

    await addTestConnection(accessToken, contact.id, {
      firstName: 'Connection',
      lastName: 'Three',
    });

    // Reload page
    await contactsPage.navigate();
    await contactsPage.waitForContactsToLoad();

    // Verify all connections exist
    await connectionsPage.expectConnectionsCount('MultipleConnections', 3, 'Test');
    await connectionsPage.expectConnectionExists('MultipleConnections', 'Connection', 'Test', 'One');
    await connectionsPage.expectConnectionExists('MultipleConnections', 'Connection', 'Test', 'Two');
    await connectionsPage.expectConnectionExists('MultipleConnections', 'Connection', 'Test', 'Three');
  });

  authTest('should add connection with birthday and display birthday icon', async ({ accessToken }) => {
    // Create a contact
    const contact = await createTestContact(accessToken, {
      firstName: 'BirthdayConnection',
      lastName: 'Test',
    });

    // Add connection with birthday
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const birthday = `${year - 25}-${month}-15`;

    await addTestConnection(accessToken, contact.id, {
      firstName: 'HasBirthday',
      lastName: 'Person',
      birthday,
    });

    // Reload page
    await contactsPage.navigate();
    await contactsPage.waitForContactsToLoad();

    // Verify connection exists and has birthday icon
    await connectionsPage.expectConnectionExists('BirthdayConnection', 'HasBirthday', 'Test', 'Person');
    await connectionsPage.expectConnectionHasBirthday('BirthdayConnection', 'HasBirthday', 'Test', 'Person');
  });

  authTest('should toggle connections visibility', async ({ authenticatedPage, accessToken }) => {
    // Create a contact
    const contact = await createTestContact(accessToken, {
      firstName: 'ToggleTest',
      lastName: 'Contact',
    });

    // Add a connection
    await addTestConnection(accessToken, contact.id, {
      firstName: 'Toggled',
      lastName: 'Connection',
    });

    // Reload page
    await authenticatedPage.reload({ waitUntil: 'networkidle' });
    await contactsPage.waitForContactsToLoad();

    // Open connections
    await connectionsPage.openConnections('ToggleTest', 'Contact');
    await connectionsPage.expectConnectionsVisible('ToggleTest', 'Contact');

    // Close connections
    await connectionsPage.closeConnections('ToggleTest', 'Contact');

    // Verify we can toggle it back open (connections should collapse and expand)
    await connectionsPage.openConnections('ToggleTest', 'Contact');
    await connectionsPage.expectConnectionsVisible('ToggleTest', 'Contact');
  });

  authTest('should create connection with all fields', async ({ accessToken }) => {
    // Create a contact
    const contact = await createTestContact(accessToken, {
      firstName: 'AllFields',
      lastName: 'Test',
    });

    // Add connection with all fields
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const birthday = `${year - 30}-${month}-20`;

    await addTestConnection(accessToken, contact.id, {
      firstName: 'Complete',
      lastName: 'Connection',
      email: 'complete@example.com',
      mobile: '+1234567890',
      phone: '+0987654321',
      birthday,
    });

    // Reload page
    await contactsPage.navigate();
    await contactsPage.waitForContactsToLoad();

    // Verify connection exists with all data
    await connectionsPage.expectConnectionExists('AllFields', 'Complete', 'Test', 'Connection');
    await connectionsPage.expectConnectionHasEmail('AllFields', 'Complete', 'complete@example.com', 'Test', 'Connection');
    await connectionsPage.expectConnectionHasBirthday('AllFields', 'Complete', 'Test', 'Connection');
  });
});
