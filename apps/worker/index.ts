import { xAckBulk, xReadGroup } from "@repo/redis/client";
import { prismaClient } from "@repo/store/client";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

async function main() {
  console.log("Worker Started:", REGION_ID, WORKER_ID);

  while (true) {
    const messages = await xReadGroup(REGION_ID, WORKER_ID);

    if (messages.length === 0) continue;

    
    const tasks = messages.map(({ message }) => fetchWebsite(message.url!, message.id!));

    await Promise.all(tasks);
    console.log(tasks.length);
    // ACK all Redis message IDs
    xAckBulk(REGION_ID, messages.map(({id})=> id));
  }
}

async function fetchWebsite(url: string, websiteId: string){
    return new Promise<void>((resolve) => {
        
        const startTime = Date.now();

        axios
          .get(url)
          .then(async () => {
            const endTime = Date.now();
            await prismaClient.website_tick.create({
              data: {
                response_time_ms: endTime - startTime,
                status: "Up",
                region_id: REGION_ID,
                website_id: websiteId,
              },
            });
            resolve();
          })
          .catch(async () => {
            const endTime = Date.now();
            await prismaClient.website_tick.create({
              data: {
                response_time_ms: endTime - startTime,
                status: "Down",
                region_id: REGION_ID,
                website_id: websiteId,
              },
            });
            resolve();
          });
      });
}

main();
