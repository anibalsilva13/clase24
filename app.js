// Elementos del DOM

const formTarea =
    document.getElementById("formTarea");

const tareaId =
    document.getElementById("tareaId");

const nombreTarea =
    document.getElementById("nombreTarea");

const descripcionTarea =
    document.getElementById("descripcionTarea");

const listaTareas =
    document.getElementById("listaTareas");

const totalTareas =
    document.getElementById("totalTareas");

const sinTareas =
    document.getElementById("sinTareas");

const tituloSinTareas =
    document.getElementById("tituloSinTareas");

const textoSinTareas =
    document.getElementById("textoSinTareas");

const buscarTarea =
    document.getElementById("buscarTarea");

const btnGuardar =
    document.getElementById("btnGuardar");

const btnCancelar =
    document.getElementById("btnCancelar");

const tituloFormulario =
    document.getElementById("tituloFormulario");

const errorNombre =
    document.getElementById("errorNombre");

const errorDescripcion =
    document.getElementById("errorDescripcion");

const contadorDescripcion =
    document.getElementById("contadorDescripcion");


const STORAGE_KEY = "tareasAlumnos";

let tareas = obtenerTareas();


renderizarTareas();

actualizarContadorDescripcion();


// Eventos principales

formTarea.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();

        guardarTarea();

    }
);


buscarTarea.addEventListener(
    "input",
    renderizarTareas
);


btnCancelar.addEventListener(
    "click",
    limpiarFormulario
);


descripcionTarea.addEventListener(
    "input",
    actualizarContadorDescripcion
);


listaTareas.addEventListener(
    "click",
    function (evento) {

        const boton =
            evento.target.closest(
                "button[data-accion]"
            );


        if (!boton) {
            return;
        }


        const { id, accion } =
            boton.dataset;


        if (accion === "editar") {
            editarTarea(id);
        }


        if (accion === "eliminar") {
            eliminarTarea(id);
        }

    }
);


// Crear o actualizar tarea

function guardarTarea() {

    limpiarErrores();


    const nombre =
        nombreTarea.value.trim();

    const descripcion =
        descripcionTarea.value.trim();


    if (!validarFormulario(nombre, descripcion)) {
        return;
    }


    if (tareaId.value) {

        actualizarTarea(
            tareaId.value,
            nombre,
            descripcion
        );

        return;
    }


    crearTarea(nombre, descripcion);

}


function crearTarea(nombre, descripcion) {

    const nuevaTarea = {

        id: generarId(),

        nombre,

        descripcion,

        fechaCreacion:
            new Date().toISOString()

    };


    tareas.unshift(nuevaTarea);

    guardarTareas();

    renderizarTareas();

    limpiarFormulario();

}


// Renderizado

function renderizarTareas() {

    listaTareas.innerHTML = "";

    totalTareas.textContent =
        tareas.length;


    const textoBusqueda =
        buscarTarea.value
            .trim()
            .toLowerCase();


    const tareasFiltradas =
        tareas.filter(
            function (tarea) {

                return (
                    tarea.nombre
                        .toLowerCase()
                        .includes(textoBusqueda)

                    ||

                    tarea.descripcion
                        .toLowerCase()
                        .includes(textoBusqueda)
                );

            }
        );


    actualizarEstadoVacio(
        tareasFiltradas,
        textoBusqueda
    );


    tareasFiltradas.forEach(
        function (tarea, indice) {

            listaTareas.appendChild(
                crearFilaTarea(
                    tarea,
                    indice
                )
            );

        }
    );

}


function crearFilaTarea(tarea, indice) {

    const fila =
        document.createElement("tr");


    fila.innerHTML = `

        <td>
            ${indice + 1}
        </td>

        <td>
            <span class="nombre-tarea-tabla">
                ${escaparHTML(tarea.nombre)}
            </span>
        </td>

        <td>
            ${escaparHTML(tarea.descripcion)}
        </td>

        <td>

            <div class="acciones-tabla">

                <button
                    type="button"
                    class="btn-editar"
                    data-accion="editar"
                    data-id="${tarea.id}"
                >
                    Editar
                </button>

                <button
                    type="button"
                    class="btn-eliminar"
                    data-accion="eliminar"
                    data-id="${tarea.id}"
                >
                    Eliminar
                </button>

            </div>

        </td>

    `;


    return fila;

}


// Edición

