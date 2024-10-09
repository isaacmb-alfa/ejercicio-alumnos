import { Alumno, UI, AlmacenarAlumnos } from "./app.js";


const formulario = document.getElementById('registroForm');
const nombre = document.getElementById('nombre');
const apellidoPaterno = document.getElementById('apellidoPaterno');
const apellidoMaterno = document.getElementById('apellidoMaterno');
const edad = document.getElementById('edad');
const tablaAlumnos = document.getElementById('tablaAlumnos');

let ui = new UI;

if (formulario) {
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        ui.limpiarHTMLmensajes();
        if (!nombre.value || !apellidoPaterno.value || !apellidoMaterno.value || !edad.value) {
            ui.imprimirMensaje('error', 'Todos los campos son obligatorios');
            ui.borrarNotificación();
            return;
        }
        let idUnic = Date.now();
        const alumno = new Alumno(idUnic, nombre.value, apellidoPaterno.value, apellidoMaterno.value, edad.value);
        const guardarAlumno = new AlmacenarAlumnos();
        guardarAlumno.agregarAlumno(alumno);
        ui.imprimirMensaje('exito', 'Alumno guardado correctamente');
        ui.borrarNotificación();
        imprimirAlumnos();
        formulario.reset();



    });
}

function imprimirAlumnos() {
    limpiarHTMLTabla();
    if (JSON.parse(localStorage.getItem('alumnos'))) {
        let alumnos = JSON.parse(localStorage.getItem('alumnos'));
        alumnos.forEach((alumno, index) => {
            const { nombre, id, apellidoPaterno, apellidoMaterno, edad } = alumno;
            const rowAlumno = document.createElement('tr');
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger');
            btnBorrar.innerHTML = 'Eliminar';

            rowAlumno.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${nombre}</td>
                <td>${apellidoPaterno}</td>
                <td>${apellidoMaterno}</td>
                <td>${edad} años</td>
                <td></td>
          `;
            // tablaAlumnos.firstChild.lastChild.appendChild(btnBorrar);
            btnBorrar.onclick = () => {
                eliminarAlumno(id);
            }
            //seleccionamos el último td
            const lastTd = rowAlumno.querySelector('td:last-child');
            lastTd.appendChild(btnBorrar);

            tablaAlumnos.appendChild(rowAlumno);

        });

    }
}
imprimirAlumnos();

function limpiarHTMLTabla() {
    while (tablaAlumnos.firstChild) {
        tablaAlumnos.removeChild(tablaAlumnos.firstChild);
    }
}

function eliminarAlumno(id) {
    let alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
    if (alumnos) {
        let nuevosAlumnos = alumnos.filter((alumno) => alumno.id !== id);
        const alumnosFiltrados = new AlmacenarAlumnos();
        alumnosFiltrados.guardarAlumnosFiltrados(nuevosAlumnos);
    }
    imprimirAlumnos();
}
