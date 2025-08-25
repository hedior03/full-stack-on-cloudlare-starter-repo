import { nanoid } from "nanoid";
import { getDb } from "@/db/database";
import { links } from "@/drizzle-out/schema";
import { CreateLinkSchemaType } from "@/zod/links";

export const createLink = async (data: CreateLinkSchemaType & { accountId: string }) => {
  console.log(`[createLink] ${JSON.stringify(data, null, 2)}`);
  const db = getDb();
  const id = nanoid(10);
  await db.insert(links).values({
    linkId: id,
    name: data.name,
    destinations: JSON.stringify(data.destinations),
    accountId: data.accountId,
  });

  return id;
};
