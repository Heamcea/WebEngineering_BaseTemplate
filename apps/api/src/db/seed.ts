import { db } from './db.js';
import { bears, users } from './schema.js';
import { fetchBearsFromWikipedia } from '../services/bear-service.js';
import { pool } from './pool.js';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';

async function seedModerator(): Promise<void> {
  const email = 'mod@mod.com';
  const password = process.env.MODERATOR_PASSWORD;

  if (password === undefined || password.length < 12) {
    throw new Error('MODERATOR_PASSWORD must have at least 12 characters');
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  await db
    .insert(users)
    .values({
      email,
      passwordHash,
      role: 'moderator',
    })
    .onConflictDoNothing({
      target: users.email,
    });

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user?.role !== 'moderator') {
    throw new Error('Moderator email already belongs to a regular user');
  }

  console.log('Moderator seeded');
}

async function seed(): Promise<void> {
  await seedModerator();

  console.log('Fetching bears...');

  const fetchedBears = await fetchBearsFromWikipedia();

  console.log(`Fetched ${fetchedBears.length} bears`);

  for (const bear of fetchedBears) {
    await db
      .insert(bears)
      .values({
        id: bear.id,
        name: bear.name,
        binomial: bear.binomial,
        imageUrl: bear.imageUrl,
        range: bear.range,
        fetchedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: bears.id,
        set: {
          name: bear.name,
          binomial: bear.binomial,
          imageUrl: bear.imageUrl,
          range: bear.range,
          fetchedAt: new Date(),
        },
      });
  }

  console.log('Seed completed');
}

try {
  await seed();
} finally {
  await pool.end();
}
