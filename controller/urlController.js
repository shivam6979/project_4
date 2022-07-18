const urlModel = require("../model/urlModel")
const validUrl = require('valid-url')
const shortid = require('shortid')

const baseUrl = 'http:localhost:3400'

const urlShortner = async function (req, res) {
    try {
        const {longUrl} = req.body // destructure the longUrl from req.body.longUrl
        // let body = req.body.longUrl

        console.log(req.body.longUrl)
        if (!req.body.longUrl) { res.status(400).send({ status: false, message: "Please enter longUrl" }) }

        // check base url if valid using constthe validUrl.isUri method
        if (!validUrl.isUri(baseUrl)) {
            return res.status(401).send({ status: false, message: "Invalid base url" })
        }

        // if valid, we create the url code
        const urlCode = shortid.generate().toLowerCase()  //generating the url code


        // check long url if valid using the validUrl.isUri method
        if (validUrl.isUri(longUrl)) {


            let url = await urlModel.findOne({longUrl})
            // url exist and return the respose
            if (url) {
               return res.status(200).send({ status: true, data: url })
            } else {
                // join the generated short code the the base url
                const shortUrl = baseUrl + '/' + urlCode    // creating the short url

                let data = {}
                data.longUrl = longUrl;
                data.shortUrl = shortUrl;
                data.urlCode = urlCode
 // invoking the Url model and saving to the DB
let url = await  urlModel.create(data)
return res.status(201).send({ status: true, data: url })
}
// exception handler

        } else {
           return res.status(401).send({ status: false, message: 'Invalid longUrl' })
        }
    }
    catch (err) {return res.status(500).send({ status: false, message: err.message }),console.error(err) }
}



module.exports.urlShortner = urlShortner



// ==========================get url================

const geturl = async function(req,res){
    try{
const url = await urlModel.findOne({urlCode:req.params.urlCode});
if(url){
    return res.redirect(url.longUrl)
}
else{
    res.status(404).send({ status: false, message: 'Url not Found' })
}
    }catch(err){
        console.error(err)
        return res.status(500).send({status:false,message:"server error"})
    }
}

module.exports.geturl = geturl
