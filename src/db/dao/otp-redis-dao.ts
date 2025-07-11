import { createClient, RedisClientType } from 'redis';
import IOTP from "../interfaces/otp";

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';

const client: RedisClientType = createClient({ url: redisUrl });
client.connect();

export default class OTPDAO implements IOTP {
    private prefix = 'otp:';

    async save(id: string, otp: string, expiresAt: Date): Promise<boolean> {
        const key = this.prefix + id;
        const value = JSON.stringify({ id, otp, expiresAt: expiresAt.toISOString() });
        const ttl = Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
        try {
            await client.set(key, value, { EX: ttl });
            return true;
        } catch {
            return false;
        }
    }

    async getById(id: string): Promise<{ id: string; otp: string; expiresAt: Date; } | null> {
        const key = this.prefix + id;
        const data = await client.get(key);
        if (!data) return null;
        const parsed = JSON.parse(data);
        return {
            id: parsed.id,
            otp: parsed.otp,
            expiresAt: new Date(parsed.expiresAt),
        };
    }

    async deleteById(id: string): Promise<boolean> {
        const key = this.prefix + id;
        const result = await client.del(key);
        return result > 0;
    }
}