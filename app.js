const divMensaje = document.querySelector('#mensaje');

export class Alumno {
    constructor(id, nombre, apellidoPaterno, apellidoMaterno, edad) {
        this.id = id;
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.edad = edad;
        this.materiasInscritas = [];
        this.calificaciones = {};
    }

    inscribirMateria(materia) {
        if (!this.materiasInscritas.some(materiaInscrita => materiaInscrita.id === materia.id)) {
            this.materiasInscritas.push(materia);
        }
    }

    asignarCalificacion(materia, calificacion) {
        this.calificaciones[materia] = calificacion;
    }

    obtenerPromedio() {
        const calificaciones = Object.values(this.calificaciones);
        const suma = calificaciones.reduce((a, b) => a + b, 0);
        return calificaciones.length ? suma / calificaciones.length : 0;
    }

    toPlainObject() {
        return {
            id:this.id,
            nombre: this.nombre,
            apellidoPaterno: this.apellidoPaterno,
            apellidoMaterno: this.apellidoMaterno,
            edad: this.edad,
            materiasInscritas: this.materiasInscritas,
            calificaciones: this.calificaciones
        }
    }
}

export class Grupo {
    constructor(nombre, id) {
        this.nombre = nombre;
        this.id = id;
        this.alumnos = [];
    }

    agregarAlumno(alumnoAGuardar) {
        this.alumnos.push(alumnoAGuardar);
    }

    buscarPorNombre(nombre) {
        return this.alumnos.filter(alumno => alumno.nombre === nombre);
    }

    buscarPorApellido(apellido) {
        return this.alumnos.filter(alumno => alumno.apellidoPaterno === apellido || alumno.apellidoMaterno === apellido);
    }

    obtenerPromedioGrupo() {
        const sumaPromedios = this.alumnos.reduce((suma, alumno) => suma + alumno.obtenerPromedio(), 0);
        return this.alumnos.length ? sumaPromedios / this.alumnos.length : 0;
    }

    ordenarPorCalificacion(ascendente = true) {
        return this.alumnos.sort((a, b) => {
            const promedioA = a.obtenerPromedio();
            const promedioB = b.obtenerPromedio();
            return ascendente ? promedioA - promedioB : promedioB - promedioA;
        });
    }

    ordenarPorApellidoPaterno() {
        return this.alumnos.sort((a, b) => {
            if (a.apellidoPaterno < b.apellidoPaterno) return -1;
            if (a.apellidoPaterno > b.apellidoPaterno) return 1;
            return 0;
        });
    }

    toPlainObject() {
        return {
            id: this.id,
            nombre: this.nombre,
            alumnos: this.alumnos.map(alumno => alumno.toPlainObject())
        };
    }
}
export class AlmacenarAlumnos {
    constructor() {
        this.alumnos = this.cargarAlumnos();
    }
    agregarAlumno(alumno) {
        if (!this.alumnoExiste(alumno)) {
            this.alumnos.push(alumno);
            this.guardarAlumnos();
        } else {
            ui.imprimirMensaje('error', 'El alumno ya esta registrado');
            ui.borrarNotificación();
        }
    }
    alumnoExiste(nuevoAlumno) {
        return this.alumnos.some(alumno =>
            alumno.nombre === nuevoAlumno.nombre &&
            alumno.apellidoPaterno === nuevoAlumno.apellidoPaterno &&
            alumno.apellidoMaterno === nuevoAlumno.apellidoMaterno
        );
    }
    cargarAlumnos() {
        const alumnosGuardados = localStorage.getItem('alumnos');
        return alumnosGuardados ? JSON.parse(alumnosGuardados) : [];
    }
    guardarAlumnos() {
        localStorage.setItem('alumnos', JSON.stringify(this.alumnos));
    }
    guardarAlumnosFiltrados(alumnos) {
        localStorage.setItem('alumnos', JSON.stringify(alumnos));
    }
}

export class UI {
    imprimirMensaje(tipo, mensaje) {
        if (tipo === 'error') {
            divMensaje.classList.add('bg-danger');
        } else if (tipo === 'exito') {
            divMensaje.classList.add('bg-success');
        }
        const parrafo = document.createElement('p');
        parrafo.className = 'align-self-center text-white p-3 m-0';
        parrafo.textContent = mensaje;

        divMensaje.appendChild(parrafo);
    }
    limpiarHTMLmensajes() {
        while (divMensaje.firstChild) {
            divMensaje.removeChild(divMensaje.firstChild);
        }
    }
    borrarNotificación() {
        setTimeout(() => {
            divMensaje.removeChild(divMensaje.firstChild)
        }, 2000);
    }
}

let ui = new UI;




