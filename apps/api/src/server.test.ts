import { describe, it, expect } from "vitest";

import { createApp } from "./server";

describe("createApp", () => {
  it("registers without throwing", async () => {
    const app = await createApp();
    await app.close();
  });

  it("GET /health returns 200 with status: ok", async () => {
    const app = await createApp();

    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });

    await app.close();
  });
});
