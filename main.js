// Primero creamos la clase Drogas la cual sera la encargada de crear los objectos con la info de las drogas, cada objeto necesita un id para poder ser editado
class Drogas {
  constructor(nombre, url, pais, efectos, id) {
    this.id = id !== "" ? Number(id) : this.id()
    this.nombre = nombre;
    this.url = url;
    this.origen = pais;
    this.efectos = efectos;
  }

  // Esta funcion crea el id del objeto el cual es necesario para identificarlo al momento de editar y eliminar
  id() {
    if(localStorage.listaDeRegistros) {
      let registros =  JSON.parse(localStorage.listaDeRegistros)
      let index = registros.length - 1

      if(index === -1) return 1

      return registros[index].id + 1
    }

    return 1
  }
}

// Esta clase se encarga del registro en el localStorage y tiene varias  funciones para el crud de los  records
class Registros {
  crearNuevoRegistro(registro) {
    if(this.validarBrowser) {
      if (localStorage.listaDeRegistros) {
        var registros = JSON.parse(localStorage.listaDeRegistros);
      } else {
        var registros = [];
      }

      registros.push(registro);
      localStorage.listaDeRegistros = JSON.stringify(registros);
      console.log("Registro agregado con exito");
      return true;
    }

    console.log("El browser no soporta localStorage");
    return false;
  }

  // funcion para obtener todos los registros
    listaDeRegistros() {
    if(localStorage.listaDeRegistros) {
      return JSON.parse(localStorage.listaDeRegistros);
    }

    console.log("No hay registros en el localStorage");
    return null;
  }

  // Esta funcion se encarga de crear los tr con los td en el tbody, se puede refactorizar
  mostrarListaDeRegistros() {
    var registros = this.listaDeRegistros();

    if(registros != undefined) {
      let tabla = document.querySelector("#tabla tbody");
      tabla.innerHTML = "";

      registros.forEach(registro => {
        let tr = document.createElement('tr');
        let nombre = registro.nombre;
        let url = registro.url;
        let origen = registro.origen;
        let efectos = registro.efectos
        let tdNombre = document.createElement('td');
        let tdUrl = document.createElement('td');
        let tdOrigen = document.createElement('td');
        let tdEfectos = document.createElement('td');
        let tdEliminar = document.createElement('td');
        let tdEditar = document.createElement('td');
        tdNombre.innerHTML = nombre;
        tdUrl.innerHTML = url;
        tdOrigen.innerHTML = origen;
        tdEfectos.innerHTML = efectos;

        let eliminar = document.createElement("a");
        eliminar.innerText = "elminar"
        eliminar.href = "#"
        eliminar.addEventListener('click', (e) => {
          e.preventDefault();
          this.eliminarRegistro(registro)
        })

        let editar = document.createElement("a");
        editar.innerText = "editar"
        editar.href = "#"
        editar.addEventListener('click', (e) => {
          e.preventDefault();
          this.editarRegistro(registro)
        })

        tdEliminar.appendChild(eliminar);
        tdEditar.appendChild(editar);
        tr.appendChild(tdNombre);
        tr.appendChild(tdUrl);
        tr.appendChild(tdOrigen);
        tr.appendChild(tdEfectos);
        tr.appendChild(tdEliminar);
        tr.appendChild(tdEditar);

        tabla.appendChild(tr);
      });
    }

    return null
  }

  // esta funcion elimina el registro el cual llega como parametro
  eliminarRegistro(registro) {
    var registros = JSON.parse(localStorage.listaDeRegistros);
    registros = registros.filter((obj)=>{
      return obj.id != registro.id;
    })

    localStorage.listaDeRegistros = JSON.stringify(registros);
    console.log("Registro eliminado con exito");

    // limpiamos el formulario para evitar errores
    limpiarFormulario()

    // actualizamos la lista
    this.mostrarListaDeRegistros()
    return true
  }

  // Esta funcion valida el browser para saber si soporta el localStorage, retorna true o false
  validarBrowser() {
    return typeof(Storage) !== "undefined"
  }

  // esta funcion sirve para poner los valores del registro que queremos editar en el formulario
  editarRegistro(registro){
    var registros = JSON.parse(localStorage.listaDeRegistros);
    // limpiamos el formulario para evitar errores
    limpiarFormulario()

    // la  variable i  es el indice actual de la iteracion,
    // primero obtenemos el objeto y buscamos el id  que  sea igual al id del registro que  vamos a actualizar
    // cuando lo encuentra, entonces saca sus atributos y los guarda en variables
    // esas variables las guarda en su respectiivo campo
    // y por ultimo le cambiamos  el nombre al boton para que se entienda  que se va a actualizar un registro
    for(let i in registros){
      if(registros[i].id == registro.id) {
        let nombre = registro.nombre;
        let url = registro.url;
        let origen = registro.origen;
        let efectos = registro.efectos

        document.getElementById('nombre').value = nombre;
        document.getElementById('url').value = url;
        document.getElementById('pais').value = origen;
        document.getElementById('efectos').value = efectos;
        document.getElementById('registroId').value = registro.id;
        document.getElementById('guardar').innerHTML = "Actualizar registro";
      }
    }
  }

