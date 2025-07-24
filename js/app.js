let mesa = {
    mesa:'',
    hora:'',
    pedidos:[]
}

const btnGuardar = document.querySelector('#guardar-cliente');
btnGuardar.addEventListener('click',guargarCliente);

function guargarCliente(){
    let mesa =  document.querySelector('#mesa');
    let hora = document.querySelector('#hora');

    const validar = [mesa,hora].some(vacio => vacio === '');

    if(validar){

        const existeAlerta = document.querySelector('invalid-feedback');

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

    
}