import razorpay from "@/lib/checkout";

declare global {
  interface Window {
    Razorpay: razorpay;
  }
}

declare global {
  var mongo: CachedConnection | undefined;
}

interface CachedConnection {
  conn: DbConnection | null;
  promise: Promise<DbConnection> | null;
}

interface DbConnection {
  client: MongoClient;
  db: Db;
}
