import "@testing-library/jest-dom";
import { authApi } from "../infrastructure/api/auth-api.client";

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe("authApi", () => {
  describe("logout", () => {
    it("sends POST request", async () => {
      mockFetch.mockResolvedValue({ ok: true });

      await authApi.logout();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/logout"),
        expect.objectContaining({ method: "POST", credentials: "include" })
      );
    });
  });

  describe("getProfile", () => {
    it("returns user data on success", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: "1",
          email: "test@example.com",
          name: "Test",
          plan: "free",
          analysesUsed: 0,
          analysesLimit: 3,
          scenesLimit: 10,
          createdAt: "2026-01-01T00:00:00Z",
        }),
      });

      const result = await authApi.getProfile();
      expect(result?.email).toBe("test@example.com");
    });

    it("returns null on non-ok response", async () => {
      mockFetch.mockResolvedValue({ ok: false });

      const result = await authApi.getProfile();
      expect(result).toBeNull();
    });
  });

  describe("updateProfile", () => {
    it("sends PATCH request with data", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: "1",
          email: "updated@example.com",
          name: "Updated",
          plan: "free",
          analysesUsed: 0,
          analysesLimit: 3,
          scenesLimit: 10,
          createdAt: "2026-01-01T00:00:00Z",
        }),
      });

      const result = await authApi.updateProfile({ name: "Updated" });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/me"),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ name: "Updated" }),
        })
      );
      expect(result.name).toBe("Updated");
    });
  });
});
