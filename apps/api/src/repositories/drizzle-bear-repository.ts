import { eq } from 'drizzle-orm';

import { db } from '../db/db.js';
import { bears } from '../db/schema.js';
import { BearSchema, type Bear } from '../schemas/bear.js';

import type { BearRepository } from './bear-repository.js';

export class DrizzleBearRepository implements BearRepository {
  async list(): Promise<Bear[]> {
    const rows = await db.select().from(bears);

    return rows.map((row) =>
      BearSchema.parse({
        id: row.id,
        name: row.name,
        binomial: row.binomial,
        range: row.range,
        imageUrl: row.imageUrl,
      })
    );
  }

  async findById(id: string): Promise<Bear | undefined> {
    const [row] = await db
      .select()
      .from(bears)
      .where(eq(bears.id, id))
      .limit(1);

    if (row === undefined) {
      return undefined;
    }

    return BearSchema.parse({
      id: row.id,
      name: row.name,
      binomial: row.binomial,
      range: row.range,
      imageUrl: row.imageUrl,
    });
  }
}
