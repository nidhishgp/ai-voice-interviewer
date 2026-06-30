import { describe, it, expect, beforeEach, vi } from "vitest";

const mockGetUser = vi.hoisted(() => vi.fn());

vi.mock("../lib/supabase", () => ({
  createSupabaseClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}));

import { createApp } from "../server";

describe("auth middleware", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when no Authorization header", async () => {
    const app = await createApp();
    const res = await app.inject({ method: "GET", url: "/templates" });
    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns 401 on invalid JWT", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: "invalid" } });
    const app = await createApp();
    const res = await app.inject({
      method: "GET",
      url: "/templates",
      headers: { Authorization: "Bearer bad-token" },
    });
    expect(res.statusCode).toBe(401);
    await app.close();
  });
});
