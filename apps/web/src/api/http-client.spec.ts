// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

import { apiClient } from "./http-client";

describe("apiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        href: "http://localhost:3000/",
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should attach Authorization Bearer header if token exists in localStorage", async () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockReturnValue("test-jwt-token");

    const requestInterceptor =
      apiClient.interceptors.request.handlers?.[0]?.fulfilled;
    const config = {
      headers: new AxiosHeaders(),
    } as InternalAxiosRequestConfig;

    const result = await requestInterceptor?.(config);

    expect(getItemSpy).toHaveBeenCalledWith("token");
    expect(result?.headers.Authorization).toBe("Bearer test-jwt-token");
  });

  it("should handle 401 Unauthorized response by clearing localStorage token and redirecting", async () => {
    const removeItemSpy = vi
      .spyOn(Storage.prototype, "removeItem")
      .mockImplementation(() => {});

    const responseInterceptor =
      apiClient.interceptors.response.handlers?.[0]?.rejected;
    const error = {
      response: {
        status: 401,
      },
    };

    await expect(responseInterceptor?.(error)).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(removeItemSpy).toHaveBeenCalledWith("token");
    expect(window.location.href).toBe("/login");
  });
});
