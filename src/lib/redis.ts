import { REDIS_PATH } from "$env/static/private";
import Redis from "ioredis";

export const redis = new Redis(REDIS_PATH);
