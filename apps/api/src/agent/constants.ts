import { FOLLOW_UP_DEPTH } from "@aivi/types";
import type { SessionTemplate } from "@aivi/types";

export const FOLLOW_UP_DEPTH_LIMIT: Record<SessionTemplate["follow_up_depth"], number> = {
  [FOLLOW_UP_DEPTH.NONE]: 0,
  [FOLLOW_UP_DEPTH.LIGHT]: 1,
  [FOLLOW_UP_DEPTH.DEEP]: 3,
};

export const FOLLOW_UP_DEPTH_VALUES = [
  FOLLOW_UP_DEPTH.NONE,
  FOLLOW_UP_DEPTH.LIGHT,
  FOLLOW_UP_DEPTH.DEEP,
] as const;
