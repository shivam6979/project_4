const express=require("express")
const mongoose=require("mongoose")

const app=express();
const route=require("../src/route/route")
const bodyParser=require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));




mongoose.connect("mongodb+srv://shiva:ZxJf1KONMThYSpCU@cluster0.yuxls.mongodb.net/Radon_project_four",{
    useNewUrlParser:true
}).then(()=>console.log("Mongoose is connected"))
.catch(err=>console.log(err))

app.use("/",route);

app.listen(process.env.PORT||3400, function(){
console.log("Express is running on port :- "+(process.env.PORT||3400))
})