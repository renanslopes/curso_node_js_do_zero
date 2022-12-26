// MODULOS EXTERNOS
const inquirer = require('inquirer')
const chalk = require('chalk')

// MODULOS INTERNOS
const fs = require('fs')
const { create } = require('domain')

operations()

function operations() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: ' O que você deseja fazer? ',
            choices: [' Criar conta ', ' Consultar saldo ', ' Depositar ', ' Sacar ', ' Sair ']

        },
    ]).then((answer) => {
        const action = answer['action']

        if (action === " Criar conta ") {
            createAccounts()
        } else if (action === " Consultar saldo ") {
            getAccountBalance()
        } else if (action === " Depositar ") {
            deposit()
        } else if (action === " Sacar ") {
            witdhDraw()
        } else if (action === " Sair ") {
            console.log(chalk.bgBlue.black(' Obrigado por usar o Accounts! '))
            process.exit()
        }
    })
        .catch(err => console.log(err))
}

function createAccounts() {
    console.log(chalk.bgGreen.black(' Parabens por escolher o nosso banco! '))
    console.log(chalk.green(' Defina as opções da sua conta a seguir: '))

    buildAccounts()
}

function buildAccounts() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: ' Digite um nome para sua conta: '
        }
    ])
        .then(answer => {
            const accountName = answer['accountName']
            console.log(accountName)

            if (!accountName) { // Tratamento para nomes de conta em branco
                console.log(chalk.bgRed.black(" Conta vazia, favor informar um nome válido "))
                buildAccounts()
                return
            }

            if (!fs.existsSync('accounts')) { // Verificando se o diretório onde as contas são armazenadas existe, caso não, ele é criado
                fs.mkdirSync('accounts')
            }

            if (fs.existsSync(`accounts/${accountName}.json`)) {
                console.log(
                    chalk.bgRed.black(' Esta conta já existe, escolha outro nome! ')
                )
                buildAccounts()
                return
            }

            fs.writeFileSync(`accounts/${accountName}.json`, `{"balance":0}`,
                function (err) {
                    console.log(err)
                })

            console.log(chalk.green(' Parabéns, sua conta foi criada! '))
            operations()

        })
        .catch(err => console.log(err))
}

function deposit() { // Função de deposito
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
        .then((answer) => {
            const accountName = answer['accountName']

            // Verificando se a conta existe
            if (!checkAccount(accountName)) {
                return deposit()
            }

            inquirer.prompt([
                {
                    name: 'amount',
                    message: 'Quanto você deseja depositar?'
                }
            ])
                .then((answer) => {
                    const amount = answer['amount']

                    // Adicionando valores a conta

                    addAmount(accountName, amount)

                    operations()

                })
                .catch((err) => console.log(err))

        })
        .catch(err => console.log(err))
}

function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black(` Esta conta não existe, escolha outro nome! `))
        return false
    }
    return true
}

function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black(' Ocorreu um erro, tente novamente com dados válidos! '))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(chalk.green(` Foi depositado o valor de R$${amount} na sua conta! `))
    // operations()
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        enconding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
}

// Função de verificação de saldo
function getAccountBalance(accountName) {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
        .then((answer) => {
            const accountName = answer['accountName']

            if (!checkAccount(accountName)) {
                return getAccountBalance()
            }

            const accountData = getAccount(accountName)

            console.log(chalk.bgBlue.black(` Olá, o saldo da sua conta é de R$${accountData.balance} `))
            operations()
        })
        .catch((err) => console.log(err))
}

// Função de saque
function witdhDraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
        .then((answer) => {
            const accountName = answer['accountName']

            if (!checkAccount(accountName)) {
                return witdhDraw()
            }

            inquirer.prompt([
                {
                    name: 'amount',
                    message: 'Quanto você deseja sacar?'
                }
            ])
                .then((answer) => {
                    const amount = answer['amount']

                    removeAmount(accountName, amount)
                    // operations()

                })
                .catch((err) => console.log(err))

        })
        .catch((err) => console.log(err))
}

function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black(' Digite um valor válido! '))
        return witdhDraw()
    }

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black('Montante indisponível, favor digitar um valor válido. '))
        return witdhDraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`Foi realizado um saque de R$ ${amount} na conta de ${accountName}`))
    operations()
}