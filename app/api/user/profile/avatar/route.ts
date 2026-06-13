import { auth } from "@/auth";
import { AVATAR_ALLOWED_MIME, AVATAR_MAX_BYTES } from "@/lib/avatar-upload";
import { getUsersCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const AVATAR_DIR = path.join(process.cwd(), "public", "uploads", "avatars");

async function removeUserAvatars(userId: string) {
  const files = await readdir(AVATAR_DIR).catch(() => [] as string[]);
  await Promise.all(
    files
      .filter((file) => file.startsWith(`${userId}.`))
      .map((file) => unlink(path.join(AVATAR_DIR, file)).catch(() => undefined)),
  );
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("avatar");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Avatar file is required" }, { status: 400 });
  }

  if (!AVATAR_ALLOWED_MIME[file.type]) {
    return NextResponse.json(
      { error: "JPEG / PNG / WebP / GIF のみアップロードできます" },
      { status: 400 },
    );
  }

  if (file.size > AVATAR_MAX_BYTES) {
    return NextResponse.json({ error: "画像は2MB以下にしてください" }, { status: 400 });
  }

  const userId = session.user.id;
  const ext = AVATAR_ALLOWED_MIME[file.type];
  const buffer = Buffer.from(await file.arrayBuffer());

  await mkdir(AVATAR_DIR, { recursive: true });
  await removeUserAvatars(userId);

  const filename = `${userId}.${ext}`;
  await writeFile(path.join(AVATAR_DIR, filename), buffer);

  const imagePath = `/uploads/avatars/${filename}`;
  const now = new Date();

  const users = await getUsersCollection();
  await users.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { image: imagePath, updatedAt: now } },
  );

  return NextResponse.json({
    image: `${imagePath}?v=${now.getTime()}`,
  });
}