function editarTarea(id) {

    const tarea =
        tareas.find(
            tarea => tarea.id === id
        );


    if (!tarea) {
        return;
    }


    tareaId.value =
        tarea.id;

    nombreTarea.value =
        tarea.nombre;

    descripcionTarea.value =
        tarea.descripcion;


    tituloFormulario.textContent =
        "Editar tarea";

    btnGuardar.textContent =
        "Actualizar tarea";

    btnCancelar.classList.remove(
        "hidden"
    );


    actualizarContadorDescripcion();

    limpiarErrores();

    nombreTarea.focus();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function actualizarTarea(
    id,
    nombre,
    descripcion
) {

    const indice =
        tareas.findIndex(
            tarea => tarea.id === id
        );


    if (indice === -1) {
        return;
    }


    tareas[indice] = {

        ...tareas[indice],

        nombre,

        descripcion,

        fechaActualizacion:
            new Date().toISOString()

    };


    guardarTareas();

    renderizarTareas();

    limpiarFormulario();

}


// Eliminación

function eliminarTarea(id) {

    const tarea =
        tareas.find(
            tarea => tarea.id === id
        );


    if (!tarea) {
        return;
    }


    const confirmar =
        window.confirm(
            `¿Desea eliminar la tarea "${tarea.nombre}"?`
        );


    if (!confirmar) {
        return;
    }


    tareas =
        tareas.filter(
            tarea => tarea.id !== id
        );


    guardarTareas();

    renderizarTareas();


    if (tareaId.value === id) {
        limpiarFormulario();
    }

}


// Validaciones

function validarFormulario(
    nombre,
    descripcion
) {

    let valido = true;


    if (!nombre) {

        mostrarError(
            errorNombre,
            "El nombre de la tarea es obligatorio."
        );

        valido = false;

    }

    else if (nombre.length < 3) {

        mostrarError(
            errorNombre,
            "El nombre debe contener al menos 3 caracteres."
        );

        valido = false;

    }


    if (!descripcion) {

        mostrarError(
            errorDescripcion,
            "La descripción es obligatoria."
        );

        valido = false;

    }

    else if (descripcion.length < 5) {

        mostrarError(
            errorDescripcion,
            "La descripción debe contener al menos 5 caracteres."
        );

        valido = false;

    }


    return valido;

}


function mostrarError(
    elemento,
    mensaje
) {

    elemento.textContent = mensaje;

    elemento.classList.remove(
        "hidden"
    );

}


function limpiarErrores() {

    errorNombre.textContent = "";

    errorDescripcion.textContent = "";


    errorNombre.classList.add(
        "hidden"
    );

    errorDescripcion.classList.add(
        "hidden"
    );

}


// Interfaz

function limpiarFormulario() {

    formTarea.reset();

    tareaId.value = "";


    tituloFormulario.textContent =
        "Registrar tarea";

    btnGuardar.textContent =
        "Guardar tarea";

    btnCancelar.classList.add(
        "hidden"
    );


    limpiarErrores();

    actualizarContadorDescripcion();

    nombreTarea.focus();

}


function actualizarContadorDescripcion() {

    contadorDescripcion.textContent =
        `${descripcionTarea.value.length} / 300`;

}


function actualizarEstadoVacio(
    tareasFiltradas,
    textoBusqueda
) {

    if (tareasFiltradas.length > 0) {

        sinTareas.classList.add(
            "hidden"
        );

        return;

    }


    sinTareas.classList.remove(
        "hidden"
    );


    if (
        tareas.length > 0
        &&
        textoBusqueda
    ) {

        tituloSinTareas.textContent =
            "No se encontraron resultados";

        textoSinTareas.textContent =
            "Intentá realizar la búsqueda con otro término.";

        return;

    }


    tituloSinTareas.textContent =
        "No existen tareas registradas";

    textoSinTareas.textContent =
        "Agregá tu primera tarea utilizando el formulario.";

}


// LocalStorage

function guardarTareas() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tareas)
    );

}


function obtenerTareas() {

    const datos =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (!datos) {
        return [];
    }


    try {

        const tareasGuardadas =
            JSON.parse(datos);


        return Array.isArray(
            tareasGuardadas
        )
            ? tareasGuardadas
            : [];

    }

    catch (error) {

        console.error(
            "Error al recuperar las tareas:",
            error
        );

        return [];

    }

}


// Utilidades

function generarId() {

    if (
        typeof crypto !== "undefined"
        &&
        typeof crypto.randomUUID === "function"
    ) {

        return crypto.randomUUID();

    }


    return Date.now().toString();

}


function escaparHTML(texto) {

    return String(texto)

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}