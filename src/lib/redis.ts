import {
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "$env/static/private";
import Redis from "ioredis";

export const redis = new Redis(
  `redis://default:${UPSTASH_REDIS_REST_TOKEN}@${UPSTASH_REDIS_REST_URL}:31427`,
);
