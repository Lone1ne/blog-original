//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Hello and Welcome. Ever catch yourself wondering what the world you're doing? Youre not alone! Here at Dereks Blog, we are a community of people who have absolutly no idea what they're doing nearly 100% of the time. Intersested? Keep scrolling to learn more!";
const aboutContent = "No but on a serious note, Im Derek. An aspiring Full-Stack Web Developer. Here are some of the my other projects.";
const contactContent = "Wow I wasnt expecting this...you actually came to the contact page. Okay well if you wish to contact me further, please sign up to our mailing list here!";

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://', { useNewUrlParser: true,});
mongoose.set("strictQuery", false);

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {

  Post.find({}, function(err,posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req,res) {
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req,res) {
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
});
});

// dynamic url, using parameter we made up ie postname to decide what we should do
app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
};

app.listen(port, function() {
  console.log("Server started on port 3000");
});
