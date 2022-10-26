const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()

const Article = require('./models/articleSchema')

dotenv.config()

mongoose.connect(process.env.MONGO_DB)

let port = 3000

app.use(bodyParser.urlencoded({ extended: true }))

// All Docs
app.get('/api/article', async (req, res) => {
    try {
        const article = await Article.find()
        res.send(article)
    } catch (err) {
        res.send(err)
    }
})

app.post('/api/article', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticle())

app.delete('/api/article', async (req, res) => {
    const article = await Article.deleteMany()
    res.send(`Deleted all articles:\n ${article}`)
})

// Individual Documents
app.get('/api/article/:id', async (req, res) => {
    const item = req.params.id
    try {
        const article = await Article.findOne({ _id: item })
        res.send(article)
    } catch (err) {
        res.send(err)
    }
    
})

// To build out PUT

// To build out PATCH


app.delete('/api/article/:id', async (req, res) => {
    const item = req.params.id
    try {
        const article = await Article.deleteOne({ _id: item })
        res.send(`Deleted successfully ${article}`)
    } catch (err) {
        res.send(err)
    }
})

app.listen(port, () => {
    console.log(`App is listening on port: ${port}`);
})

function saveArticle() {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.content = req.body.content
        article.auth = req.body.auth
        try {
            article = await article.save()
            res.send(`Success:\n ${article}`)
        } catch (err) {
            res.send(err)
        }
    }
}