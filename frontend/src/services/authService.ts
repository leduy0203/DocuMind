import { apiClient } from "@/lib/api";

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterSuccessResponse {
  message: string;
  email: string;
}

const TOKEN_KEY = "documind_token";
const USER_KEY = "documind_user";

export const authService = {
  /**
   * Register a new account
   */
  async register(payload: RegisterPayload): Promise<RegisterSuccessResponse> {
    return apiClient<RegisterSuccessResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        full_name: payload.fullName,
      }),
    });
  },

  /**
   * Sign in and save credentials to localStorage
   */
  async login(payload: LoginPayload): Promise<TokenResponse> {
    const data = await apiClient<TokenResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    return data;
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(): Promise<User> {
    return apiClient<User>("/api/v1/auth/me", {
      method: "GET",
    });
  },

  /**
   * Log out user and clear storage
   */
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = "/login";
    }
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get cached user object from localStorage
   */
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
};
