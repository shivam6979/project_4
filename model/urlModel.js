const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    urlCode: { type:String,require:true, unique:true, lowercase:true, trim:true },
     longUrl: {type:String, require:true,trim:true },
      shortUrl: {type:String, require:true, unique:true}
},{timestamp:true}
)
module.exports=mongoose.model("url's",urlSchema)