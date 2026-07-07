import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import type { Room } from "livekit-server-sdk";

import { env } from "../env";

const TOKEN_TTL_SECONDS = 60 * 60 * 2;
const ROOM_EMPTY_TIMEOUT_SECONDS = 60 * 5;
const ROOM_DEPARTURE_TIMEOUT_SECONDS = 60;
const MAX_PARTICIPANTS = 2;

function toHttpUrl(livekitUrl: string): string {
  return livekitUrl.replace(/^ws/, "http");
}

function getRoomServiceClient(): RoomServiceClient {
  return new RoomServiceClient(
    toHttpUrl(env.LIVEKIT_URL),
    env.LIVEKIT_API_KEY,
    env.LIVEKIT_API_SECRET
  );
}

async function buildToken(
  identity: string,
  roomName: string,
  canPublishData: boolean
): Promise<string> {
  const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity,
    ttl: TOKEN_TTL_SECONDS,
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData,
  });

  return at.toJwt();
}

export async function generateCandidateToken(
  roomName: string,
  candidateName: string
): Promise<string> {
  if (candidateName.trim().toLowerCase() === "agent") {
    throw new Error("RESERVED_IDENTITY");
  }
  return buildToken(candidateName, roomName, false);
}

export async function generateAgentToken(roomName: string): Promise<string> {
  return buildToken("agent", roomName, true);
}

export async function createRoom(roomName: string): Promise<Room> {
  const svc = getRoomServiceClient();

  try {
    return await svc.createRoom({
      name: roomName,
      emptyTimeout: ROOM_EMPTY_TIMEOUT_SECONDS,
      departureTimeout: ROOM_DEPARTURE_TIMEOUT_SECONDS,
      maxParticipants: MAX_PARTICIPANTS,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new Error(`LIVEKIT_CREATE_ROOM_FAILED: ${message}`);
  }
}
