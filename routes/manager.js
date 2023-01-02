const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const helpers = require('../helpers')
const session = require('express-session')
const { managerSchema, blogSchema } = require('../helpers')
const { response } = require('express')


var Manager = mongoose.model('manager', managerSchema)
var Blog = mongoose.model("blog", blogSchema)




router.get('/', (req, res) => {
    if (req.session.manager) {
        res.render('manager/dashboard', { manager: req.session.manager })
    } else {
        res.redirect('/manager/login')
    }

})

router.get('/login', (req, res) => {
    res.render('manager/login')
})

router.post('/login', async (req, res) => {
    loginData = req.body;
    let manager = await Manager.findOne({ username: loginData.username })
    if (manager) {
        let cmp = await bcrypt.compare(loginData.password, manager.password)
        if (cmp) {
            req.session.manager = manager
            res.redirect('/manager')
        } else {
            res.send('incorrect password')
        }
    } else {
        res.redirect('/manager')
    }

})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/manager')
})


router.get('/blogs', (req, res) => {
    if (req.session.manager) {
        managerTopic = req.session.manager.category;
        Blog.find({ category: managerTopic }, (err, response) => {
            if(err){
                console.log("error")
            }else{
                res.render('manager/blogs', { blogs: response })
            }
           
        })
    }
})

router.get('/approved/:id', (req, res) => {
    params = req.params.id;
    Blog.updateOne({ _id: params }, { status: "true" }, (err, response) => {
        if (err) {
            res.send('something error')
        } else {
            res.redirect('/manager/blogs')
        }
    })

})







module.exports = router;