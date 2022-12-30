const express = require('express')
const chalk = require('chalk')
const app = express()
const port = 3000

const path = require("path")

// ler o body
app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(express.json)

const basePath = path.join(__dirname, 'templates')

const checkAuth = function (req, res, next) {
    req.authStatus = false

    if (req.authStatus) {
        console.log('Está logado, pode continuar')
        next()
    } else {
        console.log('Não está logado, faça o login para continuar')
        next()
    }
}

app.use(checkAuth)

app.get('/users/add', (req, res) => {
    res.sendFile(`${basePath}/userform.html`)
})
app.get('/users/:id', (req, res) => {
    const id = req.params.id
    // leitura da tabela users, resgatando um usuário do banco
    console.log(chalk.blue(`O usuário ${id} está sendo buscado`))

    res.sendFile(`${basePath}/users.html`)
})

app.post('/users/save', (req, res) => {
    console.log(req.body)
})


app.get('/', (req, res) => {
    res.sendFile(`${basePath}/index.html`)
})

app.listen(port, () => {
    console.log(chalk.green(`App rodando na porta ${port}`))
})

