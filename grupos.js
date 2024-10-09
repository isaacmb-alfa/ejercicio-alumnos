const listadoAlumnos = document.getElementById('listadoAlumnos');
const selectAlumnos = document.getElementById('alumnosInscritosSelect');
const gruposSelect = document.getElementById('gruposSelect');
const alumnoMostrar = document.getElementById('alumnoSeleccionado');
const cards = document.getElementById('cards');

//variables locales
let alumnoSelect = null;

class ActualizarAlumnos {
    constructor() {
        this.alumnosArray = JSON.parse(localStorage.getItem('alumnos')) || [];
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
}
class CargarLocal {
    constructor() {
        this.grupos = this.loadFromLocalStorageGrupos() || [];
    }
    loadFromLocalStorageGrupos() {
        return JSON.parse(localStorage.getItem('grupos'));
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
                </div>      
        </div>
      `;
        cards.appendChild(card);
        const alumnosInscritos = document.getElementById(`alumnosInscritos_${id}`);
        // console.log(grupo.alumnos);

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
    gruposSelect.querySelector('select').appendChild(option);
});
document.addEventListener('DOMContentLoaded', () => {
    imprimirGrupos();
})
selectAlumnos.querySelector('select').addEventListener('change', (e) => {
    const alumnos = new ActualizarAlumnos();
    let alumnoSeleccionado = Number(e.target.value);
    let alumnoFiltrado = alumnos.alumnosArray.filter((alumno) => {
        return alumno.id == alumnoSeleccionado;
    });

    if (alumnoFiltrado[0]) {
        const { id, nombre, apellidoPaterno, apellidoMaterno, edad } = alumnoFiltrado[0];
        alumnoMostrar.innerHTML = `
            <p class="me-2">${id}</p>
            <p class="me-2">${nombre}</p>
            <p class="me-2">${apellidoPaterno}</p>
            <p class="me-2">${apellidoMaterno}</p>
            <p class="me-2">${edad}</p>  
    `;

    }
    alumnoActivo(alumnoFiltrado[0]);
    console.log(alumnoSelect);

});
function alumnoActivo(alumno) {
    alumnoSelect = alumno;
    return alumnoSelect;
}
gruposSelect.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log(alumnoSelect);
    // console.log(e.target[0].value);
    asignarAGrupo(e);


});
function asignarAGrupo(e) {
    const gruposLocalStorage = JSON.parse(localStorage.getItem('grupos')) || [];
    const yaEstaAsignado = gruposLocalStorage.some(grupo => {
        const alumnoABuscar = grupo.alumnos.some((alumno) => {
            return alumno.id == alumnoSelect.id;
        });
        return alumnoABuscar;
    });
    if (!yaEstaAsignado) {
        gruposLocalStorage.forEach((grupo) => {
            // 
            if (e.target[0].value === grupo.id) {
                const alumnoExiste = grupo.alumnos.some((alumno) => {
                    return alumno.id == alumnoSelect.id;
                });
                if (!alumnoExiste) {
                    grupo.alumnos.push(alumnoSelect);
                }
            }
        });
        actualizarGrupos(gruposLocalStorage);
        imprimirGrupos();
    } else {
        console.log('El alumno ya esta asignado a un grupo');

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
    })
    actualizarGrupos(gruposLocalStorage);
    imprimirGrupos();


}
function limpiarCardsHTML() {
    while (cards.firstChild) {
        cards.removeChild(cards.firstChild);
    }
}