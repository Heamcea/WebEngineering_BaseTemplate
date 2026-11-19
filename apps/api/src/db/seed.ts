import { db } from './db.js';
import { bears } from './schema.js';
import { fetchBearsFromWikipedia } from '../services/bear-service.js';
import { pool } from './pool.js';

async function seed(): Promise<void> {
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
