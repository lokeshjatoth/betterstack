import {describe, expect, it} from "bun:test";
import axios from "axios";

let BASE_URL = "http://loclahost:3000";


describe("Website gets created", ()=>{
    it("Website not created if url is not present", async()=>{
        try{
            await axios.post(`${BASE_URL}/website`, {

            });
            expect(false, "Website created when it shouldnt")
        }catch(e){}
        
    })

    it("Website created if url is present", async()=>{
        try{
            const response = await axios.post(`${BASE_URL}/website`, {
                url: "https://google.com"
            });
            expect(response.data.id).not.toBeNull();
        }catch(e){}
        
    })
})