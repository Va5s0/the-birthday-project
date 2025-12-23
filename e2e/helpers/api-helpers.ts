const API_URL = process.env.TEST_API_URL || 'http://localhost:5001/api';

export async function createTestUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create test user: ${response.statusText} - ${error}`);
  }

  const data = await response.json();
  return data.user;
}

export async function getAuthTokens(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to login: ${response.statusText} - ${error}`);
  }

  const data = await response.json();
  const cookies = response.headers.get('set-cookie');
  const refreshToken = cookies?.match(/refreshToken=([^;]+)/)?.[1] || '';

  return {
    accessToken: data.accessToken,
    refreshToken,
  };
}

export async function createTestContact(accessToken: string, contactData: any) {
  const response = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(contactData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create contact: ${response.statusText} - ${error}`);
  }

  return response.json();
}

export async function deleteTestContact(accessToken: string, contactId: string) {
  const response = await fetch(`${API_URL}/contacts/${contactId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete contact: ${response.statusText} - ${error}`);
  }

  return response.json();
}

export async function addTestConnection(
  accessToken: string,
  contactId: string,
  connectionData: any
) {
  const response = await fetch(`${API_URL}/contacts/${contactId}/connections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(connectionData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to add connection: ${response.statusText} - ${error}`);
  }

  return response.json();
}

export async function updateTestConnection(
  accessToken: string,
  contactId: string,
  connectionId: string,
  connectionData: any
) {
  const response = await fetch(`${API_URL}/contacts/${contactId}/connections/${connectionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(connectionData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update connection: ${response.statusText} - ${error}`);
  }

  return response.json();
}

export async function deleteTestConnection(
  accessToken: string,
  contactId: string,
  connectionId: string
) {
  const response = await fetch(`${API_URL}/contacts/${contactId}/connections/${connectionId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete connection: ${response.statusText} - ${error}`);
  }

  return response.json();
}
