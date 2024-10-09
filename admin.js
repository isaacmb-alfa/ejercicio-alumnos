import { Grupo } from "./app.js";

const nombreGrupo = document.getElementById('nombreGrupo');
const nombreMateria = document.getElementById('nombreMateria');
const formGrupo = document.getElementById('crearGrupo');
const formMateria = document.getElementById('crearMateria');
const grupoTabla = document.getElementById('grupos');
const materiaTabla = document.getElementById('materias');
const divMensaje = document.getElementById('mensaje');

class CrearElementos {
    constructor(nombre) {
        this.id = this.generateID();
        this.nombre = nombre;
    }

    generateID() {
        return '_' + Date.now();
    }
    toPlainObject() {
        return {
            id: this.id,
            nombre: this.nombre
        };
    }

}

class CrearGrupo extends CrearElementos {
    constructor(nombre) {
        super(nombre);
        this.grupos = this.loadFromLocalStorage() || [];
    }

    agregarGrupo(nombreGrupo) {
        // Verifica si el grupo ya existe
        if (!this.grupos.some(g => g.nombre === nombreGrupo)) {
            // Crea una instancia de la clase Grupo
            const nuevoGrupo = new Grupo(nombreGrupo);
            nuevoGrupo.id = this.generateID();
            console.log(nuevoGrupo.id);
            this.grupos.push(nuevoGrupo);
            this.saveToLocalStorage();
            imprimirGruposEnTabla();
            ui.imprimirMensaje('exito', 'Grupo agregado correctamente');
            ui.borrarNotificación();
        } else {
            ui.imprimirMensaje('error', `El grupo ${nombreGrupo} ya existe en la lista`);
            ui.borrarNotificación();
        }
    }

    eliminarGrupo(id) {
        this.grupos = this.grupos.filter(grupo => grupo.id !== id);
        this.saveToLocalStorage();
        imprimirGruposEnTabla();
    }

    saveToLocalStorage() {
        localStorage.setItem('grupos', JSON.stringify(this.grupos.map(grupo => grupo.toPlainObject())));
    }

    loadFromLocalStorage() {
        const gruposGuardados = JSON.parse(localStorage.getItem('grupos'));
        return gruposGuardados ? gruposGuardados.map(grupo => Object.assign(new Grupo(), grupo)) : [];
    }
}

class CrearMateria extends CrearElementos {
    constructor(nombre) {
        super(nombre);
        this.materias = this.loadFromLocalStorage() || [];
    }

    agregarMateria(materia) {
        if (!this.materias.some(m => m.nombre === materia.nombre)) {
            this.materias.push(materia.toPlainObject());
            this.saveToLocalStorage();
            imprimirMateriaEnTabla();
            ui.imprimirMensaje('exito', 'Materia agregada correctamente');
            ui.borrarNotificación();
        } else {
            ui.imprimirMensaje('error', `El materia ${materia.nombre} ya existe en la lista`);
            ui.borrarNotificación();
        }
    }
    eliminarMateria(id) {
        this.materias = this.materias.filter(materia => materia.id !== id);
        this.saveToLocalStorage();
        imprimirMateriaEnTabla();
    }

    saveToLocalStorage() {
        localStorage.setItem('materias', JSON.stringify(this.materias));
    }

    loadFromLocalStorage() {
        return JSON.parse(localStorage.getItem('materias'));
    }
}
document.addEventListener('DOMContentLoaded', () => {
    imprimirGruposEnTabla();
    imprimirMateriaEnTabla();
})
formGrupo.addEventListener('submit', (e) => {
    e.preventDefault();
    ui.limpiarHTMLmensajes();
    const grupo = new CrearGrupo();
    grupo.agregarGrupo(nombreGrupo.value);

    formGrupo.reset();

});
formMateria.addEventListener('submit', (e) => {
    e.preventDefault();
    ui.limpiarHTMLmensajes();
    const materia = new CrearMateria(nombreMateria.value);
    materia.agregarMateria(materia);
    formMateria.reset();
});

class UI {
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

function imprimirGruposEnTabla() {
    limpiarHTMLTablaGrupo();
    const gruposGuardados = new CrearGrupo();
    let gruposLS = gruposGuardados.loadFromLocalStorage() || [];

    if (gruposLS) {
        gruposLS.forEach(grupo => {
            const { nombre, id } = grupo;
            const grupoTable = document.createElement('tr');
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger');
            btnBorrar.innerHTML = 'Eliminar';
            grupoTable.innerHTML = `
            <td>${nombre}</td>
            <td></td>`;
            grupoTabla.appendChild(grupoTable);

            btnBorrar.onclick = () => {
                gruposGuardados.eliminarGrupo(id);
            }
            const lastTd = grupoTable.querySelector('td:last-child');
            lastTd.appendChild(btnBorrar);


        });
    }

}
function imprimirMateriaEnTabla() {
    limpiarHTMLTablaMateria();
    const materiasGuardadas = new CrearMateria();
    let materiasLS = materiasGuardadas.loadFromLocalStorage() || [];

    if (materiasLS) {
        materiasLS.forEach(materia => {
            const { nombre, id } = materia;
            const materiaTable = document.createElement('tr');
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger');
            btnBorrar.innerHTML = 'Eliminar';
            materiaTable.innerHTML = `
            <td>${nombre}</td>
            <td></td>`;
            materiaTabla.appendChild(materiaTable);

            btnBorrar.onclick = () => {
                materiasGuardadas.eliminarMateria(id);
            }
            const lastTd = materiaTable.querySelector('td:last-child');
            lastTd.appendChild(btnBorrar);
        });
    }

}
function limpiarHTMLTablaGrupo() {
    while (grupoTabla.firstChild) {
        grupoTabla.removeChild(grupoTabla.firstChild);
    }
}
function limpiarHTMLTablaMateria() {
    while (materiaTabla.firstChild) {
        materiaTabla.removeChild(materiaTabla.firstChild);
    }
}

