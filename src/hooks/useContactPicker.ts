import { useState, useCallback } from 'react'
import { useCreateContact } from './useContacts'

// TypeScript declarations for Contact Picker API
interface ContactAddress {
  city?: string
  country?: string
  addressLine?: string[]
  postalCode?: string
  region?: string
}

interface ContactInfo {
  address?: ContactAddress[]
  email?: string[]
  name?: string[]
  tel?: string[]
}

interface ContactsManager {
  select(
    properties: string[],
    options?: { multiple?: boolean }
  ): Promise<ContactInfo[]>
  getProperties(): Promise<string[]>
}

declare global {
  interface Navigator {
    contacts?: ContactsManager
  }
}

/**
 * Hook to handle importing contacts from phone using Contact Picker API
 */
export const useContactPicker = () => {
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const createContactMutation = useCreateContact()

  // Check if Contact Picker API is supported
  const isSupported = useCallback(() => {
    return 'contacts' in navigator
  }, [])

  /**
   * Parse contact name into first and last name
   */
  const parseName = (fullName: string): { firstName: string; lastName?: string } => {
    const parts = fullName.trim().split(/\s+/)
    if (parts.length === 1) {
      return { firstName: parts[0] }
    }
    const firstName = parts[0]
    const lastName = parts.slice(1).join(' ')
    return { firstName, lastName }
  }

  /**
   * Import contacts from phone
   */
  const importFromPhone = useCallback(async () => {
    if (!isSupported()) {
      setError('Contact Picker is not supported on this device')
      return { success: false, count: 0 }
    }

    setIsImporting(true)
    setError(null)

    try {
      const contacts = await navigator.contacts!.select(
        ['name', 'email', 'tel'],
        { multiple: true }
      )

      if (!contacts || contacts.length === 0) {
        setIsImporting(false)
        return { success: true, count: 0 }
      }

      // Import each contact
      let successCount = 0
      const errors: string[] = []

      for (const contact of contacts) {
        try {
          const name = contact.name?.[0] || 'Unknown'
          const { firstName, lastName } = parseName(name)

          const contactData = {
            firstName,
            lastName: lastName || null,
            email: contact.email?.[0] || null,
            mobile: contact.tel?.[0] || null,
          }

          await createContactMutation.mutateAsync(contactData)
          successCount++
        } catch (err: any) {
          errors.push(`Failed to import ${contact.name?.[0] || 'contact'}: ${err.message}`)
        }
      }

      setIsImporting(false)

      if (errors.length > 0 && successCount === 0) {
        setError('Failed to import all contacts')
        return { success: false, count: 0, errors }
      }

      return {
        success: true,
        count: successCount,
        errors: errors.length > 0 ? errors : undefined,
      }
    } catch (err: any) {
      setIsImporting(false)

      // User cancelled the picker
      if (err.name === 'AbortError') {
        return { success: false, count: 0, cancelled: true }
      }

      setError(err.message || 'Failed to import contacts')
      return { success: false, count: 0, error: err.message }
    }
  }, [isSupported, createContactMutation])

  return {
    importFromPhone,
    isImporting,
    error,
    isSupported: isSupported(),
  }
}
