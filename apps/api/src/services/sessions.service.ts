import type { SessionTemplate, CandidateSession, TranscriptEntry, Json } from "@aivi/types";

import type { TypedSupabaseClient } from "../lib/supabase";

export interface JoinMetadata {
  id: string;
  title: string;
  candidate_instructions: string | null;
}

export interface StartSessionInput {
  candidateName: string;
  candidateEmail: string;
}

export interface StartSessionResult {
  sessionId: string;
  roomName: string;
}

export async function getJoinMetadata(
  supabase: TypedSupabaseClient,
  shareToken: string
): Promise<JoinMetadata | null> {
  const { data, error } = await supabase
    .from("candidate_sessions")
    .select("template_id, session_templates(id, title, candidate_instructions)")
    .eq("share_token", shareToken)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) throw new Error(error.message);
  if (!data.session_templates) return null;

  const t = data.session_templates as unknown as Pick<
    SessionTemplate,
    "id" | "title" | "candidate_instructions"
  >;
  return { id: t.id, title: t.title, candidate_instructions: t.candidate_instructions };
}

export async function startSession(
  supabase: TypedSupabaseClient,
  shareToken: string,
  input: StartSessionInput
): Promise<StartSessionResult> {
  const { data: sessionRow, error: sessionError } = await supabase
    .from("candidate_sessions")
    .select("id, status")
    .eq("share_token", shareToken)
    .single();

  if (sessionError?.code === "PGRST116") throw new Error("SESSION_NOT_FOUND");
  if (sessionError) throw new Error(sessionError.message);
  if (sessionRow.status !== "pending") throw new Error("SESSION_ALREADY_STARTED");

  const { data: updated, error: updateError } = await supabase
    .from("candidate_sessions")
    .update({
      candidate_name: input.candidateName,
      candidate_email: input.candidateEmail,
      status: "in_progress",
      started_at: new Date().toISOString(),
    })
    .eq("share_token", shareToken)
    .select("id")
    .single();

  if (updateError) throw new Error(updateError.message);

  const sessionId = updated.id;
  const roomName = `interview-${sessionId}`;

  return { sessionId, roomName };
}

export async function getSession(
  supabase: TypedSupabaseClient,
  sessionId: string,
  creatorId: string
): Promise<CandidateSession | null> {
  const { data, error } = await supabase
    .from("candidate_sessions")
    .select("*, session_templates!inner(creator_id)")
    .eq("id", sessionId)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) throw new Error(error.message);

  const template = data.session_templates as unknown as { creator_id: string };
  if (template.creator_id !== creatorId) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { session_templates: _templates, ...session } = data;
  return session as unknown as CandidateSession;
}

export async function completeSession(
  supabase: TypedSupabaseClient,
  sessionId: string
): Promise<void> {
  const { error } = await supabase
    .from("candidate_sessions")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) throw new Error(error.message);
}

export async function appendTranscript(
  supabase: TypedSupabaseClient,
  sessionId: string,
  entries: TranscriptEntry[]
): Promise<void> {
  for (const entry of entries) {
    const { error } = await supabase.rpc("append_transcript_entry", {
      session_id: sessionId,
      entry: entry as unknown as Json,
    });

    if (error) throw new Error(error.message);
  }
}
