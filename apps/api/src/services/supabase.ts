import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json, SessionTemplate, CandidateSession, TranscriptEntry } from "@aivi/types";

export type TypedSupabaseClient = SupabaseClient<Database>;

export interface CreateTemplateInput {
  creator_id: string;
  title: string;
  description?: string;
  questions?: Json[];
}

export interface CreateSessionInput {
  template_id: string;
}

export type { SessionTemplate, CandidateSession, TranscriptEntry };

// Template service functions

export async function createTemplate(
  supabase: TypedSupabaseClient,
  input: CreateTemplateInput
): Promise<SessionTemplate> {
  const { data, error } = await supabase.from("session_templates").insert(input).select().single();

  if (error) throw new Error(error.message);
  return data as unknown as SessionTemplate;
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
  const { data, error } = await supabase
    .from("session_templates")
    .delete()
    .eq("id", id)
    .eq("creator_id", creatorId)
    .select("id");

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("Template not found or not owned by creator");
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
  templateId: string,
  status: CandidateSession["status"]
): Promise<void> {
  const completed_at = status === "completed" ? new Date().toISOString() : undefined;

  const { error } = await supabase
    .from("candidate_sessions")
    .update({ status, ...(completed_at !== undefined && { completed_at }) })
    .eq("id", id)
    .eq("template_id", templateId);

  if (error) throw new Error(error.message);
}

export async function updateSessionEvaluation(
  supabase: TypedSupabaseClient,
  id: string,
  templateId: string,
  evaluation: Json
): Promise<void> {
  const { error } = await supabase
    .from("candidate_sessions")
    .update({ evaluation })
    .eq("id", id)
    .eq("template_id", templateId);

  if (error) throw new Error(error.message);
}
