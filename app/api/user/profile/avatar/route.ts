import { auth } from "@/auth";
import {
  AVATAR_ALLOWED_MIME,
  AVATAR_MAX_BYTES,
  buildAvatarImageUrl,
} from "@/lib/avatar-upload";
import { getUsersCollection } from "@/lib/mongodb";
import { Binary, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function toBuffer(data: Binary | Buffer): Buffer {
  if (Buffer.isBuffer(data)) {
    return data;
  }
  return Buffer.from(data.buffer);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await getUsersCollection();
  const user = await users.findOne({
    _id: new ObjectId(session.user.id),
  });

  if (!user?.avatarData) {
    return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
  }

  const buffer = toBuffer(user.avatarData as Binary | Buffer);
  const contentType =
    typeof user.avatarMime === "string" ? user.avatarMime : "image/jpeg";

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}

export async function POST(request: Request) {
  try {
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
    const buffer = Buffer.from(await file.arrayBuffer());
    const now = new Date();
    const imageUrl = buildAvatarImageUrl(now);

    const users = await getUsersCollection();
    await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          image: imageUrl,
          avatarData: new Binary(buffer),
          avatarMime: file.type,
          updatedAt: now,
        },
      },
    );

    return NextResponse.json({ image: imageUrl });
  } catch (error) {
    console.error("Avatar upload failed:", error);
    return NextResponse.json({ error: "アイコンの保存に失敗しました" }, { status: 500 });
  }
}
