import { describe, it, expect, beforeEach } from "vitest";

import { createSupabaseClient } from "../lib/supabase";

import {
  createTemplate,
  getTemplate,
  listTemplates,
  createCandidateSession,
  updateSessionTranscript,
} from "./supabase";

const supabase = createSupabaseClient();

const CREATOR_A = "00000000-0000-0000-0000-000000000001";
const CREATOR_B = "00000000-0000-0000-0000-000000000002";

async function cleanUp() {
  await supabase
    .from("candidate_sessions")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase
    .from("session_templates")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
}

describe("supabase service", () => {
  beforeEach(async () => {
    await cleanUp();
  });

  it("createTemplate() inserts row and returns parsed schema", async () => {
    const template = await createTemplate(supabase, {
      creator_id: CREATOR_A,
      title: "Test Interview",
      description: "A test template",
      questions: [{ id: 1, text: "Tell me about yourself." }],
    });

    expect(template.id).toBeDefined();
    expect(template.title).toBe("Test Interview");
    expect(template.creator_id).toBe(CREATOR_A);
    expect(template.is_active).toBe(true);
  });

  it("getTemplate() returns null for non-existent ID", async () => {
    const result = await getTemplate(supabase, "00000000-0000-0000-0000-999999999999");
    expect(result).toBeNull();
  });

  it("listTemplates() only returns templates for the given creatorId", async () => {
    await createTemplate(supabase, { creator_id: CREATOR_A, title: "Template A" });
    await createTemplate(supabase, { creator_id: CREATOR_B, title: "Template B" });

    const results = await listTemplates(supabase, CREATOR_A);
    expect(results.every((t) => t.creator_id === CREATOR_A)).toBe(true);
    expect(results.some((t) => t.creator_id === CREATOR_B)).toBe(false);
  });

  it("createCandidateSession() inserts with status pending", async () => {
    const template = await createTemplate(supabase, {
      creator_id: CREATOR_A,
      title: "Session Template",
    });

    const session = await createCandidateSession(supabase, {
      template_id: template.id,
    });

    expect(session.status).toBe("pending");
    expect(session.transcript).toEqual([]);
    expect(session.share_token).toBeDefined();
  });

  it("updateSessionTranscript() appends entries to JSONB array", async () => {
    const template = await createTemplate(supabase, {
      creator_id: CREATOR_A,
      title: "Transcript Test",
    });
    const session = await createCandidateSession(supabase, { template_id: template.id });

    await updateSessionTranscript(supabase, session.id, {
      role: "ai",
      text: "Tell me about yourself.",
      timestamp: new Date().toISOString(),
    });

    const { data } = await supabase
      .from("candidate_sessions")
      .select("transcript")
      .eq("id", session.id)
      .single();

    expect(Array.isArray(data?.transcript)).toBe(true);
    expect((data?.transcript as unknown[]).length).toBe(1);
  });
});
