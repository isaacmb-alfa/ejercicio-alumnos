import { Alumno } from "./app.js";
const listadoAlumnos = document.getElementById('tablaMateriasAlumnos');
const selectAlumnos = document.getElementById('alumnosInscritosSelect');
const alumnoMostrar = document.getElementById('alumnoSeleccionado');
const materiasSelect = document.getElementById('materias');
const formMaterias = document.getElementById('materiasForm');
const cards = document.getElementById('cards');

//variables locales
let alumnoSelect = null;

//AdeventListerner
document.addEventListener('DOMContentLoaded', () => {
    llenarAlumnosSelect();
    llenarMaterias();
})
class AsignarMaterias {
    constructor() {
        this.materias = this.cargarMaterias();
        this.alumnos = this.cargarAlumnos();
    }
    cargarMaterias() {
        const materiasAgregadas = JSON.parse(localStorage.getItem('materias')) || [];
        return materiasAgregadas;
    }
    cargarAlumnos() {
        const alumnosAlmacenados = JSON.parse(localStorage.getItem('alumnos'));
        return alumnosAlmacenados ? alumnosAlmacenados.map(alumno => {
            const nuevoAlumno = Object.assign(Object.assign(new Alumno(alumno.id, alumno.nombre, alumno.apellidoPaterno, alumno.apellidoMaterno, alumno.edad), alumno));
            return nuevoAlumno;
        }) : [];
    }
    guardarAlumnos() {
        localStorage.setItem('alumnos', JSON.stringify(this.alumnos.map(alumno => alumno.toPlainObject())));
    }
    asignarMateria(alumnoId, materia) {
        const alumno = this.alumnos.find(alumno => alumno.id === alumnoId);
        if (alumno) {
            alumno.inscribirMateria(materia);
            this.guardarAlumnos();
        } else {
            console.error(`Alumno con ID ${alumnoId} no encontrado.`);
        }
    }
    asignarCalificacion(alumnoId, materia, calificacion) {
        const alumno = this.alumnos.find(alumno => alumno.id === alumnoId);
        if (alumno) {
            alumno.asignarCalificacion(materia, calificacion);
            this.guardarAlumnos();
        } else {
            console.error(`Alumno con ID ${alumnoId} no encontrado.`);
        }
    }
}

