

const mongoose = require('mongoose')

module.exports = {
    topicSchema: topicschema = mongoose.Schema({
        category: String,
    }),

    blogSchema: blogSchema = mongoose.Schema({
        title: String,
        category: String,
        description: String,
        message: String,
        author: String,
        status: Boolean,
        postdate:String
    }),

    userSchema: userSchema = mongoose.Schema({
        name: String,
        email: String,
        password: String,
        joindate: String
    }),
    adminSchema: adminSchema = mongoose.Schema({
        username: String,
        password: String
    }),
    managerSchema: managerSchema = mongoose.Schema({
        name: String,
        category: String,
        username: String,
        password: String,
        joindate: String
    }),




}

