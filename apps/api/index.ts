import express from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import v1Router from "./routes/v1"
import { prismaClient } from "@repo/store/client";
import { AuthInput } from "./types";
import { authMiddleware } from "./middleware";
import cors from "cors";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1", v1Router);

app.get("/", (req, res)=>{
    res.json({
        message: "Hello world"
    })
})

app.post("/website", authMiddleware, async(req, res)=>{
    if(!req.body.url){
        res.status(411).json({});
        return;
    }


    const website = await prismaClient.website.create({
        data:{
            url: req.body.url,
            user_id: req.userId!
        }
    })

    res.json({
        id: website.id
    })
})

app.get("/status/:websiteId", authMiddleware, async(req, res)=>{
    const website = await prismaClient.website.findFirst({
        where:{
            user_id: req.userId!,
            id: req.params.websiteId
        },
        include:{
            ticks:{
                orderBy: [{
                    createdAt: 'desc',
                }],
                take: 10
            }
        }
    })
    console.log(website);
    if(!website){
        res.status(409).json({
            message: "Not found"
        })
        return;
    }

    res.json({
        url: website.url,
        id: website.id,
        user_id: website.user_id,
        ticks: website.ticks
    })
})

app.post("/user/signup",async (req, res)=>{
    const data = AuthInput.safeParse(req.body);
    if(!data.success){
        res.status(403).send("");
        return;
    }

    try {
        let user = await prismaClient.user.create({
            data:{
                username: data.data.username,
                password: data.data.password
            }
        })
        res.json({
            id : user.id
        })
    } catch (error) {
        res.status(403).send("")        
    }

    
    
})

app.get("/websites", authMiddleware, async(req, res)=>{
    const websites = await prismaClient.website.findMany({
        where:{
            user_id : req.userId
        }, include:{
            ticks:{
                orderBy: [{
                    createdAt: 'desc',
                }],
                take: 1
            }
        }
    })

    res.json({
        websites
    })
})

app.post("/user/signin",async (req, res)=>{
    const data = AuthInput.safeParse(req.body);
    
    if(!data.success){
        res.status(403).send("");
        return;
    }
    
    try{
        const user = await prismaClient.user.findFirst({
            where:{
                username: data.data.username
            }
        })
        if(user?.password!==data.data.password){
            res.status(403).send("wrong password");
            return;
        }

        let token = jwt.sign({
            sub: user.id
        }, process.env.JWT_SECRET!);

        res.json({
            jwt: token
        })
    }catch(error){
        console.log(error);
    }

    
})

app.listen(process.env.PORT || 3000, ()=>{console.log("App listening at port : ",process.env.PORT || 3000)})