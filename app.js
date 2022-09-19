require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const ejs = require("ejs");
const md5 = require('md5');
const app = express();

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  //useFindAndModify: false
});

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/favicon.ico', express.static('public/images/favicon.ico'));
app.use(express.static("public"));

//Setting up databases

const postSchema = mongoose.Schema({
  content: {
    type: String,
    required: [true]
  }
});
const quoteSchema = mongoose.Schema({
  content: {
    type: String,
    required: [true]
  }
});
const clientSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  sessions: String,
  comment: String
});
const videoSchema = mongoose.Schema({
  url: {
    type: String,
    required: [true]
  },
  description: String
});

const Post = mongoose.model('Post', postSchema);
const Quote = mongoose.model('Quote', quoteSchema);
const Client = mongoose.model('Client', clientSchema);
const Video = mongoose.model('Video', videoSchema);

//Setting up routes

app.get('/', function(req, res) {
  res.render('splash');
});
app.get('/home', function(req, res) {
    Quote.find({}, function(err, quotes) {
        if (err) {
          console.log(err);
        } else {
          res.render('home', {quotes: quotes});
        }
    });
});
app.get('/about', function(req, res) {
    res.render('about');
});
app.get('/media', function(req, res) {
  Video.find({}, function(err, videos) {
    if (err) {
      console.log(err);
    } else {
      res.render('media', {videos: videos});
    }
  });
});
app.get('/learn', function(req, res) {
    Post.find({}, function(err, posts) {
        if (err) {
          console.log(err);
        } else {
          res.render('learn', {posts: posts});
        }
    });
});
app.get('/pricing', function(req, res) {
    res.render('pricing');
});
app.get('/schedule', function(req, res) {
  res.render('schedule');
});
app.get('/admin', function(req, res) {
  res.render('login');
});

//Admin page functionality

app.post('/admin', function(req, res) {
  const multipass = md5(req.body.multipass);
  if (multipass === process.env.HASH) {
    Client.find({}, function(err, clients) {
      if (err) {
        console.log(err);
      } else {
        Post.find({}, function(err, posts) {
          if (err) {
            console.log(err);
          } else {
            Quote.find({}, function(err, quotes) {
              if (err) {
                console.log(err);
              } else {
                Video.find({}, function(err, videos) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.render('admin', {clients: clients, posts: posts, quotes: quotes, videos: videos});
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.redirect('/admin');
  }
});
app.post('/compose', function(req, res) {
  const post = new Post({
    content: req.body.post
  });
  post.save(function(err) {
    if (!err) {
      res.redirect('/admin');
    }
  });
  const quote = new Quote({
    content: req.body.quote
  });
  quote.save(function(err) {
    if (!err) {
      res.redirect('/admin');
    }
  });
  const video = new Video({
    url: req.body.url,
    description: req.body.description
  });
  video.save(function(err) {
    if (!err) {
      res.redirect('/admin');
    }
  });
});
app.post('/delete', function(req, res) {
  const checked = req.body.check
  const type = req.body.type
  if (type === 'post') {
    Post.findByIdAndRemove(checked, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/admin');
      }
    });
  } else if (type === 'quote') {
    Quote.findByIdAndRemove(checked, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/admin');
      }
    });
  } else if (type === 'video') {
    Video.findByIdAndRemove(checked, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/admin');
      }
    });
  }
});

//Scheduling page functionality

app.post('/schedule', function(req, res) {
  const client = new Client({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    sessions: req.body.sessions,
    comment: req.body.comment
  });
  client.save(function(err) {
    if (!err) {
      res.redirect('/home');
    } else {
      console.log(err);
    }
  });
});

//Server

// app.listen(process.env.PORT || 3000, function() {
//     console.log("Server started");
// });
app.listen(80, function() {
    console.log("Server started on 80");
});
