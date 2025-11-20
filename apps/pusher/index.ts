import { prismaClient } from "@repo/store/client"
import { xAddBulk } from "@repo/redis/client"

async function main(){
    let websites = await prismaClient.website.findMany({
        select:{
            url: true,
            id: true
        }
    })

    console.log(websites.length);
    const res = await xAddBulk(websites.map(w=>({
        url: w.url,
        id: w.id
    })));
    console.log(res);
}

setInterval(()=>{
    main()
}, 3*1000)