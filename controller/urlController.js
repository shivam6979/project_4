const urlModel = require("../model/urlModel")
const validUrl = require('valid-url')
const shortid = require('shortid')
const redis=require("redis")
const {promisify}= require("util")
// import { createClient } from 'redis';
// const client = redis.createClient()//kept blank so that default options are available




// make connection to redis==================
const redisClient=redis.createClient(12507
    ,"redis-12507.c212.ap-south-1-1.ec2.cloud.redislabs.com",
{no_ready_check:true});
// no_ready_check: defaults to false. When a connection is established to the Redis server,. The response from -
// -the INFO command indicates whether the server is ready for more commands. When ready, node_redis emits a -
// -ready event. Setting no_ready_check to true will inhibit this check.
redisClient.auth("9rnzcUHwyTiFHXdtehUSNNYFMfRGcCGJ", function(err){
    if(err) throw err;
});
 redisClient.on("connect", async function(){   //.on use to connect radis
   console.log("Redis is connected...");

 });
redisClient.on("error", async function(err){
    console.log(err.message)
})
 //////// CONNECTION SETUP TO REDIS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const SET_ASYNC=promisify(redisClient.SET).bind(redisClient) // USED TO SAVE DATA IN CACHE
const GET_ASYNC=promisify(redisClient.GET).bind(redisClient)// USED TO FATCH DATA FROM CACHE

 //////// post the short url \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const urlShortner = async function (req, res) {
    try {
        let {longUrl} = req.body // destructure the longUrl from req.body.longUrl
        console.log(req.body)
        if (!req.body) { res.status(400).send({ status: false, message: "Please enter longUrl" }) }
          //***  check url validation *****//
    if (!validUrl.isWebUri(longUrl)) {
        return res.status(400).json('Invalid long Url')
      }
          //Finding long url in cache----
        let urlExists = await GET_ASYNC(`${longUrl}`) // $  TO check value() OR FOR URL

         let data=JSON.parse(urlExists)  //JSON parsing is the process of converting a JSON object in text-
        // - format to a Javascript object that can be used inside a program.
        // IF url exist then sent the data to the front end
        if(urlExists) return res.status(201).send({status:true,message:"successfull from cache",data:data})
        // check in data base
            let url = await urlModel.findOne({longUrl})
            // url exist and return the respose
            if (url) {
               return res.status(200).send({ status: true, data: url, message:"already created from DB" }).select({createdAt:0,updatedAt:0,_id:0,__v:0})
            }
            // IF url doesn't exist then create the short url from the long url or given url
             else {
                // join the generated short code and  the the base url
                const baseUrl = 'http://localhost:3400'
                const urlCode = shortid.generate().toLowerCase()  //generating the url code
                const shortUrl = baseUrl + '/' + urlCode    // creating the short url
                let data = {}
                data.longUrl = longUrl;
                data.shortUrl = shortUrl;
                data.urlCode = urlCode;
 const newShortUrl = await urlModel.create(data);
//  save the short url in the cache..
await SET_ASYNC(`${req.body.longUrl}`,JSON.stringify(newShortUrl));
return res.status(201).send({ status: true, message:"created successfully in cache memory" ,data: newShortUrl});
}
    }
    catch (err) {return res.status(500).send({ status: false, message: err.message }),console.error(err) }
}
module.exports.urlShortner = urlShortner


// ==========================get url================
const geturl = async function(req,res){
    try{
let urlCode = req.params.urlCode
if(!shortid.isValid(urlCode)) return res.status(400).send({ status: false, message: "Please provide Correct urlCode." });
// --------------------------------------------------------------------------
// find urlCode in catch
let existUrlCode = await GET_ASYNC(`${urlCode}`) //FATCH DATA FROM CACHE
// --------------------------------------------------------------------------
//  if found in catch then redirect it [Hit]
if(existUrlCode) return res.status(302).redirect(existUrlCode)//302 -> found
// --------------------------------------------------------------------------
//  if not found in catch then find in data base [Mis]
 const urlInDataBase = await urlModel.findOne({urlCode:urlCode});
if(!urlInDataBase) return res.status(404).send({ status: false, message: "URL not found !" }); //404 ->not found
// --------------------------------------------------------------------------
//  if not found then save it in cache
await SET_ASYNC(`${req.params.urlCode}`,JSON.stringify(urlInDataBase.longUrl))//The JSON. stringify() method converts-
// - a JavaScript object or value to a JSON string, optionally replacing values if a replacer function is -
// -specified or optionally including only the specified properties if a replacer array is specified.
// --------------------------------------------------------------------------

// after saving the url redirect it to the long url
return res.status(302).redirect(urlInDataBase.longUrl)
    }catch(err){
        console.error(err)
        return res.status(500).send({status:false,message:"server error"})
    }
}
module.exports.geturl = geturl

