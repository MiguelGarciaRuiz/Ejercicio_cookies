const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
const port = 8000
const cors = require('cors')

const path = require('path')

app.use(cors())
app.use(bodyParser.json())
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

function validarUsuario(req, res, next) {
    const isLogged = Boolean(req.cookies["isLogged"])

    if (isLogged === true) {
        next()
    } else {
        res.status(403).send("No estás autorizado")
    }
}


app.post('/', (req, res) => {
    console.log(req.body)
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.send("Hola desde un POST")
})
app.get('/', (req, res) => {
    console.log(req.query)
    res.send('Hola con un GET')
})


app.post('/login', (req, res,) => {
    res.setHeader("Access-Control-Allow-Origin", "*")

    const user = req.body["user"]
    const pass = req.body["pass"]

    if (user === "copata" && pass === "fdsa") {
        console.log("YEP")
        res.cookie('isLogged', true, {
            maxAge: Date.now() + 3600,
            domain: "localhost"
        })
        res.sendStatus(200)
    } else {
        console.log("NOP")
        res.status(401).send("No estás autenticado")
    }

})


app.get('/acceso', validarUsuario, (req, res) => {
    res.send({
        message: "ESTÁS DENTRO DEL SITIO SEGURO"
    })
});


app.listen(port, () => {
    console.log(`APP de prueba escuchando en el puerto ${port}`)
})