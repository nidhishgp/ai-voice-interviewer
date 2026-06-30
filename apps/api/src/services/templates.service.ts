import type { SessionTemplate, CandidateSession, Question, Json } from "@aivi/types";

import type { TypedSupabaseClient } from "../lib/supabase";

export interface CreateTemplateInput {
  title: string;
  description?: string | null | undefined;
  questions?: Question[] | undefined;
  creator_id: string;
}

export interface UpdateTemplateInput {
  title?: string | undefined;
  description?: string | null | undefined;
  questions?: Question[] | undefined;
  is_active?: boolean | undefined;
}

type UpdatePayload = {
  title?: string;
  description?: string | null;
  questions?: Json;
  is_active?: boolean;
};

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
  return (data ?? []) as unknown as SessionTemplate[];
}

export async function createTemplate(
  supabase: TypedSupabaseClient,
  data: CreateTemplateInput
): Promise<SessionTemplate> {
  const { data: row, error } = await supabase
    .from("session_templates")
    .insert({
      creator_id: data.creator_id,
      title: data.title,
      description: data.description ?? null,
      questions: data.questions as unknown as Json,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return row as unknown as SessionTemplate;
}

export async function getTemplate(
  supabase: TypedSupabaseClient,
  id: string,
  creatorId: string
): Promise<SessionTemplate | null> {
  const { data, error } = await supabase
    .from("session_templates")
    .select("*")
    .eq("id", id)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) throw new Error(error.message);
  if (data.creator_id !== creatorId) return null;
  return data as unknown as SessionTemplate;
}

export async function updateTemplate(
  supabase: TypedSupabaseClient,
  id: string,
  data: UpdateTemplateInput,
  creatorId: string
): Promise<SessionTemplate | null> {
  const payload: UpdatePayload = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.questions !== undefined && { questions: data.questions as unknown as Json }),
    ...(data.is_active !== undefined && { is_active: data.is_active }),
  };

  const { data: row, error } = await supabase
    .from("session_templates")
    .update(payload)
    .eq("id", id)
    .eq("creator_id", creatorId)
    .select()
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) throw new Error(error.message);
  return row as unknown as SessionTemplate;
}

export async function deleteTemplate(
  supabase: TypedSupabaseClient,
  id: string,
  creatorId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("session_templates")
    .delete()
    .eq("id", id)
    .eq("creator_id", creatorId)
    .select("id");

  if (error) throw new Error(error.message);
  return data !== null && data.length > 0;
}

export async function listSessionsForTemplate(
  supabase: TypedSupabaseClient,
  id: string,
  creatorId: string
): Promise<CandidateSession[] | null> {
  const template = await getTemplate(supabase, id, creatorId);
  if (!template) return null;

  const { data, error } = await supabase
    .from("candidate_sessions")
    .select("*")
    .eq("template_id", id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as CandidateSession[];
}
