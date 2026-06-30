import { describe, it, expect, beforeEach, vi } from "vitest";
import type { FastifyRequest } from "fastify";

const CREATOR_ID = "00000000-0000-0000-0000-000000000010";
const OTHER_CREATOR_ID = "00000000-0000-0000-0000-000000000011";

vi.mock("../middleware/auth", () => ({
  authMiddleware: async (request: FastifyRequest) => {
    request.user = { id: CREATOR_ID, email: "test@example.com" };
  },
}));

import { createApp } from "../server";
import { createSupabaseClient } from "../lib/supabase";

async function cleanUp() {
  const supabase = createSupabaseClient();
  await supabase
    .from("session_templates")
    .delete()
    .in("creator_id", [CREATOR_ID, OTHER_CREATOR_ID]);
}

describe("GET /templates", () => {
  beforeEach(cleanUp);

  it("returns empty array for new creator", async () => {
    const app = await createApp();
    const res = await app.inject({
      method: "GET",
      url: "/templates",
      headers: { Authorization: "Bearer test-token" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data).toEqual([]);
    await app.close();
  });
});

describe("POST /templates", () => {
  beforeEach(cleanUp);

  it("creates and returns new template", async () => {
    const app = await createApp();
    const res = await app.inject({
      method: "POST",
      url: "/templates",
      headers: { Authorization: "Bearer test-token", "content-type": "application/json" },
      body: JSON.stringify({
        title: "Frontend Interview",
        questions: [{ id: 1, text: "Tell me about yourself." }],
      }),
    });
    expect(res.statusCode).toBe(201);
    const { data } = res.json();
    expect(data.title).toBe("Frontend Interview");
    expect(data.creator_id).toBe(CREATOR_ID);
    await app.close();
  });
});

describe("GET /templates/:id", () => {
  beforeEach(cleanUp);

  it("returns 404 for unknown id", async () => {
    const app = await createApp();
    const res = await app.inject({
      method: "GET",
      url: "/templates/00000000-0000-4000-8000-000000000099",
      headers: { Authorization: "Bearer test-token" },
    });
    expect(res.statusCode).toBe(404);
    await app.close();
  });

  it("returns 404 when template belongs to different creator", async () => {
    const supabase = createSupabaseClient();
    const { data: template } = await supabase
      .from("session_templates")
      .insert({ creator_id: OTHER_CREATOR_ID, title: "Other Template" })
      .select()
      .single();

    const app = await createApp();
    const res = await app.inject({
      method: "GET",
      url: `/templates/${template!.id}`,
      headers: { Authorization: "Bearer test-token" },
    });
    expect(res.statusCode).toBe(404);
    await app.close();
  });
});

describe("PATCH /templates/:id", () => {
  beforeEach(cleanUp);

  it("updates and returns updated template", async () => {
    const supabase = createSupabaseClient();
    const { data: template } = await supabase
      .from("session_templates")
      .insert({ creator_id: CREATOR_ID, title: "Original Title" })
      .select()
      .single();

    const app = await createApp();
    const res = await app.inject({
      method: "PATCH",
      url: `/templates/${template!.id}`,
      headers: { Authorization: "Bearer test-token", "content-type": "application/json" },
      body: JSON.stringify({ title: "Updated Title" }),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.title).toBe("Updated Title");
    await app.close();
  });
});

describe("DELETE /templates/:id", () => {
  beforeEach(cleanUp);

  it("returns 204", async () => {
    const supabase = createSupabaseClient();
    const { data: template } = await supabase
      .from("session_templates")
      .insert({ creator_id: CREATOR_ID, title: "To Delete" })
      .select()
      .single();

    const app = await createApp();
    const res = await app.inject({
      method: "DELETE",
      url: `/templates/${template!.id}`,
      headers: { Authorization: "Bearer test-token" },
    });
    expect(res.statusCode).toBe(204);
    await app.close();
  });
});
