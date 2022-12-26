// Mais de um valor
const x = 10
const y = 'Algum texto'
const z = [1, 2]

console.log(x, y, z)

//Contagem de impressoes
console.count(`O valor de x é: ${x}, contagem`)
console.count(`O valor de x é: ${x}, contagem`)
console.count(`O valor de x é: ${x}, contagem`)
console.count(`O valor de x é: ${x}, contagem`)

//Variável entre string
console.log('O nome é %s, ele é programador', y)

//Limpar o console
setTimeout(() => {
    console.clear()
}, 2000)