"use client";

import { readToken, supabaseConfig } from "./session";

/* Avatar images live in the public Supabase Storage bucket "avatars", one
   folder per account id. The bucket is created by migration 007; until that
   runs the upload control is disabled with an explanation rather than being
   shown as a button that silently does nothing. */

const BUCKET = "avatars";
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

let bucketReady: boolean | null = null;

export async function avatarStorageReady(): Promise<boolean> {
  if (bucketReady !== null) return bucketReady;
  const { url, key } = supabaseConfig();
  if (!url || !key) return (bucketReady = false);
  try {
    // object/list answers 200 with [] even for a bucket that does not exist,
    // so the bucket endpoint is the one that actually tells the truth.
    const probe = await fetch(`${url}/storage/v1/bucket/${BUCKET}`, { headers: { apikey: key } });
    bucketReady = probe.ok;
  } catch {
    bucketReady = false;
  }
  return bucketReady;
}

export type UploadResult = { ok: true; url: string } | { ok: false; error: "no-bucket" | "type" | "size" | "failed" };

export async function uploadAvatar(userId: string, file: File): Promise<UploadResult> {
  if (!ALLOWED.includes(file.type)) return { ok: false, error: "type" };
  if (file.size > MAX_BYTES) return { ok: false, error: "size" };
  const { url, key } = supabaseConfig();
  const token = readToken();
  if (!url || !key || !token) return { ok: false, error: "failed" };

  const extension = file.type.split("/")[1].replace("jpeg", "jpg");
  // A fresh name per upload keeps CDN caches from serving the previous image.
  const path = `${userId}/${Date.now()}.${extension}`;
  try {
    const response = await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${token}`,
        "content-type": file.type,
        "cache-control": "3600",
        "x-upsert": "true",
      },
      body: file,
    });
    if (response.status === 404) {
      bucketReady = false;
      return { ok: false, error: "no-bucket" };
    }
    if (!response.ok) return { ok: false, error: "failed" };
    return { ok: true, url: `${url}/storage/v1/object/public/${BUCKET}/${path}` };
  } catch {
    return { ok: false, error: "failed" };
  }
}
