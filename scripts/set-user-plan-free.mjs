import { config } from "dotenv";
import { MongoClient } from "mongodb";

config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not set");
  process.exit(1);
}

const emailQuery = process.argv[2] ?? "chiisun382@gmail.com";

const client = new MongoClient(uri);
await client.connect();
const users = client.db().collection("users");

const user = await users.findOne({
  email: { $regex: new RegExp(`^${emailQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
});

if (!user) {
  const partial = await users.findOne({ email: { $regex: /^chiisun382@/i } });
  if (!partial) {
    console.error("User not found:", emailQuery);
    await client.close();
    process.exit(1);
  }
  console.log("Matched by prefix:", partial.email, "plan:", partial.plan);
  const result = await users.updateOne(
    { _id: partial._id },
    { $set: { plan: "free", updatedAt: new Date() } },
  );
  console.log("Updated to free, modifiedCount:", result.modifiedCount);
  await client.close();
  process.exit(0);
}

console.log("Found:", user.email, "current plan:", user.plan);
const result = await users.updateOne(
  { _id: user._id },
  { $set: { plan: "free", updatedAt: new Date() } },
);
console.log("Updated to free, modifiedCount:", result.modifiedCount);
await client.close();
