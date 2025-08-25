import { eq } from "drizzle-orm";
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

export const listLinks = async (data: { offset?: number; limit?: number }) => {
  console.log(`[listLinks] ${JSON.stringify(data, null, 2)}`);
  const db = getDb();
  const linksResult = await db
    .select()
    .from(links)
    .limit(data.limit ?? 20)
    .offset(data.offset ?? 0);

  return linksResult;
};

export const getLinkById = async (data: { linkId: string }) => {
  console.log(`[getLinkById] ${JSON.stringify(data, null, 2)}`);
  const db = getDb();
  const linksResult = await db.select().from(links).where(eq(links.linkId, data.linkId)).limit(1);
  if (linksResult.length === 0) {
    return undefined;
  }
  const destinations = JSON.parse(linksResult[0].destinations);
  const parsedLink = { ...linksResult[0], destinations };
  return parsedLink;
};

export const updateLinkNameById = async (data: { linkId: string; name: string }) => {
  console.log(`[updateLinkByIk] ${JSON.stringify(data)}`);
  const db = getDb();
  await db.update(links).set({ name: data.name });
  return data.linkId;
};

export const updateLinkDestinationsById = async (data: {
  linkId: string;
  destinations: { default: string } & { [k: string]: string };
}) => {
  console.log(`[updateLinkByIk] ${JSON.stringify(data)}`);
  const db = getDb();
  await db.update(links).set({ destinations: JSON.stringify(data.destinations) });
  return data.linkId;
};