  // esta funcion sirve para actualizar un registro
  actualizarRegistro(registro){
    let registroDeDrogas = new Registros;

    let registros = JSON.parse(localStorage.listaDeRegistros);

    for(let i in registros){
      // buscamos el objeto que haya matcho con el id  que queremos actualizar
      // una vez que ya se encontro, se le asigna el nuevo objeto actualizado a la posicion con la que hizo match
      if(registros[i].id === registro.id){
        registros[i] = registro;
      }
    }

    // y se manda el  array con objeto actualizado al  localStorage
    localStorage.listaDeRegistros = JSON.stringify(registros);

    // Actualizamos la tabla
    registroDeDrogas.mostrarListaDeRegistros();

    // regresamos el texto original al boton
    document.getElementById('guardar').innerHTML = "Crear registro";
    console.log("Registro actualiziado");
  }

  buscarRegistro(campo, valor){
    var arr = JSON.parse(localStorage.listaDeRegistros);
    let resultados = arr.filter( e => {
      return e[campo] === valor; 
   })
 
    this.mostrarBusqueda(resultados);
 }

 mostrarBusqueda(busqueda){
    if(busqueda != undefined) {
      let tabla = document.querySelector("#tabla tbody");
      tabla.innerHTML = "";

      busqueda.forEach(registro => {
        let tr = document.createElement('tr');
        let nombre = registro.nombre;
        let url = registro.url;
        let origen = registro.origen;
        let efectos = registro.efectos
        let tdNombre = document.createElement('td');
        let tdUrl = document.createElement('td');
        let tdOrigen = document.createElement('td');
        let tdEfectos = document.createElement('td');
        let tdEliminar = document.createElement('td');
        let tdEditar = document.createElement('td');
        tdNombre.innerHTML = nombre;
        tdUrl.innerHTML = url;
        tdOrigen.innerHTML = origen;
        tdEfectos.innerHTML = efectos;

        let eliminar = document.createElement("a");
        eliminar.innerText = "elminar"
        eliminar.href = "#"
        eliminar.addEventListener('click', (e) => {
          e.preventDefault();
          this.eliminarRegistro(registro)
        })

        let editar = document.createElement("a");
        editar.innerText = "editar"
        editar.href = "#"
        editar.addEventListener('click', (e) => {
          e.preventDefault();
          this.editarRegistro(registro)
        })

        tdEliminar.appendChild(eliminar);
        tdEditar.appendChild(editar);
        tr.appendChild(tdNombre);
        tr.appendChild(tdUrl);
        tr.appendChild(tdOrigen);
        tr.appendChild(tdEfectos);
        tr.appendChild(tdEliminar);
        tr.appendChild(tdEditar);

        tabla.appendChild(tr);
      });
    }

    return null
  }
 }

// Esta funcion se ejecuta cada que se hace un submit del formulario, en ella se crea un objeto de la clase Drogas con la informacion que obtenemos de los campos del formulario, y despues este objeto lo guardamos en el active storage
const registro = (e) => {
  e.preventDefault();


  let nombre = document.getElementById('nombre').value;
  let url = document.getElementById('url').value;
  let pais = document.getElementById('pais').value;
  let efectos = document.getElementById('efectos').value;
  let id = document.getElementById('registroId').value;

  let btnText = document.getElementById('guardar').innerHTML

  const registros = new Registros;

  const registro = new Drogas(nombre, url, pais, efectos, id);

  if(btnText === "Actualizar registro") {
    registros.actualizarRegistro(registro);
    limpiarFormulario();
    return;
  }

  registros.crearNuevoRegistro(registro);

  registros.mostrarListaDeRegistros();

  limpiarFormulario();
}

// funcion para destruir todos los registros
const destruirRegistros = (e) => {
  e.preventDefault();

  localStorage.clear();

  let tabla = document.querySelector("#tabla tbody");
  tabla.innerHTML = "";
}

// funcion para limpiar el formulario
const limpiarFormulario = () => {
  document.getElementById('nombre').value = "";
  document.getElementById('url').value = "";
  document.getElementById('pais').value = "";
  document.getElementById('efectos').value = "";
  document.getElementById('registroId').value = "";
}

const ejecutarBusqueda = (e) => {
  e.preventDefault();
  let campo = document.getElementById('campos').value;
  let valor = document.getElementById('campoBuscar').value;
  let registros = new Registros;
  registros.buscarRegistro(campo, valor);
}

