var Moises = document.getElementById("1")
var nombrePersona = document.getElementById("nombrePersona")
var listaNombres = document.getElementById("listaNombres")
var listaSkills = document.getElementById("listaSkills")
var usuarios = document.getElementById("usuarios")
var informacion = document.getElementById("informacion")
var personal = document.getElementById("desc_personal")
var profesional = document.getElementById("desc_profesional")
var formulario = document.getElementById("formulario")
var controlador = document.getElementById("controlador")
var modals = document.getElementById("modals")
var formActualizar = document.getElementById("formActualizar")
var formSkill = document.getElementById("formSkill")
var direccion = document.getElementById("direccion")

// Funcion para mostrar los nombres al iniciar la página
function mostrarNombres() {
    fetch("https://foro-semana-3.herokuapp.com/persona")
    .then(rpta => {
        return rpta.json()
    })
    .then(data => {
        var personas = data.Content
        var contenido = ''
        for (let index = 0; index < personas.length; index++) {
            temporal = `<a class="nav-link nombres" href="" id="${personas[index].id}">${personas[index].nombre}</a>`
            contenido = contenido + temporal
        }
        listaNombres.innerHTML = contenido
    })
    .catch(err => {
        console.log(err)
    })
}
mostrarNombres()

// Funcion para traer los datos de una persona por su ID y reemplazar los datos en los elementos escogidos
function informacionPersonal(numero){
    let datos = ''

    fetch(`https://foro-semana-3.herokuapp.com/persona/${numero}`)
    .then(rpta => {
        return rpta.json()
    })
    .then(dats => {
        datos = dats.Content
        // console.log(datos)
        nombrePersona.innerHTML = datos.nombre
        informacion.innerHTML = `<p class="mx-2">${datos.puesto}</p><p class="mx-2">${datos.telefono}</p><p class="mx-2">${datos.email}</p>`
        personal.innerHTML = datos.desc_personal
        profesional.innerHTML = datos.desc_profesional
        controlador.innerHTML = datos.id
        direccion.innerHTML = datos.direccion
    })
    .catch(error => {
        console.log(error)
    })
}

// Funcion para traer las Skills de una persona por su ID y mostrarlas en el porfalio
function ponerSkills(numero) {
    fetch(`https://foro-semana-3.herokuapp.com/skill/${numero}`)
    .then(rptas => {
        return rptas.json()
    })
    .then(datss => {
        let skils = datss.Content
        let contenido = ''
        let contenidomodal = ''
        for (let index = 0; index < skils.length; index++) {

            let temp = `<div class="col-md-6 col-lg-4 mb-5">
                        <div class="portfolio-item mx-auto" data-toggle="modal" data-target="#portfolioModal${skils[index].id}">
                            <div class="portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100">
                                <div class="portfolio-item-caption-content text-center text-white">Detalles</i></div>
                            </div>
                            <div class="img-fluid d-flex justify-content-center">
                                <img src="${skils[index].url}" alt="${skils[index].nombre}" style="width: 200px; height: 200px;object-fit: contain">
                            </div>
                            <!-- <img class="img-fluid" src="assets/img/portfolio/cabin.png" alt="" /> -->
                        </div>
                    </div>`

            let tempmodal = `<div class="portfolio-modal modal fade" id="portfolioModal${skils[index].id}" tabindex="-1" role="dialog" aria-labelledby="portfolioModal${skils[index].id}Label" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                    </button>
                    <div class="modal-body text-center">
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-lg-8">
                                    <!-- Portfolio Modal - Title-->
                                    <h2 class="portfolio-modal-title text-secondary text-uppercase mb-0" id="portfolioModal${skils[index].id}Label">${skils[index].nombre}</h2>
                                    <!-- Icon Divider-->
                                    <div class="divider-custom">
                                        <div class="divider-custom-line"></div>
                                        <div class="divider-custom-icon"><i class="fas fa-star"></i></div>
                                        <div class="divider-custom-line"></div>
                                    </div>
                                    <!-- Portfolio Modal - Text-->
                                    <p class="mb-2">${skils[index].descripcion}</p>
                                    <p class="mb-0">${skils[index].valoracion}</p>
                                    <meter min="0" max="5" value="${skils[index].valoracion}" style="width: 200px; height: 50px"></meter>
                                    <br/>
                                    <button class="btn btn-primary" data-dismiss="modal">
                                        <i class="fas fa-times fa-fw"></i>
                                        Cerrar detalle
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

            contenido = contenido + temp
            contenidomodal = contenidomodal + tempmodal
        }
        listaSkills.innerHTML = contenido
        modals.innerHTML = contenidomodal
    })
}

// Mostrar la informacion según el usuario que de click
listaNombres.addEventListener("click", e => {
    e.preventDefault()
    numero = e.target.id

    informacionPersonal(numero)
    ponerSkills(numero)
})

// Enviar una peteicion POST de SOLICITUD
formulario.addEventListener("submit", e => {
    e.preventDefault()

    let persona = controlador.innerHTML

    if (persona == 0) {
        alert('Por favor seleccione un portafolio')
    }else{
        let objConsulta = {
            nombre : formulario["nombre"].value,
            email : formulario["email"].value,
            telefono : formulario["telefono"].value,
            mensaje : formulario["mensaje"].value,
            person_id : controlador.innerHTML
        }
    
        let config = {
            method : 'POST',
            body : JSON.stringify(objConsulta),
            headers : {'Content-Type':'application/json'}
        }
        fetch('https://foro-semana-3.herokuapp.com/solicitudes', config)
        .then(rpta => {
            return rpta.json()
        })
        .then(creacion => {
            // console.log(creacion)
        })
        .catch(err => {
            console.log(err)
        })
    }
})

// Actualizar el personal y profesional
formActualizar.addEventListener("submit", e => {
    e.preventDefault()

    let numero = controlador.innerHTML
    let personal = formActualizar["desc_personal"].value
    let profesional = formActualizar["desc_profesional"].value

    if (personal == "" && profesional == "") {
        alert("Debe rellenar al menos un campo")
    } else {
        let objActualizar = {
            "desc_personal":personal,
            "desc_profesional":profesional
        }

        let config = {
            method : 'PUT',
            body : JSON.stringify(objActualizar),
            headers : {'Content-Type':'application/json'}
        }
        fetch(`https://foro-semana-3.herokuapp.com/persona/${numero}`, config)
        .then(rpta => {
            return rpta.json()
        })
        .then(creacion => {
            informacionPersonal(numero)
        })
        .catch(err => {
            console.log(err)
        })
    }
})

// Insertar una Skill segun el ID de la persona y se actualiza
formSkill.addEventListener("submit", e => {
    e.preventDefault()

    let numero = controlador.innerHTML

    if (numero == "0") {
        alert('Primero escoja un portafolio')
    } else {
        let objSkill = {
            "nombre":formSkill["nombre"].value,
            "valoracion":formSkill["valoracion"].value,
            "url":formSkill["url"].value,
            "person_id":numero,
            "descripcion":formSkill["descripcion"].value
        }

        let config = {
            method : 'POST',
            body : JSON.stringify(objSkill),
            headers : {'Content-Type':'application/json'}
        }
        fetch(`https://foro-semana-3.herokuapp.com/skill`, config)
        .then(rpta => {
            return rpta.json()
        })
        .then(creacion => {
            ponerSkills(numero)
        })
        .catch(err => {
            console.log(err)
        })
    }
})