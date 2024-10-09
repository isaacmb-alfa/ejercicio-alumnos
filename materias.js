const listadoAlumnos = document.getElementById('tablaMateriasAlumnos');
const selectAlumnos = document.getElementById('alumnosInscritosSelect');
const cards = document.getElementById('cards');

class ActualizarAlumnos {
    constructor(alumnos) {
        this.alumnos = alumnos;
        this.alumnosArray = [];
    }
    llenarAlumnosLocal() {
        if (JSON.parse(localStorage.getItem('alumnos'))) {
            let alumnos = JSON.parse(localStorage.getItem('alumnos'));
            alumnos.forEach((alumno, index) => {
                const { id, nombre, apellidoPaterno } = alumno;
                const valorSelect = document.createElement('option');
                valorSelect.value = id;
                valorSelect.innerHTML = `${apellidoPaterno}-${nombre}`;
                selectAlumnos.querySelector('select').appendChild(valorSelect);
            });
        }
    }
}
const alumnosLocal = new ActualizarAlumnos();
alumnosLocal.llenarAlumnosLocal();

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
                <td>${id}</td>
                <td>${nombre}</td>
                <td>${apellidoPaterno}</td>
                <td>${apellidoMaterno}</td>
                <td>${edad} años</td>
                <td></td>
                <td></td>
          `;

            btnBorrar.onclick = () => {
                eliminarAlumno(id);
            }
            //seleccionamos el último td
            const lastTd = rowAlumno.querySelector('td:last-child');
            lastTd.appendChild(btnBorrar);

            listadoAlumnos.appendChild(rowAlumno);

        });

    }
}

imprimirAlumnos();
function limpiarHTMLTabla() {
    while (listadoAlumnos.firstChild) {
        listadoAlumnos.removeChild(listadoAlumnos.firstChild);
    }
}