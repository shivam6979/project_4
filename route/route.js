const express= require("express");

const router=express.Router();
const urlController=require("../controller/urlController")

router.get("/test", function(req,res){
    res.send("Port is running on hi")
})

router.post("/url/shorten", urlController.urlShortner)

router.get("/:urlCode", urlController.geturl)

module.exports=router;