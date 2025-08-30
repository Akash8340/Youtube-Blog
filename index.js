require("dotenv").config();   // <-- load .env here
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("SECRET:", process.env.SECRET);

const express=require("express");
const path = require("path");
const mongoose= require("mongoose");
const cookieParser=require("cookie-parser");

const Blog = require("./models/blogs");

const userRoute=require("./routes/user");
const blogRoute=require("./routes/blog");

const { checkForAuthenticationCookies } = require("./middlewares/authentication");

const app=express();
const PORT = process.env.PORT || 8000;   // <-- use PORT from .env

mongoose.connect(process.env.MONGO_URI)   // <-- use MONGO_URI from .env
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.set("view engine","ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended:false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookies("token"));
app.use(express.static(path.resolve("./public/images")));

app.get("/",async(req,res)=>{
    const allBlogs = await Blog.find({});
    res.render('home',{
        user:req.user,
        blogs:allBlogs,
    });
})

app.use("/users",userRoute);
app.use("/blog", blogRoute);

app.listen(PORT,()=>console.log("Server Started at Port:",PORT));