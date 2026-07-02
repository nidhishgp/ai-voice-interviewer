import type { createSupabaseClient } from "../lib/supabase";

type SupabaseClient = ReturnType<typeof createSupabaseClient>;

export async function seedTemplate(supabase: SupabaseClient, creatorId: string) {
  const { data, error } = await supabase
    .from("session_templates")
    .insert({
      creator_id: creatorId,
      title: "Test Interview",
      questions: [{ id: 1, text: "Tell me about yourself." }],
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function seedSession(supabase: SupabaseClient, templateId: string) {
  const { data, error } = await supabase
    .from("candidate_sessions")
    .insert({ template_id: templateId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
