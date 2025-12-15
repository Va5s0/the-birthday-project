import { jwtDecode } from "jwt-decode"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api"

// Types
export interface User {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  phoneNumber?: string | null
  birthday?: string | null
  avatarUrl?: string | null
  namedayId?: string | null
  namedayDate?: string | null
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  userId: string
  firstName: string
  lastName?: string | null
  email?: string | null
  phone?: string | null
  mobile?: string | null
  birthday?: string | null
  avatarUrl?: string | null
  namedayId?: string | null
  namedayDate?: string | null
  createdAt: string
  updatedAt: string
  connections: Connection[]
}

export interface Connection {
  id: string
  contactId: string
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  mobile?: string | null
  email?: string | null
  birthday?: string | null
  avatarUrl?: string | null
  namedayId?: string | null
  namedayDate?: string | null
}

export interface AuthTokens {
  accessToken: string
  user: User
}

export interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

// Token management
class TokenManager {
  private accessToken: string | null = null
  private refreshPromise: Promise<string> | null = null

  setAccessToken(token: string) {
    this.accessToken = token
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  clearTokens() {
    this.accessToken = null
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JWTPayload>(token)
      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime + 60 // Refresh if less than 1 minute left
    } catch {
      return true
    }
  }

  async getValidToken(): Promise<string | null> {
    // If we have a valid access token, return it
    if (this.accessToken && !this.isTokenExpired(this.accessToken)) {
      return this.accessToken
    }

    // If refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    // Try to refresh (even if no access token - refresh token cookie might be valid)
    this.refreshPromise = this.refreshToken()

    try {
      const newToken = await this.refreshPromise
      return newToken
    } catch (error) {
      // Refresh failed (no valid refresh token or expired)
      return null
    } finally {
      this.refreshPromise = null
    }
  }

  private async refreshToken(): Promise<string> {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // Send httpOnly cookie
    })

    if (!response.ok) {
      this.clearTokens()
      throw new Error("Token refresh failed")
    }

    const data = await response.json()
    this.setAccessToken(data.accessToken)
    return data.accessToken
  }
}

export const tokenManager = new TokenManager()

// API Client
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await tokenManager.getValidToken()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // Include cookies
    })

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  private async uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = "avatar"
  ): Promise<T> {
    const token = await tokenManager.getValidToken()

    const formData = new FormData()
    formData.append(fieldName, file)

    const headers: HeadersInit = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Upload failed" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth endpoints
  async register(email: string, password: string): Promise<AuthTokens> {
    const data = await this.request<AuthTokens>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    tokenManager.setAccessToken(data.accessToken)
    return data
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const data = await this.request<AuthTokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    tokenManager.setAccessToken(data.accessToken)
    return data
  }

  async logout(): Promise<void> {
    try {
      await this.request("/auth/logout", { method: "POST" })
    } finally {
      tokenManager.clearTokens()
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    })
  }

  async deleteAccount(): Promise<{ message: string }> {
    try {
      return await this.request("/auth/account", { method: "DELETE" })
    } finally {
      tokenManager.clearTokens()
    }
  }

  // User profile endpoints
  async getProfile(): Promise<User> {
    return this.request<User>("/user/profile")
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async uploadUserAvatar(file: File): Promise<User> {
    return this.uploadFile<User>("/user/avatar", file)
  }

  async deleteUserAvatar(): Promise<User> {
    return this.request<User>("/user/avatar", { method: "DELETE" })
  }

  // Contact endpoints
  async getContacts(): Promise<Contact[]> {
    return this.request<Contact[]>("/contacts")
  }

  async getContact(id: string): Promise<Contact> {
    return this.request<Contact>(`/contacts/${id}`)
  }

  async createContact(data: Partial<Contact>): Promise<Contact> {
    return this.request<Contact>("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateContact(id: string, data: Partial<Contact>): Promise<Contact> {
    return this.request<Contact>(`/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteContact(id: string): Promise<{ message: string }> {
    return this.request(`/contacts/${id}`, { method: "DELETE" })
  }

  async uploadContactAvatar(contactId: string, file: File): Promise<Contact> {
    return this.uploadFile<Contact>(`/contacts/${contactId}/avatar`, file)
  }

  async deleteContactAvatar(contactId: string): Promise<Contact> {
    return this.request<Contact>(`/contacts/${contactId}/avatar`, {
      method: "DELETE",
    })
  }

  // Connection endpoints
  async addConnection(
    contactId: string,
    data: Partial<Connection>
  ): Promise<Connection> {
    return this.request<Connection>(`/contacts/${contactId}/connections`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateConnection(
    contactId: string,
    connectionId: string,
    data: Partial<Connection>
  ): Promise<Connection> {
    return this.request<Connection>(
      `/contacts/${contactId}/connections/${connectionId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    )
  }

  async deleteConnection(
    contactId: string,
    connectionId: string
  ): Promise<{ message: string }> {
    return this.request(`/contacts/${contactId}/connections/${connectionId}`, {
      method: "DELETE",
    })
  }

  // Helper to get full avatar URL
  getAvatarUrl(relativePath: string | null | undefined): string | null {
    if (!relativePath) return null
    // If using relative API_URL (proxy), return relative path
    // Otherwise, construct full URL
    if (API_URL.startsWith("/")) {
      return relativePath
    }
    // Remove /api from API_URL to get base server URL
    const baseUrl = API_URL.replace("/api", "")
    return `${baseUrl}${relativePath}`
  }

  // Namedays API
  async searchNamedays(
    name: string
  ): Promise<
    Record<string, Array<{ day?: string; month?: string; toEaster?: number }>>
  > {
    return this.request(`/namedays/search?name=${encodeURIComponent(name)}`)
  }

  async getAllNamedays(): Promise<
    Record<string, Array<{ day?: string; month?: string; toEaster?: number }>>
  > {
    return this.request("/namedays")
  }
}

export const api = new ApiClient()
