import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Contact, Connection } from '../services/api';

// Query keys
export const contactsKeys = {
  all: ['contacts'] as const,
  detail: (id: string) => ['contacts', id] as const,
};

// Fetch all contacts
export function useContacts() {
  return useQuery({
    queryKey: contactsKeys.all,
    queryFn: () => api.getContacts(),
  });
}

// Fetch single contact
export function useContact(id: string) {
  return useQuery({
    queryKey: contactsKeys.detail(id),
    queryFn: () => api.getContact(id),
    enabled: !!id,
  });
}

// Create contact
export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Contact>) => api.createContact(data),
    onSuccess: () => {
      // Invalidate and refetch contacts list
      queryClient.invalidateQueries({ queryKey: contactsKeys.all });
    },
  });
}

// Update contact
export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Contact> }) =>
      api.updateContact(id, data),
    onSuccess: (_, variables) => {
      // Invalidate both the list and the specific contact
      queryClient.invalidateQueries({ queryKey: contactsKeys.all });
      queryClient.invalidateQueries({ queryKey: contactsKeys.detail(variables.id) });
    },
  });
}

// Delete contact
export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactsKeys.all });
    },
  });
}

// Upload contact avatar
export function useUploadContactAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, file }: { contactId: string; file: File }) =>
      api.uploadContactAvatar(contactId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contactsKeys.all });
      queryClient.invalidateQueries({ queryKey: contactsKeys.detail(variables.contactId) });
    },
  });
}

// Delete contact avatar
export function useDeleteContactAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => api.deleteContactAvatar(contactId),
    onSuccess: (_, contactId) => {
      queryClient.invalidateQueries({ queryKey: contactsKeys.all });
      queryClient.invalidateQueries({ queryKey: contactsKeys.detail(contactId) });
    },
  });
}

// Add connection
export function useAddConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, data }: { contactId: string; data: Partial<Connection> }) =>
      api.addConnection(contactId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contactsKeys.all });
      queryClient.invalidateQueries({ queryKey: contactsKeys.detail(variables.contactId) });
    },
  });
}

// Update connection
export function useUpdateConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contactId,
      connectionId,
      data,
    }: {
      contactId: string;
      connectionId: string;
      data: Partial<Connection>;
    }) => api.updateConnection(contactId, connectionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contactsKeys.all });
      queryClient.invalidateQueries({ queryKey: contactsKeys.detail(variables.contactId) });
    },
  });
}

// Delete connection
export function useDeleteConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, connectionId }: { contactId: string; connectionId: string }) =>
      api.deleteConnection(contactId, connectionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contactsKeys.all });
      queryClient.invalidateQueries({ queryKey: contactsKeys.detail(variables.contactId) });
    },
  });
}
