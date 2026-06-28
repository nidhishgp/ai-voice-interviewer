import { createClient } from "@supabase/supabase-js";
import type { Database } from "@aivi/types";

import { env } from "../env";

export function createSupabaseClient() {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}
