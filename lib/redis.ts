import { createClient, type RedisClientType } from 'redis';

export function redisConfigured(): boolean {
  return Boolean(process.env.REDIS_URL);
}

export async function withRedis<T>(
  fn: (client: RedisClientType) => Promise<T>,
): Promise<T> {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error('REDIS_URL is not configured');
  }

  const client = createClient({ url }) as RedisClientType;
  client.on('error', () => {});

  await client.connect();

  try {
    return await fn(client);
  } finally {
    await client.quit().catch(() => {});
  }
}
