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
    } else { // si el usuario disminuye a cero el pedido.
        const eliminados = pedidos.filter(pedido => pedido.id !== producto.id);
        cliente.pedidos = [...eliminados];
    }

    limpiarHtml();

    if(cliente.pedidos.length){
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

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

        const subEl = document.createElement('p');
        subEl.classList.add('fw-bold');
        subEl.textContent = 'Subtotal: ';

        const subSpan = document.createElement('span');
        subSpan.classList.add('fw-normal');
        subSpan.textContent = calcularPrecio(precio,cantidad);

        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn','btn-danger');
        btnEliminar.textContent = 'Eliminar pedido';

        btnEliminar.onclick = function(){
            eliminarPedido(id);
        }

        mesa.appendChild(mesaSpan);
        hora.appendChild(horaSpan);

        cantidadEl.appendChild(cantidadSpan);
        precioEL.appendChild(precioSpan);
        subEl.appendChild(subSpan);

        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEL);
        lista.appendChild(subEl);
        lista.appendChild(btnEliminar);
        grupo.appendChild(lista);

    })

    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);
    formularioPropina();
}

function limpiarHtml(){
    const contenido = document.querySelector('#resumen .contenido');

    while (contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularPrecio(precio,cantidad){
    return precio * cantidad
}

function eliminarPedido(id){
    const {pedidos} = cliente;

    const eliminados = pedidos.filter(pedido => pedido.id !== id);
    cliente.pedidos = [...eliminados];

    limpiarHtml();
    
    if(cliente.pedidos.length){
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

    // regresando a 0 los inputs una vez que se eliminan.
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Agrega los elementos al pedido';

    contenido.appendChild(texto);
}

function formularioPropina(){
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('div')
    formulario.classList.add('col-md-6','formulario');

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card','py-5','px-3','shadow');

    const heading = document.createElement('h3');
    heading.classList.add('my-4','text-content-center');
    heading.textContent = 'Propinas';

    //10%
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    radio10.onclick = calculcarPropina;

    const radio10Label = document.createElement('label');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check');

    //20%
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = '25';
    radio25.classList.add('form-check-input');
    radio25.onclick = calculcarPropina;

    const radio25Label = document.createElement('label');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('div');
    radio25Div.classList.add('form-check');

    //50%
    const radio50 = document.createElement('input');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = '50';
    radio50.classList.add('form-check-input');
    radio50.onclick = calculcarPropina;

    const radio50Label = document.createElement('label');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('div');
    radio50Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);

    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);

    formulario.appendChild(divFormulario)
    contenido.appendChild(formulario)
}

function calculcarPropina(){
    const {pedidos} = cliente;
    let subtotal = 0;

    pedidos.forEach( sub =>{
        subtotal += sub.precio * sub.cantidad
    })

    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    const propina = ((subtotal * parseInt(propinaSeleccionada)) / 100);

    const total = subtotal + propina;

    mostrarTotales(subtotal,total,propina)
}

function mostrarTotales(subtotal,total,propina){

    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar','my-5');


    //Subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-4','fw-bold','mt-2');
    subtotalParrafo.textContent = 'Consumo Total: ';

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    //propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fs-4','fw-bold','mt-2');
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;

    //total
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-4','fw-bold','mt-2');
    totalParrafo.textContent = 'Total: ';

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;

    subtotalParrafo.appendChild(subtotalSpan);
    propinaParrafo.appendChild(propinaSpan);
    totalParrafo.appendChild(totalSpan);

    const totalPagarDiv = document.querySelector('.total-pagar');
    if(totalPagarDiv){
        totalPagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);
}