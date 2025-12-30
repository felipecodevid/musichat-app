import { db, schema } from "@/db/client/sqlite";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid"

const DEVICE_ID = "device_id_mock"

export class MessagesService {
  constructor(private userId: string) {}

  async addMessage(content: string) {
    const now = Date.now();
    const id = nanoid();

    await db.insert(schema.messages).values({ id, content, deviceId: DEVICE_ID, createdAt: now, updatedAt: now });

    await db.insert(schema.outbox).values({
      opId: nanoid(),
      table: "messages",
      type: "insert",
      payload: JSON.stringify({
        id, userId: this.userId, content, done: false,
        updated_at: now, deleted_at: null,
        device_id: DEVICE_ID, version: 0,
      }),
      createdAt: now,
    });

    return id
  }

  async updateMessageContent(id: string, content: string) {
    const now = Date.now();
    const row = await db.query.messages.findFirst({ where: eq(schema.messages.id, id) })
    if (!row) return

    const nextVersion = row.version + 1;

    await db.update(schema.messages).set({ content, updatedAt: now, version: nextVersion }).where(eq(schema.messages.id, id));

    await db.insert(schema.outbox).values({
      opId: nanoid(),
      table: "messages",
      type: "update",
      payload: JSON.stringify({
        ...row,
        content,
        updatedAt: now,
        version: nextVersion,
      }),
      createdAt: now,
    });
  }

  async softDeleteMessage(id: string) {
    const now = Date.now();
    const row = await db.query.messages.findFirst({ where: eq(schema.messages.id, id) })
    if (!row) return

    const nextVersion = row.version + 1;

    await db.update(schema.messages).set({ deletedAt: now, updatedAt: now, version: nextVersion }).where(eq(schema.messages.id, id));

    await db.insert(schema.outbox).values({
      opId: nanoid(),
      table: "messages",
      type: "delete",
      payload: JSON.stringify({
        ...row,
        deletedAt: now,
        updatedAt: now,
        version: nextVersion,
      }),
      createdAt: now,
    });
  }
}