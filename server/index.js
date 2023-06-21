const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
const port = 8000
const cors = require('cors')
//const mysql = require('mysql2')
const mysql = require('mysql2/promise')

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


app.post('/registro', async (req, res) => {

    const nombre = req.body["nombre"]
    const contra = req.body["contra"]
    const espublico = req.body["espublico"]

    if (!nombre || !contra) {
        console.log(nombre + contra)

        res.sendStatus(400)

    } else {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            //password: ''
            database: 'master',
            port: 8001,
            // multipleStatements: true (esto es para poder realizar más de una sentencia)
        })

        //const connection = await mysql.createConnection({
        //    host: 'localhost',
        //    user: 'root',
        //    //password: ''
        //    database: 'master',
        //    port: 8001
        //})

        /*

        connection.query("SELECT * FROM `usuario`", (err, results, fields) =>{
            console.log(err)
            console.log("---------")
            console.log(results)
            console.log("---------")
            console.log(fields)
    
            connection.end()
        })*/

        /* 
            - COMPRUEBO SI UN USUARIO EXISTE
            - SI NO EXISTE INTRODUZCO EL USUARIO
            - DEVUELVO UNA LISTA DE TODOS LOS USUARIOS
        */

        //E J E M P L O   C O N   C A L L B A C K S
        connection.query(`SELECT * FROM usuario WHERE nombre = ? AND espublico = ?;`, [nombre, 1], (err, results) => {
            if (err) throw new Error()

            if (results.length === 0) {
                // Introduzco el usuario
                connection.query("INSERT INTO `usuario` (nombre, pass) VALUES (?,?)", [nombre, contra], (err, results) => {
                    if (err) throw new Error()

                    console.log(results)

                    connection.query(`SELECT * FROM usuario`, [username], (err, results) => {
                        if (err) throw new Error()

                        console.log(results)
                    })
                })
            }
        })


        // E J E M P L O   C O N   P R O M E S A S
        //const usuarioExiste = await connection.execute(`SELECT * FROM usuario WHERE nombre = ? AND espublico = 1;`, [nombre]);
        //console.log(usuarioExiste)
        //
        //const insercion = await connection.execute(`INSERT INTO usuario (nombre, pass, espublico) VALUES (?,?,?)`, [nombre, contra, espublico]);
        //console.log(insercion)
        //
        //
        //const usuariosNuevos = await connection.execute(`SELECT * FROM usuario`);
        //console.log(usuariosNuevos)



        // ESTO ES SOLO PARA APRENDER, ES VULNERABLE A SQL INJECTION
        //console.log("INSERT INTO `usuario` (nombre, pass) VALUES ('" + nombre + "', '" + contra + "') ")
        //connection.query("INSERT INTO `usuario` (nombre, pass) VALUES ('" + nombre + "', '" + contra + "') ", (err, results, fields) => {
        //    console.log(err)
        //    console.log(results)
        //})

        //connection.query(`SELECT * FROM usuario WHERE espublico = 1;`, (err, results) => {
        //    console.log(err)
        //    console.log(results)
        //})

        //connection.query("INSERT INTO `usuario` (nombre, pass, espublico) VALUES (?,?,?)", [nombre, contra, espublico], (err, results) => {
        //    console.log(err)
        //    console.log(results)
        //})

        res.sendStatus(200);
    }
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




async function abrirConex() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'master',
        port: 8001,
    })

    return connection
}

app.get('/crud/:id', async (req, res) => {

    const connection = await abrirConex()

    const id = req.params["id"]

    const [usuarios, fields] = await connection.execute("SELECT * FROM `usuario` WHERE id = ?", [id])

    res.status(200).send({
        usuario: usuarios[0]
    })

    await connection.end()
})


app.post('/crud', async (req, res) => {
    const connection = await abrirConex()

    const nombre = req.body["nombre"]
    const contra = req.body["contra"]
    const email = req.body["email"]
    const espublico = Boolean(req.body["espublico"])

    const regex = /(\w+)@(\w+).(\w+)/

    const isValidNombre = nombre.length < 20 && nombre.length > 0
    const isValidContra = contra.length < 20 && contra.length > 0
    const isValidMail = regex.test(email) && email.length < 20 && email.length > 0

    if (!isValidNombre || !isValidContra || !isValidMail) {
        res.sendStatus(400)

    } else {
        await connection.execute("INSERT INTO `usuario`(nombre,pass,email,espublico) VALUES(?,?,?,?)", [nombre, contra, email, espublico])

        res.sendStatus(201)

        await connection.end()
    }

})

app.put('/crud', async (req, res) => {
    const connection = await abrirConex()


    await connection.end()

})

app.delete('/crud', async (req, res) => {
    const connection = await abrirConex()


    await connection.end()

})




app.listen(port, () => {
    console.log(`APP de prueba escuchando en el puerto ${port}`)
})