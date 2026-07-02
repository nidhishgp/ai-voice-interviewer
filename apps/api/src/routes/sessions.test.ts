import { describe, it, expect, beforeEach, vi } from "vitest";
import type { FastifyRequest } from "fastify";

const CREATOR_ID = "00000000-0000-0000-0000-000000000020";

vi.mock("../middleware/auth", () => ({
  authMiddleware: async (request: FastifyRequest) => {
    request.user = { id: CREATOR_ID, email: "test@example.com" };
  },
}));

import { createApp } from "../server";
import { createSupabaseClient } from "../lib/supabase";

async function cleanUp() {
  const supabase = createSupabaseClient();
  await supabase.from("session_templates").delete().eq("creator_id", CREATOR_ID);
  await supabase
    .from("session_templates")
    .delete()
    .eq("creator_id", "00000000-0000-0000-0000-000000000021");
}

describe("GET /sessions/:id", () => {
  beforeEach(cleanUp);

  it("returns 404 for creator who does not own the session", async () => {
    const supabase = createSupabaseClient();

    const { data: otherTemplate } = await supabase
      .from("session_templates")
      .insert({
        creator_id: "00000000-0000-0000-0000-000000000021",
        title: "Other Interview",
        questions: [{ id: 1, text: "Question?" }],
      })
      .select()
      .single();

    const { data: otherSession } = await supabase
      .from("candidate_sessions")
      .insert({ template_id: otherTemplate!.id })
      .select()
      .single();

    const app = await createApp();
    const res = await app.inject({
      method: "GET",
      url: `/sessions/${otherSession!.id}`,
      headers: { Authorization: "Bearer test-token" },
    });

    expect(res.statusCode).toBe(404);
    await app.close();
  });
});
