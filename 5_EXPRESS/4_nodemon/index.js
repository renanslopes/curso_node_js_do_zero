const express = require('express')
const chalk = require('chalk')
const app = express()
const port = 3000

const path = require("path")

const basePath = path.join(__dirname, 'templates')

app.get('/', (req, res) => {
    res.sendFile(`${basePath}/index.html`)
})

app.listen(port, () => {
    console.log(chalk.green(`App rodando na porta ${port}`))
})