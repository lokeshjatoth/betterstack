import express from "express";
import dotenv from "dotenv";
import v1Router from "./routes/v1"
import { prismaClient } from "@repo/store/client";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/v1", v1Router);

app.get("/", (req, res)=>{
    res.json({
        message: "Hello world"
    })
})

app.post("/website", async(req, res)=>{
    if(!req.body.url){
        res.status(411).json({});
        return;
    }


    const website = await prismaClient.website.create({
        data:{
            url: req.body.url,
            timeAdded: new Date(),
        }
    })

    res.json({
        id: website.id
    })
})

app.listen(process.env.PORT || 3000, ()=>{console.log("App listening at port : ",process.env.PORT || 3000)})