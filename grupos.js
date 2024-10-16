import { CargarLocal } from "./app.js";

const listadoAlumnos = document.getElementById('listadoAlumnos');
const selectAlumnos = document.getElementById('alumnosInscritosSelect');
const gruposSelect = document.getElementById('gruposSelect');
const alumnoMostrar = document.getElementById('alumnoSeleccionado');
const cards = document.getElementById('cards');
const alumnosNoAsignados = document.getElementById('alumnosNoAsignados');

//variables locales
let alumnoSelect = null;

class ActualizarAlumnos {
    constructor() {
        this.alumnosArray = this.cargarAlumnos();
    }
    llenarAlumnosLocal() {
        if (this.alumnosArray) {
            let alumnos = this.alumnosArray;
            alumnos.forEach((alumno) => {
                const { id, nombre, apellidoPaterno, apellidoMaterno } = alumno;
                const valorSelect = document.createElement('option');
                valorSelect.value = id;
                valorSelect.innerHTML = `${apellidoPaterno}-${apellidoMaterno}-${nombre}`;
                selectAlumnos.querySelector('select').appendChild(valorSelect);
            });
        }
    }
    cargarAlumnos() {
        const alumnosGuardados = localStorage.getItem('alumnos');
        return alumnosGuardados ? JSON.parse(alumnosGuardados) : [];
    }
    guardarAlumnos() {
        localStorage.setItem('alumnosInscritos', JSON.stringify(this.alumnosArray));
    }
    agregarAlumno(alumno) {
        this.alumnosArray.push(alumno);
        this.guardarAlumnos();
    }
    removerAlumno(id) {
        this.alumnosArray = this.alumnosArray.filter(alumno => alumno.id !== id);
        this.guardarAlumnos();
    }
    contarAlumnosNoAsignados(grupos) {
        const alumnosAsignados = new Set();
        grupos.forEach(grupo => {
            grupo.alumnos.forEach(alumno => {
                alumnosAsignados.add(alumno.id);
            })
        });
        return this.alumnosArray.filter(alumno => !alumnosAsignados.has(alumno.id)).length
    }
}


const alumnosLocal = new ActualizarAlumnos();
alumnosLocal.llenarAlumnosLocal();

