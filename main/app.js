//Variables
    //Ventana de gastos
const windowSpending = document.querySelector("#windowSpending");
const btnWindowSpending = windowSpending.querySelector('#btnClose');
    //Datos del formulario
const formulario = document.querySelector('#formPresupuesto');
    //Gastos
let boxGastos = [];

//Clases
class UI{
    iniciarApp(){
        btnWindowSpending.addEventListener('click',openCloseWindowSpending);
        formulario.addEventListener('submit',agregarGasto);
        boxGastos = JSON.parse(localStorage.getItem('gastos')) || [];
        scrollBarSpends();
    };
    message(msgtext,clase){
        const message = document.createElement('div');
        message.classList.add('message',clase);
        message.textContent = msgtext;

        const body = document.querySelector('body');
        const messages = document.querySelectorAll('.message');
        if(messages.length === 0){
            body.insertBefore(message,body.firstChild);
            setTimeout( ()=>{
                this.cleanMessage();
            },3000);
        }else{
            this.cleanMessage();
            body.insertBefore(message,body.firstChild);
            setTimeout( ()=>{
                this.cleanMessage();
            },3000);
        };
        
    };
    cleanMessage(){
        const body = document.querySelector('body');
        while(body.querySelector('.message')){
            body.removeChild(body.querySelector('.message'));
        };
    };
    mostrarPresupuesto(gasto){
        const {presupuesto,transporte,alojamiento,comida} = gasto;
        //Valores
        let gastado = transporte + comida + alojamiento;
        //Seleccion de span para mostrar los resultados
        const presupuestoHtml = document.querySelector('#totalBudget');
        presupuestoHtml.textContent = presupuesto;
        const gastadoHtml = document.querySelector('#spent');
        gastadoHtml.textContent = gastado;
        const sobranteHtml = document.querySelector('#surplus');
        sobranteHtml.textContent = presupuesto - gastado;
    };
    viewSpendHtml(){
        const boxSpends = document.querySelector('#gastosTotales');
        this.cleanSpendHtml(boxSpends);
        boxGastos.forEach( spend => {
            boxSpends.appendChild(viewSpend(spend));
        });
    };
    cleanSpendHtml(div){
        while(div.firstChild){
            div.removeChild(div.firstChild);
        };
    };
};
const ui = new UI();

class Presupuesto{
    constructor(destino,presupuesto,transporte,alojamiento,comida){
        this.destino = destino;
        this.presupuesto = presupuesto;
        this.transporte = transporte;
        this.alojamiento = alojamiento;
        this.comida = comida;
        this.id = generateUUID();
    };
};
//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener("DOMContentLoaded",()=>{
        ui.iniciarApp();
        ui.viewSpendHtml();
    });
};
//Funciones
function agregarGasto(e){
    e.preventDefault();

    const spendingDestino = formulario.querySelector('#destino').value;
    const spendingTotal = Number(formulario.querySelector('#cashTotal').value);
    const spendingTransporte = Number(formulario.querySelector('#cashTransport').value);
    const spendingAlojamiento = Number(formulario.querySelector('#cashAcomodation').value);
    const spendingComida = Number(formulario.querySelector('#cashEat').value);
    
    const validation = spendingDestino.length > 0 && spendingTotal > 0 && spendingTransporte > 0 && spendingAlojamiento > 0 && spendingComida > 0;
    console.log(isNaN(spendingAlojamiento,spendingTotal));
    if(validation){
        const gasto = new Presupuesto(spendingDestino,spendingTotal,spendingTransporte,spendingAlojamiento,spendingComida);
        let restante = (gasto.presupuesto - (gasto.transporte + gasto.alojamiento + gasto.comida));
        if(restante > 0){
            boxGastos = [...boxGastos,gasto];
            setBoxGastos(boxGastos);
            ui.mostrarPresupuesto(gasto);
            ui.viewSpendHtml();
            formulario.reset();
            ui.message('Gasto Agregado Correctamente','correcto');
        }else{
            ui.message('Presupuesto Incorrecto','incorrecto');
        };
    }else{
        ui.message('Debes Completar de Forma Correcta Todos los Campos','incorrecto');
    }
    
};

function viewSpend(obj){
    const {destino,presupuesto,transporte,alojamiento,comida,id} = obj;
    let gastado = transporte + comida + alojamiento;
    let restante = (presupuesto - gastado);

    const boxSpend = document.createElement('div');
    boxSpend.classList.add('ctn-gasto');
    boxSpend.innerHTML = `<div class="ctn-title-spending">
        <p>Mi gasto ($USD)</p>
        <p id="btnEliminar">X</p>
    </div>
    <div class="ctn-description-spending">
        <div class="head-spending">
            <p>Destino: <span>${destino}</span></p>
            <p>Presupuesto Total:<span>${presupuesto}</span></p>
        </div>
        <div class="description-spending">
            <p>Gasto Transporte: <span>${transporte}</span></p>
            <p>Gasto Comida: <span>${comida}</span></p>
            <p>Gasto Alojamiento: <span>${alojamiento}</span></p>
        </div>
        <div class="result-spending">
            <p>Presupuesto Restante: <span>${restante}</span></p>
            <p>Total Gastado: <span>${gastado}</span></p>
        </div>
    </div>`;
    const btnEliminar = boxSpend.querySelector('#btnEliminar');
    btnEliminar.onclick = ()=>{
        deleteSpend(id);
    };
    //Return Box complete
    return boxSpend;
};
function deleteSpend(id){
    boxGastos = boxGastos.filter( spend => spend.id !== id );
    setBoxGastos(boxGastos);
    ui.viewSpendHtml();
    ui.message("Gasto Eliminado Correctamente","correcto");
};
function openCloseWindowSpending(e){
    e.preventDefault();
    if(windowSpending.classList.contains('active')){
        windowSpending.classList.remove('active');
        return;
    }
    windowSpending.classList.add('active');
};
function setBoxGastos (boxGastos){
    localStorage.setItem('gastos',JSON.stringify(boxGastos));
    boxGastos = JSON.parse(localStorage.getItem('gastos'));
};
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};
function scrollBarSpends(){
    const boxSpends = document.querySelector('#gastosTotales');
    boxSpends.addEventListener('scroll',()=>{
        let top = boxSpends.scrollTop;
        let h = boxSpends.scrollHeight - boxSpends.clientHeight;

        let porcentaje = (top/h)*100;
        document.querySelector('.scroll-bar').style.width = `${porcentaje}%`;
    });
};