import { auth } from "@/auth";
import { adminForbiddenResponse, adminUnauthorizedResponse } from "@/lib/admin/require-admin";
import { getUsersCollection } from "@/lib/mongodb";
import { Binary, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

function toBuffer(data: Binary | Buffer): Buffer {
  if (Buffer.isBuffer(data)) return data;
  return Buffer.from(data.buffer);
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) return adminUnauthorizedResponse();
  if (session.user.role !== "admin") return adminForbiddenResponse();

  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  const users = await getUsersCollection();
  const user = await users.findOne({ _id: new ObjectId(id) });

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
