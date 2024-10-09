const nav = document.getElementById('navBar');

nav.innerHTML = `<div class="container-fluid flex flex-wrap justify-content-between ms-3">
            <a class="navbar-brand" href="#">Colegio X</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse flex flex-wrap justify-content-end me-3" id="navbarNav">
                <ul class="navbar-nav ">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="index.html">Registro</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="admin.html">Admin</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="grupos.html">Grupos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="materias.html">Materias</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="busqueda.html">Busqueda</a>
                    </li>
                </ul>
            </div>
        </div>`;