import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export type SubscriptionTokenPurpose = "verify" | "unsubscribe";

type SubscriptionTokenPayload = {
  subscriberId: number;
  purpose: SubscriptionTokenPurpose;
  expiresAt: number;
};
// this file creates the tokens for the subscriptions;
function getSecret(): string {
  const secret = process.env.SUBSCRIPTION_TOKEN_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "SUBSCRIPTION_TOKEN_SECRET ən azı 32 simvoldan ibarət olmalıdır"
    );
  }

  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createSubscriptionToken(
  subscriberId: number,
  purpose: SubscriptionTokenPurpose,
  expiresInSeconds: number
): string {
  const payload: SubscriptionTokenPayload = {
    subscriberId,
    purpose,
    expiresAt: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifySubscriptionToken(
  token: string,
  expectedPurpose: SubscriptionTokenPurpose
): SubscriptionTokenPayload {
  const [encodedPayload, suppliedSignature, ...extraParts] = token.split(".");

  if (!encodedPayload || !suppliedSignature || extraParts.length > 0) {
    throw new Error("Token yanlışdır");
  }

  const expectedSignature = sign(encodedPayload);
  const suppliedBuffer = Buffer.from(suppliedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    throw new Error("Token imzası yanlışdır");
  }

  let payload: SubscriptionTokenPayload;

  try {
    payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    );
  } catch {
    throw new Error("Token məlumatı yanlışdır");
  }

  if (
    !Number.isInteger(payload.subscriberId) ||
    payload.subscriberId <= 0 ||
    payload.purpose !== expectedPurpose ||
    !Number.isFinite(payload.expiresAt)
  ) {
    throw new Error("Token məlumatı yanlışdır");
  }

  if (payload.expiresAt < Math.floor(Date.now() / 1000)) {
    throw new Error("Tokenin vaxtı bitib");
  }

  return payload;
}
