import { Alumno, CargarLocal } from "./app.js";
const alumnosTabla = document.getElementById('alumnosTable');
const buscarPorNombre = document.getElementById('busquedaNombre');
const buscarPorApellido = document.getElementById('buscarApellido');
const buscarForm = document.getElementById('buscarForm');
const ordenarForm = document.getElementById('ordenarForm');

const cargaLocal = new CargarLocal();


//funciones 

function llenarAlumnosTabla(array) {
    const alumnosFiltrados = array || cargaLocal.alumnos;
    alumnosFiltrados.forEach((alumno) => {
        const { nombre, id, apellidoPaterno, apellidoMaterno, edad, calificaciones } = alumno;
        const alumnoTabla = document.createElement('tr');
        const promedio = calcularPromedio(id);
        alumnoTabla.innerHTML = `
            <td class="col">${nombre}</td>
            <td class="col">${apellidoPaterno}</td>
            <td class="col">${apellidoMaterno}</td>
            <td class="col">${edad}</td>
            <td class="col">${promedio.toFixed(2)}</td>
      `;
        alumnosTabla.appendChild(alumnoTabla);
    });


}
function calcularPromedio(idAlumno) {
    const alumnoFiltrado = cargaLocal.alumnos.filter(alumno => alumno.id === idAlumno);
    if (alumnoFiltrado) {
        const calificaciones = Object.values(alumnoFiltrado[0].calificaciones);
        const suma = calificaciones.reduce((a, b) => a + b, 0);
        const promedio = calificaciones.length ? suma / calificaciones.length : 0;
        // console.log(promedio);
        return promedio;

    }
}
function limpiarAlumnosHTML() {
    while (alumnosTabla.firstChild) {
        alumnosTabla.removeChild(alumnosTabla.firstChild);
    }
}


class Ordenar {
    constructor(array) {
        this.array = array;
    }
    ordenarPorApellidoPaterno(array) {
        return array.sort((a, b) => {
            if (a.apellidoPaterno < b.apellidoPaterno) return -1;
            if (a.apellidoPaterno > b.apellidoPaterno) return 1;
            return 0;
        });
    }
    buscarPorApellido(apellido) {
        return this.array.filter(alumno => alumno.apellidoPaterno === apellido || alumno.apellidoMaterno === apellido);
    }
    buscarPorNombre(nombre) {
        return this.array.filter(alumno => alumno.nombre === nombre);
    }
    buscarPorNombreYApellido(nombre, apellido) {
        return this.array.filter(alumno => alumno.nombre === nombre && (alumno.apellidoPaterno === apellido || alumno.apellidoMaterno === apellido));
    }
    ordenarPorApellidoPaternoAscendente() {
        return this.array.sort((a, b) => {
            if (a.apellidoPaterno < b.apellidoPaterno) return -1;
            if (a.apellidoPaterno > b.apellidoPaterno) return 1;
            return 0;
        });
    }

    ordenarPorApellidoPaternoDescendente() {
        return this.array.sort((a, b) => {
            if (a.apellidoPaterno > b.apellidoPaterno) return -1;
            if (a.apellidoPaterno < b.apellidoPaterno) return 1;
            return 0;
        });
    }

    ordenarPorEdadAscendente() {
        return this.array.sort((a, b) => a.edad - b.edad);
    }
}
buscarForm.addEventListener('submit', (e) => {
    e.preventDefault();
    limpiarAlumnosHTML();
    const nombre = buscarPorNombre.value.trim();
    const apellido = buscarPorApellido.value.trim();
    const ordenar = new Ordenar(cargaLocal.alumnos);
    let alumnosFiltrados = [];
    if (nombre && apellido) {
        alumnosFiltrados = ordenar.buscarPorNombreYApellido(nombre, apellido);
    } else if (nombre) {
        alumnosFiltrados = ordenar.buscarPorNombre(nombre);
    } else if (apellido) {
        alumnosFiltrados = ordenar.buscarPorApellido(apellido);
    } else {
        alumnosFiltrados = cargaLocal.alumnos; // Si no hay filtro, muestra todos los alumnos
    }
    llenarAlumnosTabla(alumnosFiltrados);

});
ordenarForm.addEventListener('change', (e) => {
    e.preventDefault();
    limpiarAlumnosHTML();
    let valor = ordenarForm.querySelector('select').value;
    const ordenar = new Ordenar(cargaLocal.alumnos);
    let alumnosOrdenados = [];

    switch (valor) {
        case 'ascendente':
            alumnosOrdenados = ordenar.ordenarPorApellidoPaternoAscendente();
            break;
        case 'descendente':
            alumnosOrdenados = ordenar.ordenarPorApellidoPaternoDescendente();
            break;
        case 'edad':
            alumnosOrdenados = ordenar.ordenarPorEdadAscendente();
            break;
        default:
            alumnosOrdenados = cargaLocal.alumnos; // Si no se selecciona una opción válida, muestra todos los alumnos sin ordenar
            break;
    }

    llenarAlumnosTabla(alumnosOrdenados);

});



llenarAlumnosTabla();