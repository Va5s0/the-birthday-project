import { test as authTest, expect } from '../../fixtures/auth.fixture';
import { CalendarPage } from '../../page-objects/calendar/calendar.page';
import { ContactsPage } from '../../page-objects/contacts/contacts.page';
import { AddContactModal } from '../../page-objects/contacts/add-contact-modal.page';
import { createTestContact } from '../../helpers/api-helpers';

authTest.describe('Calendar View', () => {
  let calendarPage: CalendarPage;
  let contactsPage: ContactsPage;
  let addContactModal: AddContactModal;

  authTest.beforeEach(async ({ authenticatedPage }) => {
    calendarPage = new CalendarPage(authenticatedPage);
    contactsPage = new ContactsPage(authenticatedPage);
    addContactModal = new AddContactModal(authenticatedPage);
  });

  authTest('should navigate to calendar view', async () => {
    await calendarPage.navigate();

    await calendarPage.expectToBeOnCalendarPage();
    await calendarPage.expectCalendarVisible();
    await calendarPage.expectMonthViewActive();
  });

  authTest('should switch between month and list views', async () => {
    await calendarPage.navigate();

    // Should start in month view
    await calendarPage.expectMonthViewActive();

    // Switch to list view
    await calendarPage.switchToListView();
    await calendarPage.expectListViewActive();

    // Switch back to month view
    await calendarPage.switchToMonthView();
    await calendarPage.expectMonthViewActive();
  });

  authTest('should show no celebrations message for dates without events', async () => {
    await calendarPage.navigate();

    // Select a date far in the future (unlikely to have events)
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 5);
    futureDate.setMonth(11); // December
    futureDate.setDate(25);

    // Navigate to that month/year
    await calendarPage.navigate();
    // Note: react-calendar might not support dates too far in future,
    // so let's just check current month for a date without events
    // We'll select today's date (which likely has no events in a fresh test)
    const today = new Date();
    await calendarPage.selectDate(today);

    // Should show no events message (unless there's a contact with today's birthday)
    // For a more reliable test, we should ensure no contacts exist
    await calendarPage.expectNoEventsMessage();
  });

  authTest('should display birthday events on calendar', async ({ accessToken }) => {
    // Create a contact with a birthday in the current month via API
    // Use date-only format (YYYY-MM-DD) to avoid timezone issues
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const birthday = `${year}-${month}-15`; // 15th of current month

    await createTestContact(accessToken, {
      firstName: 'Birthday',
      lastName: 'Person',
      birthday,
    });

    // Navigate to calendar
    await calendarPage.navigate();

    // The birthday should appear on the 15th
    const testDate = new Date();
    testDate.setDate(15);
    await calendarPage.selectDate(testDate);

    // Should show the birthday event
    await calendarPage.expectEventsVisible();
    await calendarPage.expectEventExists('Birthday Person');
  });

  authTest('should calculate and display age for birthdays', async ({ accessToken }) => {
    // Create a contact with a birthday exactly 30 years ago
    const currentYear = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const birthday = `${currentYear - 30}-${month}-20`; // 30 years ago, 20th of current month

    await createTestContact(accessToken, {
      firstName: 'Age',
      lastName: 'Test',
      birthday,
    });

    // Navigate to calendar and select the birthday date
    await calendarPage.navigate();

    const testDate = new Date();
    testDate.setDate(20);
    await calendarPage.selectDate(testDate);

    // Should show the age
    await calendarPage.expectEventExists('Age Test');
    await calendarPage.expectEventHasAge('Age Test', 30);
  });

  authTest('should navigate to contact when clicking on calendar event', async ({ authenticatedPage, accessToken }) => {
    // Create a contact with a birthday
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const birthday = `${year}-${month}-10`;

    await createTestContact(accessToken, {
      firstName: 'Navigate',
      lastName: 'Test',
      birthday,
    });

    // Go to calendar
    await calendarPage.navigate();

    // Select the date with the birthday
    const testDate = new Date();
    testDate.setDate(10);
    await calendarPage.selectDate(testDate);

    // Click on the event
    await calendarPage.clickEvent('Navigate Test');

    // Should navigate back to contacts page
    await expect(authenticatedPage).toHaveURL('/', { timeout: 5000 });

    // Contact should be visible (and possibly highlighted/scrolled to)
    await contactsPage.expectContactExists('Navigate', 'Test');
  });

  authTest('should show multiple events on the same date', async ({ accessToken }) => {
    // Create multiple contacts with the same birthday
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const birthday = `${year}-${month}-05`;

    // Create first contact
    await createTestContact(accessToken, {
      firstName: 'Person',
      lastName: 'One',
      birthday,
    });

    // Create second contact
    await createTestContact(accessToken, {
      firstName: 'Person',
      lastName: 'Two',
      birthday,
    });

    // Navigate to calendar
    await calendarPage.navigate();

    // Select the shared birthday date
    const testDate = new Date();
    testDate.setDate(5);
    await calendarPage.selectDate(testDate);

    // Should show both events
    await calendarPage.expectEventCount(2);
    await calendarPage.expectEventExists('Person One');
    await calendarPage.expectEventExists('Person Two');
  });

  authTest('should navigate between months', async () => {
    await calendarPage.navigate();

    // Get current month
    const currentMonth = await calendarPage.getCurrentMonthYear();

    // Navigate to next month
    await calendarPage.navigateToNextMonth();
    const nextMonth = await calendarPage.getCurrentMonthYear();

    // Month should have changed
    expect(nextMonth).not.toBe(currentMonth);

    // Navigate back
    await calendarPage.navigateToPreviousMonth();
    const backToOriginal = await calendarPage.getCurrentMonthYear();

    // Should be back to original month
    expect(backToOriginal).toBe(currentMonth);
  });

  authTest.skip('should switch between views and maintain event on return to month view', async ({ accessToken }) => {
    // Create a contact with a birthday
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const birthday = `${year}-${month}-12`;

    await createTestContact(accessToken, {
      firstName: 'View',
      lastName: 'Switch',
      birthday,
    });

    // Go to calendar and select a date with an event
    await calendarPage.navigate();

    const testDate = new Date();
    testDate.setDate(12);
    await calendarPage.selectDate(testDate);

    // Verify event is shown in month view
    await calendarPage.expectEventExists('View Switch');

    // Switch to list view and verify it's active
    await calendarPage.switchToListView();
    await calendarPage.expectListViewActive();

    // Switch back to month view
    await calendarPage.switchToMonthView();
    await calendarPage.expectMonthViewActive();

    // Event should still be visible in month view after switching back
    await calendarPage.expectEventExists('View Switch');
  });
});
