import { createClient } from "redis";

const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

type WebsiteEvent = {url: string, id: string};

type StreamMessage = {
  id: string;
  message: Record<string, string>;
};

type StreamResponse = Array<{
  name: string;
  messages: StreamMessage[];
}>;

const STREAM_NAME = "betterstack:websites";

async function xAdd({url, id}: WebsiteEvent){
    const res1 = await client.xAdd(
    STREAM_NAME, '*', {
        url,
        id
    }
    );
}

export async function xAddBulk(websites: WebsiteEvent[]){
    for(const w of websites){
        await xAdd({
            url: w.url,
            id: w.id
        })
    }
}

export async function xReadGroup(consumerGroup: string, workerId: string){
    
    const raw = await client.xReadGroup(
        consumerGroup,
        workerId,
        { key: STREAM_NAME, id: '>' },
        { COUNT: 5 }
    );

    if (!raw) return [];

    const res = raw as StreamResponse;

    if (!res[0] || !res[0].messages) return [];

    return res[0].messages;
}

async function xAck(consumerGroup: string, streamId: string){
    await client.xAck(STREAM_NAME, consumerGroup, streamId)
}


export async function xAckBulk(consumerGroup: string, streamIds : string[]){
    streamIds.map(streamId => xAck(consumerGroup, streamId));
}
//client.destroy();