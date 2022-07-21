const express= require("express");

const router=express.Router();
const urlController=require("../controller/urlController")

router.get("/test", function(req,res){
    res.send("Port is running on hi")
})

router.post("/url/shorten", urlController.urlShortner)

router.get("/:urlCode", urlController.geturl)



router.all("/*", function(req, res) {
    res.status(404).send({ status: false, msg: "The api you requested is not available" })

})

module.exports=router;