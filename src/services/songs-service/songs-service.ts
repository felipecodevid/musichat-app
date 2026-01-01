import { db, schema } from "@/db/client/sqlite";
import { eq, and, isNull } from "drizzle-orm";
import uuid from "react-native-uuid"

// Mocked for now
const DEVICE_ID = "fb0bb89f-9eb6-457d-ad90-2f22c5d828dd"

export class SongsService {
  constructor(private userId: string) { }

  async addSong(albumId: string, name: string, description?: string) {
    const now = Date.now();
    const id = uuid.v4();

    await db.insert(schema.songs).values({
      id,
      albumId,
      name,
      description: description ?? null,
      deviceId: DEVICE_ID,
      createdAt: now,
      updatedAt: now,
      userId: this.userId,
    });

    await db.insert(schema.outbox).values({
      opId: uuid.v4(),
      table: "songs",
      type: "insert",
      payload: JSON.stringify({
        id,
        albumId,
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

  async updateSong(id: string, data: { name?: string; description?: string }) {
    const now = Date.now();
    const row = await db.query.songs.findFirst({ where: eq(schema.songs.id, id) });
    if (!row) return;

    const nextVersion = row.version + 1;

    await db.update(schema.songs)
      .set({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        updatedAt: now,
        version: nextVersion,
      })
      .where(eq(schema.songs.id, id));

    await db.insert(schema.outbox).values({
      opId: uuid.v4(),
      table: "songs",
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

  async softDeleteSong(id: string) {
    const now = Date.now();
    const row = await db.query.songs.findFirst({ where: eq(schema.songs.id, id) });
    if (!row) return;

    const nextVersion = row.version + 1;

    await db.update(schema.songs)
      .set({ deletedAt: now, updatedAt: now, version: nextVersion })
      .where(eq(schema.songs.id, id));

    await db.insert(schema.outbox).values({
      opId: uuid.v4(),
      table: "songs",
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
  async getSong(id: string) {
    return await db.query.songs.findFirst({
      where: and(eq(schema.songs.id, id), eq(schema.songs.userId, this.userId), isNull(schema.songs.deletedAt))
    });
  }
}
