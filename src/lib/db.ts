import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// 使用本地文件数据库
const client = createClient({
  url: process.env.DATABASE_URL || "file:./data/newclaw.db",
});

export const db = drizzle(client, { schema });

export * from "./schema";
