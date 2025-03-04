//Variables globales
let tablaCarrito = document.querySelector(".cart-table tbody");
let resumenSubTotal = document.querySelector(".sub-total");
let resumenDescuento = document.querySelector(".promo");
let resumenTotal = document.querySelector(".total");
let destino = document.querySelector(".destino");
let resumenDomicilio = document.querySelector(".valor-domi");
let btnResumen = document.querySelector(".btn-resumen");

//Agregar evento al navegador
document.addEventListener("DOMContentLoaded", ()=>{
    cargarProductos();
});

//Función cargar productos guardados en localStorage
function cargarProductos(){
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if(productosPrevios != null){
        todosProductos = Object.values(productosPrevios);
    }
    //Limpiar tabla
    tablaCarrito.innerHTML="";

    //Comprobar si hay productos en localStorage
    if(todosProductos.length != 0){
    todosProductos.forEach((producto, i)=>{
        // agregarProducto(producto, i);

        //Cargar tabla
        let fila = document.createElement("tr");
            fila.innerHTML = `
                <td class="d-flex justify-content-evenly align-items-center">
                    <span onclick="borrarProducto(${i});" class="btn btn-danger">X</span>
                    <img src="${producto.imagen}" width="70px">
                    ${producto.nombre}
                </td>

                <td>$<span> ${producto.precio} </span></td>

                <td>
                    <div class="quantity quantity-wrap">
                    <div class="decrement" onclick="actualizarCantidad(${i}, -1)"> <i class="fa-solid fa-minus"></i> </div>
                    <input class="number" type="text" name="quantity" value="${producto.cantidad || 1}" maxlength="2" size="1 readonly">
                    <div class="increment" onclick="actualizarCantidad(${i}, 1)"> <i class="fa-solid fa-plus"></i> </div>
                    </div>
                </td>

                <td> $${(producto.precio * producto.cantidad).toFixed(3)} </td>
            `;
            tablaCarrito.appendChild(fila);
        });
    }else{
        let fila = document.createElement("tr");
        fila.innerHTML=`
            <td colspan="4">
                <p class="text-center fs-3">No hay productos en el Carrito</p>
            </td>
        `;
        tablaCarrito.appendChild(fila);
    }
    //Ejecutar resumen de la compra
    resumenCompra();
}

//Función para actualizar cantidades del producto
function actualizarCantidad(pos, cambio) {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if(productosPrevios != null){
        todosProductos = Object.values(productosPrevios);
    }
    if(todosProductos[pos]){
        //Actualiza cantidad
        todosProductos[pos].cantidad = (todosProductos[pos].cantidad || 1) + cambio;

        //Asegurarse de que la cantidad no sea menor a 1
        if(todosProductos[pos].cantidad < 1 ){
            todosProductos[pos].cantidad = 1;
        }

        //Calcular subtotal
        let subtotal = todosProductos[pos].precio * todosProductos[pos].cantidad;
    }

    //Actualizar en localStorage
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));

    //Recargar la tabla
    cargarProductos();
}

//Función para borrar productos de detalle carrito
    function borrarProducto(pos) {
        let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if(productosPrevios != null){
        todosProductos = Object.values(productosPrevios);
    }
    //Eliminar producto
    todosProductos.splice(pos, 1);
    //Actualizar localStorage
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
    //Recargar tabla
    cargarProductos();
}

//Función para el resumen de la compra
function resumenCompra(){
    let todosProductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let subtotal = 0;//Acumular el subtotal de los productos
    //Recorrer cada producto y acumulamos en el subtotal
    todosProductos.forEach((producto)=>{
        subtotal += producto.precio*producto.cantidad;
    });
    
    //Calcular el valor del domicilio
    let domicilio = 0;
    switch (destino.value) {
        case "Medellin": default: domicilio; break;
        case "Bello": domicilio=10.000; break;
        case "Copacabana": case "Caldas": case "La Estrella": domicilio = 20.000; break;
        case "Envigado": case "Itagui": case "Sabaneta": domicilio = 15.000; break;
    }

    //Calcular descuento del 10% si la compra es mayor a 100.000
    let descuento = (subtotal > 100.000) ? subtotal * 0.1 : 0;

    //Calcular el total a pagar de la compra
    let totalApagar = subtotal - descuento + domicilio;

    //Mostrar los calculos de resumen de compra
    resumenSubTotal.textContent = subtotal.toFixed(3);
    resumenDescuento.textContent = descuento.toFixed(3);
    resumenTotal.textContent = totalApagar.toFixed(3);
    resumenDomicilio.textContent = domicilio.toFixed(3);
}

//Agregar evento change al destino para calcular el valor del domicilio
destino.addEventListener("change", ()=>{
    //Actualice el resumen de la compra
    resumenCompra();
});

//Evento al boton pagar para guardar el resumen de la compra de localStorage
btnResumen.addEventListener("click", ()=>{
    //Extraer los productos de localStorage
    let todosProductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let resumen = {
        //Copiar todos los productos
        ...todosProductos,
    }

    //Llenar la variable resumen con la información del resumen de la compra
    resumen.subtotal = resumenSubTotal.textContent;
    resumen.descuento = resumenDescuento.textContent;
    resumen.destino = destino.value;
    resumen.domicilio = resumenDomicilio.textContent;
    resumen.totalApagar = resumenTotal.textContent;

    //Guardar resumen de la compra en localStorage
    localStorage.setItem("pro-resumen", JSON.stringify(resumen));
    
    //Redirigir el usuario a la pagina de pago
    location.href = "checkout.html";

    // console.log(location.href);
});