const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const session = require('express-session')
const helpers = require('../helpers')
const hbs = require('handlebars')
const { adminSchema, topicSchema, userSchema } = require('../helpers')
const { response } = require('express')

var Admin = mongoose.model("admin", adminSchema)
var Articletopics = mongoose.model("articletopics", topicSchema)
var User = mongoose.model("user", userSchema);
var Manager = mongoose.model('manager', managerSchema)



var date_ob = new Date();
var day = ("0" + date_ob.getDate()).slice(-2);
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
var year = date_ob.getFullYear();
var date = year + "-" + month + "-" + day;

router.get('/', (req, res) => {
    if (req.session.admin) {
        res.render('admin/dashboard', { admin: req.session.admin })
    } else {
        res.redirect('/admin/login')
    }

})


router.get('/login', (req, res) => {
    res.render('admin/login')
})

router.post('/login', async (req, res) => {
    adminData = req.body;
    let admin = await Admin.findOne({ username: adminData.username })
    if (admin) {
        req.session.admin = admin;
        res.redirect('/admin')
    } else {
        res.redirect('/admin/login')


    }
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/admin')
})

router.get('/createmanager', (req, res) => {
    if (req.session.admin) {
        Articletopics.find((err, response) => {
            res.render('admin/manager', { topics: response })
        })

    } else {
        res.redirect('/admin')
    }
})

router.post('/createmanager', async (req, res) => {
    managerDetialas = req.body;
    const hashedPwd = await bcrypt.hash(managerDetialas.password, 10)
    var newManager = new Manager({
        name: managerDetialas.name,
        category: managerDetialas.category,
        username: managerDetialas.username,
        password: hashedPwd.toString(),
        joindate: date

    })
    newManager.save(function (err, newmanger) {
        if (err) {
            console.log('database error')
        } else {
            req.session.manager = newmanger
            res.redirect('/admin')
        }
    })


})

router.get('/users', (req, res) => {
    if (req.session.admin) {
        User.find((err, response) => {
            res.render('admin/users', { users: response })
        })
    } else {
        res.redirect('/admin')
    }
})

router.get('/managers', (req, res) => {
    if (req.session.admin) {
        Manager.find((err, response) => {
            res.render('admin/managers', { managers: response })
        })
    } else {
        res.redirect('/admin')
    }
})

router.get('/user_edit/:id', async (req, res) => {
    params = req.params.id;
    User.findById(params, (err, response) => {
        if (err) {
            res.send('something error')
        } else {
            res.render('admin/edituser', { user: response })
        }
    })
})

router.post('/user_edit/:id', (req, res) => {
    params = req.params.id;
    User.findByIdAndUpdate(params, req.body, (err, response) => {
        if (err) {
            res.send('something error')
        } else {
            res.redirect('/admin/users')
        }
    })


})


router.get('/manager_edit/:id', (req, res) => {
    params = req.params.id;
    Manager.findById(params, (err, response) => {
        if (err) {
            res.send('something error')
        } else {
            Articletopics.find((err, topics) => {
                res.render('admin/editmanager', { manager: response, topics })
            })

        }
    })

})

router.post('/manager_edit/:id', (req, res) => {
    params = req.params.id;
    Manager.findByIdAndUpdate(params, req.body, (err, response) => {
        if (err) {
            res.send('something error')
        } else {
            res.redirect('/admin/managers')
        }
    })
})


module.exports = router;