import { db, schema } from "@/db/client/sqlite";
import { eq } from "drizzle-orm";
import uuid from "react-native-uuid"

// Mocked for now
const DEVICE_ID = "fb0bb89f-9eb6-457d-ad90-2f22c5d828dd"

export class MessagesService {
  constructor(private userId: string) { }

  async addMessage(content: string) {
    const now = Date.now();
    const id = uuid.v4();

    await db.insert(schema.messages).values({ id, content, deviceId: DEVICE_ID, createdAt: now, updatedAt: now, userId: this.userId });

    await db.insert(schema.outbox).values({
      opId: uuid.v4(),
      table: "messages",
      type: "insert",
      payload: JSON.stringify({
        id,
        userId: this.userId,
        content,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        deviceId: DEVICE_ID,
        version: 0,
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
      opId: uuid.v4(),
      table: "messages",
      type: "update",
      payload: JSON.stringify({
        ...row,
        content,
        updatedAt: now,
        version: nextVersion,
        userId: this.userId,
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
      opId: uuid.v4(),
      table: "messages",
      type: "delete",
      payload: JSON.stringify({
        ...row,
        deletedAt: now,
        updatedAt: now,
        version: nextVersion,
        userId: this.userId,
      }),
      createdAt: now,
    });
  }
}