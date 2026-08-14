import { ApiError } from "./supabase";

export async function readJsonObject(request: Request, maxBytes = 64_000): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new ApiError(415, "Content-Type must be application/json.", "INVALID_CONTENT_TYPE");
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > maxBytes) {
    throw new ApiError(413, "Request body is too large.", "PAYLOAD_TOO_LARGE");
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    throw new ApiError(413, "Request body is too large.", "PAYLOAD_TOO_LARGE");
  }

  try {
    const value = JSON.parse(text) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("not an object");
    return value as Record<string, unknown>;
  } catch {
    throw new ApiError(400, "Request body must be a JSON object.", "INVALID_JSON");
  }
}

export function requiredString(value: unknown, field: string, maxLength: number) {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(400, `${field} is required.`, "INVALID_INPUT");
  }
  if (value.length > maxLength) {
    throw new ApiError(400, `${field} is too long.`, "INVALID_INPUT");
  }
  return value;
}

export function optionalUuid(value: unknown, field: string) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new ApiError(400, `${field} must be a UUID.`, "INVALID_INPUT");
  }
  return value;
}
