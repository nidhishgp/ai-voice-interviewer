import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@aivi/types";

export type TypedSupabaseClient = SupabaseClient<Database>;

// Template types

export interface SessionTemplate {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  questions: Json[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateInput {
  creator_id: string;
  title: string;
  description?: string;
  questions?: Json[];
}

// Session types
export interface CandidateSession {
  id: string;
  template_id: string;
  share_token: string;
  candidate_name: string | null;
  candidate_email: string | null;
  status: "pending" | "in_progress" | "completed" | "evaluated" | "expired";
  transcript: TranscriptEntry[];
  evaluation: Json | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TranscriptEntry {
  role: "ai" | "candidate";
  text: string;
  timestamp: string;
}

export interface CreateSessionInput {
  template_id: string;
}

// Template service functions

export async function createTemplate(
  supabase: TypedSupabaseClient,
  input: CreateTemplateInput
): Promise<SessionTemplate> {
  const { data, error } = await supabase.from("session_templates").insert(input).select().single();

  if (error) throw new Error(error.message);
  return data as SessionTemplate;
}

export async function getTemplate(
  supabase: TypedSupabaseClient,
  id: string
): Promise<SessionTemplate | null> {
  const { data, error } = await supabase
    .from("session_templates")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code === "PGRST116") return null;
  if (error) throw new Error(error.message);
  return data as unknown as SessionTemplate;
}

export async function listTemplates(
  supabase: TypedSupabaseClient,
  creatorId: string
): Promise<SessionTemplate[]> {
  const { data, error } = await supabase
    .from("session_templates")
    .select("*")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as SessionTemplate[];
}

export async function updateTemplate(
  supabase: TypedSupabaseClient,
  id: string,
  creatorId: string,
  input: Partial<CreateTemplateInput>
): Promise<SessionTemplate> {
  const { data, error } = await supabase
    .from("session_templates")
    .update(input)
    .eq("id", id)
    .eq("creator_id", creatorId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as SessionTemplate;
}

export async function deleteTemplate(
  supabase: TypedSupabaseClient,
  id: string,
  creatorId: string
): Promise<void> {
  const { error } = await supabase
    .from("session_templates")
    .delete()
    .eq("id", id)
    .eq("creator_id", creatorId);

  if (error) throw new Error(error.message);
}

// Session service functions

export async function createCandidateSession(
  supabase: TypedSupabaseClient,
  input: CreateSessionInput
): Promise<CandidateSession> {
  const { data, error } = await supabase.from("candidate_sessions").insert(input).select().single();

  if (error) throw new Error(error.message);
  return data as unknown as CandidateSession;
}

export async function getSessionByShareToken(
  supabase: TypedSupabaseClient,
  shareToken: string
): Promise<CandidateSession | null> {
  const { data, error } = await supabase
    .from("candidate_sessions")
    .select("*")
    .eq("share_token", shareToken)
    .single();

  if (error && error.code === "PGRST116") return null;
  if (error) throw new Error(error.message);
  return data as unknown as CandidateSession;
}

export async function updateSessionTranscript(
  supabase: TypedSupabaseClient,
  id: string,
  entry: TranscriptEntry
): Promise<void> {
  const { error } = await supabase.rpc("append_transcript_entry", {
    session_id: id,
    entry: entry as unknown as Json,
  });

  if (error) throw new Error(error.message);
}

export async function updateSessionStatus(
  supabase: TypedSupabaseClient,
  id: string,
  status: CandidateSession["status"]
): Promise<void> {
  const { error } = await supabase.from("candidate_sessions").update({ status }).eq("id", id);

  if (error) throw new Error(error.message);
}

export async function updateSessionEvaluation(
  supabase: TypedSupabaseClient,
  id: string,
  evaluation: Json
): Promise<void> {
  const { error } = await supabase
    .from("candidate_sessions")
    .update({ evaluation, completed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
