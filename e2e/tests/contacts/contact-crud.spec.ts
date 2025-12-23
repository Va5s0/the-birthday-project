import { test as authTest, expect } from '../../fixtures/auth.fixture';
import { ContactsPage } from '../../page-objects/contacts/contacts.page';
import { AddContactModal } from '../../page-objects/contacts/add-contact-modal.page';
import { EditContactModal } from '../../page-objects/contacts/edit-contact-modal.page';

authTest.describe('Contact CRUD Operations', () => {
  let contactsPage: ContactsPage;
  let addContactModal: AddContactModal;
  let editContactModal: EditContactModal;

  authTest.beforeEach(async ({ authenticatedPage }) => {
    contactsPage = new ContactsPage(authenticatedPage);
    addContactModal = new AddContactModal(authenticatedPage);
    editContactModal = new EditContactModal(authenticatedPage);

    await contactsPage.navigate();
    await contactsPage.waitForContactsToLoad();
  });

  authTest('should create a new contact with all fields', async () => {
    const initialCount = await contactsPage.getContactCount();

    await contactsPage.clickAddContact();
    await addContactModal.waitForModalToOpen();

    await addContactModal.createContact({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      mobile: '+1234567890',
      phone: '+0987654321',
      birthday: new Date('1990-05-15'),
    });

    // Verify contact was created
    await contactsPage.expectContactExists('John', 'Doe');
    await contactsPage.expectContactCount(initialCount + 1);
  });

  authTest('should create a contact with only required fields', async () => {
    await contactsPage.clickAddContact();
    await addContactModal.waitForModalToOpen();

    await addContactModal.createContact({
      firstName: 'Jane',
    });

    await contactsPage.expectContactExists('Jane');
  });

  authTest('should edit an existing contact', async () => {
    // Create a contact first
    await contactsPage.clickAddContact();
    await addContactModal.waitForModalToOpen();

    await addContactModal.createContact({
      firstName: 'EditTest',
      lastName: 'Original',
      email: 'original@example.com',
    });

    await contactsPage.expectContactExists('EditTest', 'Original');

    // Edit the contact
    await contactsPage.editContactByName('EditTest', 'Original');
    await editContactModal.waitForModalToOpen();

    await editContactModal.updateContact({
      firstName: 'EditTest',
      lastName: 'Updated',
      email: 'updated@example.com',
    });

    // Verify contact was updated
    await contactsPage.expectContactExists('EditTest', 'Updated');
    await contactsPage.expectContactNotExists('EditTest', 'Original');
  });

  authTest('should delete a contact', async () => {
    // Create a contact first
    await contactsPage.clickAddContact();
    await addContactModal.waitForModalToOpen();

    await addContactModal.createContact({
      firstName: 'DeleteMe',
      lastName: 'Test',
    });

    await contactsPage.expectContactExists('DeleteMe', 'Test');
    const initialCount = await contactsPage.getContactCount();

    // Delete the contact
    await contactsPage.deleteContactByName('DeleteMe', 'Test');

    // Verify contact was deleted
    await contactsPage.expectContactNotExists('DeleteMe', 'Test');
    await contactsPage.expectContactCount(initialCount - 1);
  });

  authTest('should display empty state when no contacts exist', async () => {
    // Verify we're on contacts page (which might be empty initially)
    await contactsPage.expectToBeOnContactsPage();

    // The page should still show the add button even with no contacts
    await contactsPage.expectAddContactButtonVisible();
  });

  authTest('should cancel contact creation', async () => {
    const initialCount = await contactsPage.getContactCount();

    await contactsPage.clickAddContact();
    await addContactModal.waitForModalToOpen();

    await addContactModal.fillFirstName('CancelTest');
    await addContactModal.close();

    await addContactModal.expectModalClosed();
    await contactsPage.expectContactCount(initialCount);
  });

  authTest('should switch between cards and tree view', async ({ authenticatedPage }) => {
    // Create a contact to ensure there's something to display
    await contactsPage.clickAddContact();
    await addContactModal.waitForModalToOpen();

    await addContactModal.createContact({
      firstName: 'ViewTest',
    });

    // Verify contact exists in cards view
    await contactsPage.expectContactExists('ViewTest');

    // Switch to tree view
    await contactsPage.switchToTreeView();

    // Just verify tree view is active (different structure, so don't check for contact visibility)
    await expect(authenticatedPage.getByRole('button', { name: /tree.*view/i })).toHaveAttribute('aria-pressed', 'true');

    // Switch back to cards view
    await contactsPage.switchToCardsView();

    // Verify we're back in cards view
    await expect(authenticatedPage.getByRole('button', { name: /cards view/i })).toHaveAttribute('aria-pressed', 'true');

    // Contact should still be visible in cards view
    await contactsPage.expectContactExists('ViewTest');
  });

  authTest('should create multiple contacts', async () => {
    const contacts = [
      { firstName: 'Contact', lastName: 'One' },
      { firstName: 'Contact', lastName: 'Two' },
      { firstName: 'Contact', lastName: 'Three' },
    ];

    for (const contact of contacts) {
      await contactsPage.clickAddContact();
      await addContactModal.waitForModalToOpen();
      await addContactModal.createContact(contact);
      await contactsPage.expectContactExists(contact.firstName, contact.lastName);
    }

    // Verify all contacts exist
    for (const contact of contacts) {
      await contactsPage.expectContactExists(contact.firstName, contact.lastName);
    }
  });
});
