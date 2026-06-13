import { auth } from "@/auth";
import {
  AGE_RANGE_OPTIONS,
  GENDER_OPTIONS,
  OCCUPATION_OPTIONS,
  parseBio,
  parseOptionalSelect,
} from "@/lib/profile-options";
import { getUsersCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const genderValues = new Set<string>(GENDER_OPTIONS.map((o) => o.value));
const ageRangeValues = new Set<string>(AGE_RANGE_OPTIONS.map((o) => o.value));
const occupationValues = new Set<string>(OCCUPATION_OPTIONS.map((o) => o.value));

function serializeUser(user: {
  _id: ObjectId;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  gender?: string | null;
  ageRange?: string | null;
  occupation?: string | null;
  bio?: string | null;
}) {
  return {
    id: user._id.toString(),
    name: user.name ?? "",
    email: user.email ?? "",
    image: user.image ?? "",
    emailVerified: user.emailVerified ?? null,
    createdAt: user.createdAt ?? null,
    updatedAt: user.updatedAt ?? null,
    gender: user.gender ?? null,
    ageRange: user.ageRange ?? null,
    occupation: user.occupation ?? null,
    bio: user.bio ?? "",
  };
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

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(serializeUser(user));
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    name?: unknown;
    gender?: unknown;
    ageRange?: unknown;
    occupation?: unknown;
    bio?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const gender = parseOptionalSelect(body.gender, genderValues);
  const ageRange = parseOptionalSelect(body.ageRange, ageRangeValues);
  const occupation = parseOptionalSelect(body.occupation, occupationValues);
  const bio = parseBio(body.bio);

  if (body.gender !== undefined && body.gender !== null && body.gender !== "" && gender === null) {
    return NextResponse.json({ error: "Invalid gender" }, { status: 400 });
  }
  if (
    body.ageRange !== undefined &&
    body.ageRange !== null &&
    body.ageRange !== "" &&
    ageRange === null
  ) {
    return NextResponse.json({ error: "Invalid age range" }, { status: 400 });
  }
  if (
    body.occupation !== undefined &&
    body.occupation !== null &&
    body.occupation !== "" &&
    occupation === null
  ) {
    return NextResponse.json({ error: "Invalid occupation" }, { status: 400 });
  }

  const users = await getUsersCollection();
  const now = new Date();

  await users.updateOne(
    { _id: new ObjectId(session.user.id) },
    {
      $set: {
        name,
        gender,
        ageRange,
        occupation,
        bio,
        updatedAt: now,
      },
    },
  );

  const user = await users.findOne({
    _id: new ObjectId(session.user.id),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(serializeUser(user));
}
