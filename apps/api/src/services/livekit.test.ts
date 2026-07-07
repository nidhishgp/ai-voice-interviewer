import { describe, it, expect } from "vitest";
import { TokenVerifier } from "livekit-server-sdk";

import { env } from "../env";

import { generateCandidateToken, generateAgentToken } from "./livekit";

const verifier = new TokenVerifier(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET);

describe("livekit token generation", () => {
  it("generateCandidateToken returns a JWT string", async () => {
    const jwt = await generateCandidateToken("room-1", "Alice");
    expect(typeof jwt).toBe("string");
    expect(jwt.split(".")).toHaveLength(3);
  });

  it("generateCandidateToken encodes correct room name in token grants", async () => {
    const jwt = await generateCandidateToken("room-123", "Alice");
    const claims = await verifier.verify(jwt);

    expect(claims.video?.room).toBe("room-123");
    expect(claims.video?.canPublishData).toBe(false);
  });

  it("generateAgentToken encodes correct room name", async () => {
    const jwt = await generateAgentToken("room-456");
    const claims = await verifier.verify(jwt);

    expect(claims.video?.room).toBe("room-456");
  });

  it("token can be decoded and identity field matches candidateName", async () => {
    const jwt = await generateCandidateToken("room-789", "Bob");
    const claims = await verifier.verify(jwt);

    expect(claims.sub).toBe("Bob");
  });
});
