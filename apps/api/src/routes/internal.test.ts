import { randomUUID } from "node:crypto";

import { describe, it, expect, beforeEach, vi } from "vitest";

import { env } from "../env";
import { createApp } from "../server";
import { createSupabaseClient } from "../lib/supabase";
import { seedTemplate, seedSession } from "../test/helpers";

const INTERNAL_SECRET = env.INTERNAL_SECRET;
const CREATOR_ID = "00000000-0000-0000-0000-000000000023";
const NON_EXISTENT_SESSION_ID = randomUUID();

vi.mock("../middleware/auth", () => ({
  authMiddleware: async () => {},
}));

async function cleanUp() {
  const supabase = createSupabaseClient();
  await supabase.from("session_templates").delete().eq("creator_id", CREATOR_ID);
}

describe("internal preHandler", () => {
  it("returns 401 when x-internal-secret header is missing", async () => {
    const app = await createApp();
    const res = await app.inject({
      method: "POST",
      url: `/internal/sessions/${NON_EXISTENT_SESSION_ID}/complete`,
    });
    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns 401 when x-internal-secret header is wrong", async () => {
    const app = await createApp();
    const res = await app.inject({
      method: "POST",
      url: `/internal/sessions/${NON_EXISTENT_SESSION_ID}/complete`,
      headers: { "x-internal-secret": "wrong-secret" },
    });
    expect(res.statusCode).toBe(401);
    await app.close();
  });
});

describe("POST /internal/sessions/:id/complete", () => {
  beforeEach(cleanUp);

  it("updates session status to completed", async () => {
    const supabase = createSupabaseClient();
    const template = await seedTemplate(supabase, CREATOR_ID);
    const session = await seedSession(supabase, template.id);

    const app = await createApp();
    const res = await app.inject({
      method: "POST",
      url: `/internal/sessions/${session.id}/complete`,
      headers: { "x-internal-secret": INTERNAL_SECRET },
    });

    expect(res.statusCode).toBe(204);

    const { data } = await supabase
      .from("candidate_sessions")
      .select("status, completed_at")
      .eq("id", session.id)
      .single();

    expect(data!.status).toBe("completed");
    expect(data!.completed_at).not.toBeNull();
    await app.close();
  });
});

describe("POST /internal/sessions/:id/transcript", () => {
  beforeEach(cleanUp);

  it("appends transcript entries", async () => {
    const supabase = createSupabaseClient();
    const template = await seedTemplate(supabase, CREATOR_ID);
    const session = await seedSession(supabase, template.id);

    const app = await createApp();
    const res = await app.inject({
      method: "POST",
      url: `/internal/sessions/${session.id}/transcript`,
      headers: {
        "x-internal-secret": INTERNAL_SECRET,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        entries: [
          { role: "ai", text: "Tell me about yourself.", timestamp: new Date().toISOString() },
          {
            role: "candidate",
            text: "I am a software engineer.",
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    expect(res.statusCode).toBe(204);

    const { data } = await supabase
      .from("candidate_sessions")
      .select("transcript")
      .eq("id", session.id)
      .single();

    expect((data!.transcript as unknown[]).length).toBe(2);
    await app.close();
  });
});
