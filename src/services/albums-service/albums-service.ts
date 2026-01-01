import { db, schema } from "@/db/client/sqlite";
import { eq } from "drizzle-orm";
import uuid from "react-native-uuid"

// Mocked for now
const DEVICE_ID = "fb0bb89f-9eb6-457d-ad90-2f22c5d828dd"

export class AlbumsService {
  constructor(private userId: string) { }

  async addAlbum(name: string, description?: string) {
    const now = Date.now();
    const id = uuid.v4();

    await db.insert(schema.albums).values({
      id,
      name,
      description: description ?? null,
      deviceId: DEVICE_ID,
      createdAt: now,
      updatedAt: now,
      userId: this.userId,
    });

    await db.insert(schema.outbox).values({
      opId: uuid.v4(),
      table: "albums",
      type: "insert",
      payload: JSON.stringify({
        id,
        name,
        description: description ?? null,
        userId: this.userId,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        deviceId: DEVICE_ID,
        version: 0,
      }),
      createdAt: now,
    });

    return id;
  }

  async updateAlbum(id: string, data: { name?: string; description?: string }) {
    const now = Date.now();
    const row = await db.query.albums.findFirst({ where: eq(schema.albums.id, id) });
    if (!row) return;

    const nextVersion = row.version + 1;

    await db.update(schema.albums)
      .set({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        updatedAt: now,
        version: nextVersion,
      })
      .where(eq(schema.albums.id, id));

    await db.insert(schema.outbox).values({
      opId: uuid.v4(),
      table: "albums",
      type: "update",
      payload: JSON.stringify({
        ...row,
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        updatedAt: now,
        version: nextVersion,
        userId: this.userId,
      }),
      createdAt: now,
    });
  }

  async softDeleteAlbum(id: string) {
    const now = Date.now();
    const row = await db.query.albums.findFirst({ where: eq(schema.albums.id, id) });
    if (!row) return;

    const nextVersion = row.version + 1;

    await db.update(schema.albums)
      .set({ deletedAt: now, updatedAt: now, version: nextVersion })
      .where(eq(schema.albums.id, id));

    await db.insert(schema.outbox).values({
      opId: uuid.v4(),
      table: "albums",
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
