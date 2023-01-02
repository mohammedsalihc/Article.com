const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
mongoose.connect('mongodb://127.0.0.1/projectdb');
const path = require('path')





const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const managerRouter = require('./routes/manager')
const PORT = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }));
app.use('/', userRouter)
app.use('/admin', adminRouter)
app.use('/manager', managerRouter)

app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));


app.use(cookieParser());


app.listen(PORT, () => {
    console.log('server running port:' + PORT)
})


