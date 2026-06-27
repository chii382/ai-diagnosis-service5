import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    process.env[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
  }
}

const email = process.argv[2] ?? "chiishun382@gmail.com";
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI が未設定です");
  process.exit(1);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const users = client.db().collection("users");
  const result = await users.updateOne(
    { email },
    { $set: { role: "admin", updatedAt: new Date() } },
  );
  const user = await users.findOne({ email }, { projection: { email: 1, name: 1, role: 1 } });
  console.log(`matched: ${result.matchedCount}, modified: ${result.modifiedCount}`);
  console.log("user:", user);
  if (result.matchedCount === 0) {
    process.exit(2);
  }
} finally {
  await client.close();
}
