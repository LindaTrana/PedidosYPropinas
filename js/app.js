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
        cliente.pedidos = [...pedidos, producto];
    }else{
        console.log('No pasa test')
    }
}