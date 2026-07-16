import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/application/hooks/use-auth";
import React from "react";

// useAuth requires AuthProvider context. We can't use it standalone.
// This test validates the hook module exports correctly.

describe("useAuth", () => {
  it("exports useAuth function", () => {
    expect(typeof useAuth).toBe("function");
  });

  it("throws when used outside AuthProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => {
      try {
        return useAuth();
      } catch (e) {
        return e;
      }
    });
    expect(result.current).toBeInstanceOf(Error);
    spy.mockRestore();
  });
});
