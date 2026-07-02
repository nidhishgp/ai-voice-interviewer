import { describe, it, expect, beforeEach, vi } from "vitest";

const CREATOR_ID = "00000000-0000-0000-0000-000000000022";

vi.mock("../middleware/auth", () => ({
  authMiddleware: async () => {},
}));

import { createApp } from "../server";
import { createSupabaseClient } from "../lib/supabase";
import { seedTemplate, seedSession } from "../test/helpers";

async function cleanUp() {
  const supabase = createSupabaseClient();
  await supabase.from("session_templates").delete().eq("creator_id", CREATOR_ID);
}

describe("GET /join/:shareToken", () => {
  beforeEach(cleanUp);

  it("returns template title and candidate_instructions, no questions field", async () => {
    const supabase = createSupabaseClient();
    const template = await seedTemplate(supabase, CREATOR_ID);
    await seedSession(supabase, template.id);

    const { data: row } = await supabase
      .from("candidate_sessions")
      .select("share_token")
      .eq("template_id", template.id)
      .single();

    const app = await createApp();
    const res = await app.inject({
      method: "GET",
      url: `/join/${row!.share_token}`,
    });

    expect(res.statusCode).toBe(200);
    const { data } = res.json();
    expect(data.title).toBe("Test Interview");
    expect(data).not.toHaveProperty("questions");
    expect(data).not.toHaveProperty("system_prompt");
    await app.close();
  });

  it("returns 404 for unknown token", async () => {
    const app = await createApp();
    const res = await app.inject({
      method: "GET",
      url: "/join/00000000-0000-0000-0000-000000000000",
    });
    expect(res.statusCode).toBe(404);
    await app.close();
  });
});

describe("POST /join/:shareToken/start", () => {
  beforeEach(cleanUp);

  it("returns sessionId and roomName", async () => {
    const supabase = createSupabaseClient();
    const template = await seedTemplate(supabase, CREATOR_ID);
    await seedSession(supabase, template.id);

    const { data: row } = await supabase
      .from("candidate_sessions")
      .select("share_token")
      .eq("template_id", template.id)
      .single();

    const app = await createApp();
    const res = await app.inject({
      method: "POST",
      url: `/join/${row!.share_token}/start`,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ candidateName: "Alice", candidateEmail: "alice@example.com" }),
    });

    expect(res.statusCode).toBe(201);
    const { data } = res.json();
    expect(data.sessionId).toBeDefined();
    expect(data.roomName).toMatch(/^interview-/);
    await app.close();
  });

  it("returns 400 for invalid email", async () => {
    const supabase = createSupabaseClient();
    const template = await seedTemplate(supabase, CREATOR_ID);
    await seedSession(supabase, template.id);

    const { data: row } = await supabase
      .from("candidate_sessions")
      .select("share_token")
      .eq("template_id", template.id)
      .single();

    const app = await createApp();
    const res = await app.inject({
      method: "POST",
      url: `/join/${row!.share_token}/start`,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ candidateName: "Alice", candidateEmail: "not-an-email" }),
    });

    expect(res.statusCode).toBe(400);
    await app.close();
  });
});
