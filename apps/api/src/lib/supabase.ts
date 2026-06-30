import { createClient } from "@supabase/supabase-js";
import type { Database } from "@aivi/types";
import type { SupabaseClient } from "@supabase/supabase-js";

import { env } from "../env";

export type TypedSupabaseClient = SupabaseClient<Database>;

export function createSupabaseClient(): TypedSupabaseClient {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}