function imprimirGrupos() {
    limpiarCardsHTML();
    const gruposLocalStorage = JSON.parse(localStorage.getItem('grupos')) || [];
    gruposLocalStorage.forEach((grupo) => {
        const card = document.createElement('div');
        card.className = 'px-0';
        const { nombre, id, alumnos } = grupo;
        // console.log(nombre, id, alumnos);

        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${nombre}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary"> Alumnos inscritos ${alumnos.length}</h6>
                    <div class="card-footer">
                    <ul id="alumnosInscritos_${id}" class="list-group list-group-flush">
                    </ul>
                    </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm boton-promedio" id="botonPromedio" data-grupo-id="${id}">Promedio</button> <span class="col ms-5 border border-secondary rounded p-1 text-end" id="grupoID${id}">0</span>
                </div>
                </div>      
        </div>
      `;
        cards.appendChild(card);
        const alumnosInscritos = document.getElementById(`alumnosInscritos_${id}`);
        // console.log(grupo.alumnos);
        const botonesPromedio = document.querySelectorAll('.boton-promedio');
        botonesPromedio.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const grupoId = e.currentTarget.getAttribute('data-grupo-id');
                calcularPromedio(grupoId);
            });
        });

        grupo.alumnos.forEach((alumno) => {
            const li = document.createElement('li');
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'btn-sm');
            btnBorrar.innerHTML = 'X';
            li.className = 'list-group-item';
            li.innerHTML = `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno} <span></span>`;
            alumnosInscritos.appendChild(li);
            const span = li.querySelector('span');
            btnBorrar.onclick = () => {
                borrarAlumno(alumno.id, grupo.id);
            }
            span.appendChild(btnBorrar)
        });

    });


}

const cargarGrupos = new CargarLocal();
cargarGrupos.grupos.forEach((grupo) => {

    const option = document.createElement('option');
    option.value = grupo.id;
    option.innerHTML = grupo.nombre;
    if (gruposSelect) {
        gruposSelect.querySelector('select').appendChild(option);
    }

});
document.addEventListener('DOMContentLoaded', () => {
    imprimirGrupos();
});
selectAlumnos.querySelector('select').addEventListener('change', (e) => {
    const alumnos = new ActualizarAlumnos();
    let alumnoSeleccionado = Number(e.target.value);
    let alumnoFiltrado = alumnos.alumnosArray.filter((alumno) => {
        return alumno.id == alumnoSeleccionado;
    });

    if (!alumnoFiltrado[0]) {
        alumnoMostrar.innerHTML = `<p class="me-2">Sleccione un Alumno para asignar grupo</p>`;
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
if (gruposSelect) {
    gruposSelect.addEventListener('submit', (e) => {
        e.preventDefault();
        // console.log(alumnoSelect);
        // console.log(e.target[0].value);
        asignarAGrupo(e);
    });
}

function asignarAGrupo(e) {
    let grupoNuevo = new CargarLocal();
    const gruposLocalStorage = grupoNuevo.grupos;
    const alumnos = new ActualizarAlumnos();
    const yaEstaAsignado = gruposLocalStorage.some(grupo => {
        const alumnoABuscar = grupo.alumnos.some((alumno) => {
            return alumno.id == alumnoSelect.id;
        });
        return alumnoABuscar;
    });
    if (yaEstaAsignado) {
        console.error('El alumno ya está asignado a un grupo');
        return;
    }
    const grupoId = e.target[0].value;
    const grupoSeleccionado = gruposLocalStorage.find(grupo => grupo.id === grupoId);
    if (grupoSeleccionado) {
        grupoSeleccionado.agregarAlumno(alumnoSelect);
        alumnos.removerAlumno(alumnoSelect.id);
        alumnos.guardarAlumnos();

        actualizarGrupos(gruposLocalStorage);
        imprimirGrupos();

        // Actualizar contador de alumnos no asignados
        const noAsignados = alumnos.contarAlumnosNoAsignados(gruposLocalStorage);
        alumnosNoAsignados.textContent = noAsignados;
        // console.log(`Alumnos no asignados: ${noAsignados}`);
    } else {
        console.error('Grupo no encontrado');
    }

}
function actualizarGrupos(gruposAcualizados) {
    localStorage.setItem('grupos', JSON.stringify(gruposAcualizados));
}
function borrarAlumno(idAlumno, idGrupo) {
    const gruposLocalStorage = JSON.parse(localStorage.getItem('grupos')) || [];
    gruposLocalStorage.forEach((grupo) => {
        if (grupo.id === idGrupo) {
            const alumnosFiltrados = grupo.alumnos.filter(alumno => alumno.id !== idAlumno);
            grupo.alumnos = alumnosFiltrados;
        }
    });
    const alumnoEliminar = new ActualizarAlumnos();
    alumnoEliminar.removerAlumno(idAlumno);
    actualizarAlumnosNoAsignados();
    actualizarGrupos(gruposLocalStorage);
    imprimirGrupos();


}
function limpiarCardsHTML() {
    while (cards.firstChild) {
        cards.removeChild(cards.firstChild);
    }
}

function actualizarAlumnosNoAsignados() {
    const alumnos = new ActualizarAlumnos();
    const grupos = new CargarLocal();
    const noAsignados = alumnos.contarAlumnosNoAsignados(grupos.grupos);
    alumnosNoAsignados.textContent = noAsignados;
}
function calcularPromedio(idGrupo) {
    const grupos = new CargarLocal();

    const grupoFiltrado = grupos.grupos.find(grupo => grupo.id === idGrupo);
    if (grupoFiltrado) {
        if (grupoFiltrado.alumnos.length > 0) {
            const promediosAlumnos = grupoFiltrado.alumnos.map(alumno => {

                return alumno.obtenerPromedio();

            });
            const promedioGrupo = promediosAlumnos.reduce((sum, promedio) => sum + promedio, 0) / promediosAlumnos.length;

            const spanPromedio = document.getElementById(`grupoID${idGrupo}`);
            spanPromedio.textContent = promedioGrupo.toFixed(1);
        } else {
            console.log(`El grupo no tiene alumnos incritos`);
        }

    } else {
        console.log(`Grupo con ID ${idGrupo} no encontrado`);
    }
}

actualizarAlumnosNoAsignados();