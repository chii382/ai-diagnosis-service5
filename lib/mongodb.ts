import { MongoClient, type MongoClientOptions } from "mongodb";

const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 10,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export function getMongoUri(): string {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error(
      '環境変数 "MONGODB_URI" が未設定です。.env.local を .env.example を参考に作成してください。',
    );
  }
  return uri;
}

export function getMongoClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(getMongoUri(), options);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

export async function getUsersCollection() {
  const client = await getMongoClientPromise();
  return client.db().collection("users");
}

export async function getDiagnosesCollection() {
  const client = await getMongoClientPromise();
  return client.db().collection("diagnoses");
}
