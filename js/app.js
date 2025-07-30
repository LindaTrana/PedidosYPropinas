let cliente = {
    mesa:'',
    hora:'',
    pedidos:[]
}

let categorias = {
    1:'Comida',
    2:'Bebidas',
    3:'Postres'
}

const btnGuardar = document.querySelector('#guardar-cliente');
btnGuardar.addEventListener('click',guargarCliente);

function guargarCliente(){
    let mesa =  document.querySelector('#mesa').value;
    let hora = document.querySelector('#hora').value;

    const validar = [mesa,hora].some(vacio => vacio === '');

    if(validar){

        const existeAlerta = document.querySelector('.invalid-feedback');

        if(!existeAlerta){
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback','d-block','text-center');
            alerta.textContent = 'Ningun campo deberia estar vacio';
            document.querySelector('.modal-body form').appendChild(alerta);
        
            setTimeout(()=>{
                alerta.remove();
            },3000);
        }
        return;
    }

    
    cliente = {...cliente, mesa,hora};

    const modalFormulario = document.querySelector('#formulario');
    const ocultarFomulario = bootstrap.Modal.getInstance(modalFormulario);
    ocultarFomulario.hide();

    mostrarSecciones();
    obtenerPlatillos();
}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));

}

function obtenerPlatillos(){
    const url = 'js/db.json';

    fetch(url)
                .then(datos => datos.json())
                .then(resultado => mostrarPlatillos(resultado.platillos))
}

function mostrarPlatillos(platillos){

    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('P');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('P');
        precio.classList.add('col-md-3','fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('P');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = 'producto-${platillo.id}';
        inputCantidad.classList.add('form-control');

        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo,cantidad});
        }

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);

    });
}

function agregarPlatillo(producto){
    let {pedidos} = cliente;

    if(producto.cantidad > 0){
        if(pedidos.some(plato => plato.id === producto.id)){
            const pedidoActualizado = pedidos.map(plato => {
                if(plato.id === producto.id){
                    plato.cantidad = producto.cantidad
                }
                return plato;
            });

            cliente.pedidos = [...pedidoActualizado];
        } else {
            cliente.pedidos = [...pedidos, producto];
        }
    } else {
        const eliminados = pedidos.filter(pedido => pedido.id !== producto.id);
        cliente.pedidos = [...eliminados]
    }

    limpiarHtml();
   actualizarResumen();
}

function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6','card','py-5', 'px-3','shadow');

    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    //PARA LA HORA
    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    const heading = document.createElement('h3');
    heading.textContent = ' Platillos consumidos';
    heading.classList.add('my-4','text-center');

    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const {pedidos} = cliente;
    pedidos.forEach(plato => {
        const {nombre,id,cantidad,precio,categoria} = plato;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        const cantidadEl = document.createElement('p');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadSpan = document.createElement('span');
        cantidadSpan.classList.add('fw-normal');
        cantidadSpan.textContent = cantidad;

        const precioEL = document.createElement('p');
        precioEL.classList.add('fw-bold');
        precioEL.textContent = 'Precio: ';

        const precioSpan = document.createElement('span');
        precioSpan.classList.add('fw-normal');
        precioSpan.textContent = precio;


        cantidadEl.appendChild(cantidadSpan)
        precioEL.appendChild(precioSpan)

        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEL);
        grupo.appendChild(lista);
        

    })


    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);
}

function limpiarHtml(){
    const contenido = document.querySelector('#resumen .contenido');

    while (contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}
