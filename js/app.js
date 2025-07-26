let cliente = {
    mesa:'',
    hora:'',
    pedidos:[]
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
                .then(datos => console.log(datos))
                .then(resultado => console.log(resultado))
}

