class Usuario {
    constructor(nombre, apellidos, password, email, repEmail) {
        this.nombre = nombre
        this.apellidos = apellidos
        this.password = password
        this.email = email
        this.repEmail = repEmail
    }
}

class ErrorGen {
    constructor(codigo, motivo) {
        this.codigo = codigo
        this.motivo = motivo
    }
}

class Validador {
    validar(usuario) {
        if (usuario.nombre.length > 10 || usuario.nombre.length < 0) {
            return new ErrorGen(1, "El nombre no es válido");
        }
        if (usuario.apellidos.length > 10 || usuario.apellidos.length < 0) {
            return new ErrorGen(2, "El apellido no es válido");
        }
        if (usuario.password.length <= 0 || usuario.password.length > 8) {
            return new ErrorGen(3, "La contraseña no es valida");
        }
        if (usuario.email != usuario.repEmail) {
            return new ErrorGen(4, "El correo introducido no coincide");
        }

        return ErrorGen(0, "-")
    }

    validarTodos(usuario) {
        let errores = []
        if (usuario.nombre.length > 10 || usuario.nombre.length < 0) {
            errores.push(new ErrorGen(1, "El nombre no es válido"))
        }
        if (usuario.apellidos.length > 10 || usuario.apellidos.length < 0) {
            errores.push(new ErrorGen(2, "El apellido no es válido"))
        }
        if (usuario.password.length <= 0 || usuario.password.length > 8) {
            errores.push(new ErrorGen(3, "La contraseña no es valida"))
        }
        if (usuario.email !== usuario.repEmail) {
            errores.push(new ErrorGen(4, "El correo introducido no coincide"))
        }

        return errores
    }

    loginUser(){
        let errores = []
        if (user.value != user){
            errores.push(new ErrorGen(5, "Usuario no válido"))
        }
        if (pass.value != pass){
            errores.push(new ErrorGen(6, "Contraseña incorrecta"))
        }
    }
}

// Comenzamos con el formulario
window.addEventListener("load", () => {

    let form_register = document.getElementById("form_register")

    form_register.addEventListener("submit", (validacion) => {
        validacion.preventDefault()
        let alertBox = document.getElementById("alertbox")
        let alertBoxLogin = document.getElementById("alertboxLogin")

        let inputNombre = document.getElementsByName("nombre")[0]
        let inputApellidos = document.getElementsByName("apellidos")[0]
        let inputContra = document.getElementsByName("contra")[0]
        let inputEmail = document.getElementsByName("email")[0]
        let inputRepEmail = document.getElementsByName("repemail")[0]

        let nombre = inputNombre.value
        let apellidos = inputApellidos.value
        let contra = inputContra.value
        let email = inputEmail.value
        let repEmail = inputRepEmail.value

        let user = document.getElementById("user")
        let pass = document.getElementById("pass")

        const usuario = new Usuario(nombre, apellidos, contra, email, repEmail)
        const validador = new Validador()

        let errores = validador.validarTodos(usuario)

        // Comenzamos la validación
        if (errores.length === 0) {
            console.log("hola")
            fetch("http://localhost:8000", {
                method: "POST",
                body: JSON.stringify({
                    user: {
                        nombre: usuario.nombre,
                        apellidos: usuario.apellidos,
                        password: usuario.password,
                        email: usuario.email,
                        repEmail: usuario.repEmail
                    }
                }),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "same-origin"
            }).then(function (response) {
                response.json().then((data) => {
                    console.log(data.id)
                })
            }).catch(function (error) {
                console.warn(error)
            })

        } else {
            console.log("hola")
            for (result of errores) {
                switch (result.codigo) {
                    case 1:
                        alertBox.innerHTML = result.motivo
                        alertBox.style.transform = "translateY(40px)"
                        inputNombre.value = ""
                        break;
                    case 2:
                        alertBox.innerHTML = result.motivo
                        alertBox.style.transform = "translateY(40px)"
                        inputApellidos.value = ""
                        break;
                    case 3:
                        alertBox.innerHTML = result.motivo
                        alertBox.style.transform = "translateY(40px)"
                        inputContra.value = ""
                        break;
                    case 4:
                        alertBox.innerHTML = result.motivo
                        alertBox.style.transform = "translateY(40px)"
                        inputEmail.value = ""
                        inputRepEmail.value = ""
                        break;
                    case 5:
                        alertBoxLogin.innerHTML = result.motivo
                        alertBox.style.transform = "translateY(40px)"
                        user.value = ""
                        break;
                    case 6:
                        alertBoxLogin.innerHTML = result.motivo
                        alertBox.style.transform = "translateY(40px)"
                        pass.value = ""
                        break;

                }
            }

            setTimeout(() => {
                alertBox.style.transform = "translateY(100px)"
            }, 5000);
        }

    })

    let form_login = document.getElementById("form_login")

    form_login.addEventListener("submit", (evento) => {
        evento.preventDefault()

        let user = document.getElementById("user").value
        let pass = document.getElementById("pass").value

        fetch("http://localhost:8000/login", {
            method: "POST",
            body: JSON.stringify({
                user: user,
                pass: pass
            }),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin"
        }).then(function(response) {
            response.json().then((data) => {
                console.log(data)
            }).catch(function(error){
                console.warn(error)
            })
        })
    })

    let acceso = document.getElementById("acceso")

    acceso.addEventListener("click", (ev) => {
        fetch("http://localhost:8000/acceso", {
            method: "GET",
            credentials: "same-origin"
        }).then(function(response) {
            response.json().then((data) => {
                console.log(data.message)
            }).catch(function(error){
                console.warn(error)
            })
        })
    })
})