import { eq, sql } from "drizzle-orm";

import { db } from "../db";
import { link } from "../db/schemas/link";

type CreateLinkInput = {
  originalUrl: string;
  shortUrl: string;
};

const findByShortUrl = async (shortUrl: string) => {
  const [foundLink] = await db
    .select()
    .from(link)
    .where(eq(link.shortUrl, shortUrl))
    .limit(1);

  return foundLink;
};

const listAll = async () => {
  const links = await db.select().from(link);

  return links.sort((a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
};

const create = async ({ originalUrl, shortUrl }: CreateLinkInput) => {
  const [createdLink] = await db
    .insert(link)
    .values({
      originalUrl,
      shortUrl,
      accessCount: "0",
    })
    .returning();

  return createdLink;
};

const incrementAccessById = async (id: string) => {
  const [updatedLink] = await db
    .update(link)
    .set({
      accessCount: sql`((${link.accessCount})::int + 1)::text`,
    })
    .where(eq(link.id, id))
    .returning();

  return updatedLink;
};

const deleteById = async (id: string) => {
  const deletedLinks = await db
    .delete(link)
    .where(eq(link.id, id))
    .returning({ id: link.id });

  return deletedLinks.length > 0;
};

export const linkService = {
  findByShortUrl,
  listAll,
  create,
  incrementAccessById,
  deleteById,
};
