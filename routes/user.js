const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const helpers = require('../helpers')
const session = require('express-session')
const { response } = require('express')
const hbs = require('handlebars')

var User = mongoose.model("user", helpers.userSchema);
var Blog = mongoose.model("blog", helpers.blogSchema)
var Articletopics = mongoose.model("articletopics", helpers.topicSchema)

var date_ob = new Date();
var day = ("0" + date_ob.getDate()).slice(-2);
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
var year = date_ob.getFullYear();
var date = year + "-" + month + "-" + day;


router.get('/', (req, res) => {
    if (req.session.user) {
        Blog.find({ status: true }, (err, response) => {
            if (err) {
                res.send('something error')
            } else {
                res.render('user/dashboard', { blogs: response, user: req.session.user })
            }
        })

    } else {
        res.redirect('/login')
    }

})

router.get('/signup', (req, res) => {
    res.render('user/signup')
})

router.get('/login', (req, res) => {
    res.render('user/login')
})

router.get('/logout', function (req, res) {
    req.session.destroy()
    res.redirect('/login');
});



router.post('/signup', async function (req, res) {
    var userDetails = req.body;
    const hashedPwd = await bcrypt.hash(userDetails.password, 10)
    var newUser = new User({
        name: userDetails.name,
        email: userDetails.email,
        password: hashedPwd.toString(),
        joindate: date

    })
    newUser.save(function (err, User) {
        if (err) {
            res.send('database error')
            console.log(err)
        } else {
            console.log(User)
            req.session.user = newUser;
            res.redirect('/')
            console.log(req.session.user)

        }
    })


})


router.post('/login', async function (req, res) {
    var userDetails = req.body;
    let user = await User.findOne({ email: userDetails.email });
    if (user) {
        let cmp = await bcrypt.compare(userDetails.password, user.password)
        if (cmp) {
            req.session.user = user;
            console.log('loggin success')
            res.redirect('/')
        } else {
            console.log('login error')
            res.send('password error')
        }

    } else {
        res.send('email address not found')
    }
})


router.get('/createblog', (req, res) => {
    if (req.session.user) {
        Articletopics.find(function (err, response) {
            res.render('user/createblog', { topics: response })
        })

    } else {
        res.redirect('/login')
    }

})

router.post('/createblog', (req, res) => {
    blogDeitals = req.body;
    var newBlog = new Blog({
        title: blogDeitals.title,
        description: blogDeitals.description,
        category: blogDeitals.category,
        message: blogDeitals.message,
        author: req.session.user.name,
        postdate:date,
        status: false

    })
    newBlog.save((err, blog) => {
        if (err) {
            console.log('database error')
        } else {
            res.send('blog will be posting after verification')
        }
    })
})

router.get("/myblogs",(req,res)=>{
    if(req.session.user){
     userblogs=req.session.user.name;
     Blog.find({author:userblogs},(err,response)=>{
        err?res.send("err"):res.send(response)
     })
    }
})













module.exports = router;