const ui = new AsignarMaterias();
function imprimirAlumnos() {
    limpiarHTMLCards();
    const materias = ui.materias;
    const alumnos = ui.alumnos;

    alumnos.forEach((alumno) => {
        const { id, nombre, apellidoPaterno, apellidoMaterno, materiasInscritas, calificaciones } = alumno;
        const divCard = document.createElement('div');
        divCard.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${nombre} ${apellidoPaterno} ${apellidoMaterno}</h5>
                <h6 class="card-subtitle my-3 text-body-secondary"> Materias Inscritas <span>${materiasInscritas.length}</span></h6>
                <div class="card-footer">
                    <ul id="materiasInscritas${id}" class="list-group list-group-flush">
                        <div class="row">
                        ${materiasInscritas.map(materia => {
                            let calificacion = calificaciones[materia.id];
                            return `<li class="list-group-item d-flex justify-content-between align-items-center">${materia.nombre} <span class="border border-secondary rounded p-1">${calificacion !== undefined ? calificacion : 'Sin calificación'}</span> <span><button class="btn btn-danger btn-sm boton-eliminar" data-alumno-id="${id}" data-materia-id="${materia.id}">X</button></span></li>`;
                        }).join('')}
                        </div>
                    </ul>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm" id="botonPromedio">Promedio</button> <span class="col ms-5 border border-secondary rounded p-1 text-end" id="alumnoID${id}">0</span>
                </div>
            </div>      
        </div>
        `;
        cards.appendChild(divCard);
        //Eliminar materia 
        const botonesEliminar = document.querySelectorAll('.boton-eliminar');
        
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const alumnoId = e.currentTarget.getAttribute('data-alumno-id');
                const materiaId = e.currentTarget.getAttribute('data-materia-id');
                console.log(alumnoId, materiaId);
                eliminarMateria(alumnoId, materiaId);
            });
        });
        const botonPromedio = divCard.querySelector('#botonPromedio');

        botonPromedio.onclick = () =>{
            console.log(id);
            let promedio =  calcularPromedio(id);
            
            botonPromedio.nextElementSibling.textContent = promedio.toFixed(1);
        }
    });
}
imprimirAlumnos();

function llenarAlumnosSelect() {
    const alumnos = ui.alumnos;
    if (alumnos) {
        alumnos.forEach((alumno) => {
            const { id, nombre, apellidoPaterno, apellidoMaterno } = alumno;
            const valorSelect = document.createElement('option');
            valorSelect.value = id;
            valorSelect.innerHTML = `${apellidoPaterno}-${apellidoMaterno}-${nombre}`;
            selectAlumnos.querySelector('select').appendChild(valorSelect);
        });
    }
}
selectAlumnos.querySelector('select').addEventListener('change', (e) => {
    const alumnos = ui.alumnos;
    let alumnoSeleccionado = Number(e.target.value);
    let alumnoFiltrado = alumnos.filter((alumno) => {
        return alumno.id == alumnoSeleccionado;
    });

    if (!alumnoFiltrado[0]) {
        alumnoMostrar.innerHTML = `<p class="me-2">Sleccione un Alumno para asignar materia</p>`;
        return;
    }
    const { id, nombre, apellidoPaterno, apellidoMaterno, edad } = alumnoFiltrado[0];
    alumnoMostrar.innerHTML = `
            <p class="me-2">${id}</p>
            <p class="me-2">${nombre}</p>
            <p class="me-2">${apellidoPaterno}</p>
            <p class="me-2">${apellidoMaterno}</p>
            <p class="me-2">${edad} años</p>  
    `;


    alumnoActivo(alumnoFiltrado[0]);

});
function alumnoActivo(alumno) {
    alumnoSelect = alumno;
    return alumnoSelect;
}
// console.log(ui.alumnos);

function llenarMaterias() {
    const materias = ui.materias;
    if (materias) {
        materias.forEach((materia) => {
            const { id, nombre } = materia;
            const valorSelect = document.createElement('option');
            valorSelect.value = id;
            valorSelect.innerHTML = `${nombre}`;
            materiasSelect.querySelector('select').appendChild(valorSelect);
        });
    }
};

formMaterias.addEventListener('submit', (e) => {
    e.preventDefault();
    const calificacion = document.getElementById('calificacion');
    const calificacionN = Number(calificacion.value);
    if (isNaN(calificacionN)) {
        console.log('Introduce solo valores numericos en el campo calificación');
        return;
    }
    const materiaSelec = ui.materias.find(materia => {
        return materia.id === e.target[0].value
    });
    ui.asignarMateria(alumnoSelect.id, materiaSelec);
    ui.asignarCalificacion(alumnoSelect.id, materiaSelec.id, calificacionN);
    imprimirAlumnos();

});
function calcularPromedio(idAlumno){
    const alumnoFiltrado = ui.alumnos.filter(alumno => alumno.id ===idAlumno);
    if(alumnoFiltrado){
        const calificaciones = Object.values(alumnoFiltrado[0].calificaciones);
        const suma = calificaciones.reduce((a, b) => a + b, 0);
        const promedio = calificaciones.length ? suma / calificaciones.length : 0;
        // console.log(promedio);
        return promedio;
        
    }
}
function eliminarMateria(alumnoID, materiaID){
    
    const asignarMaterias = new AsignarMaterias();
    const alumno = asignarMaterias.alumnos.find(alumno => alumno.id === Number(alumnoID));
    if(alumno){
        //eliminar materia
        alumno.materiasInscritas = alumno.materiasInscritas.filter(materia => materia.id !== materiaID);
        // eliminar calificacion asociada a la materia
        delete alumno.calificaciones[materiaID];
        asignarMaterias.guardarAlumnos();
        imprimirAlumnos();
    }
}

function limpiarHTMLCards(){
    while (cards.firstChild) {
      cards.removeChild(cards.firstChild);
    }
}