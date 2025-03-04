//Variables globales
let btnProducts = document.querySelectorAll(".btn-product");
let contadorCarrito = document.querySelector(".contar-pro");
let listadoCarrito = document.querySelector(".list-cart tbody");
let con = 0;
document.addEventListener("DOMContentLoaded", ()=>{
    cargarProLocalStorage();
});

//Eventos para todos los botones de los productos
btnProducts.forEach((btn, i)=>{
    btn.addEventListener("click", ()=>{
        // alert("Click al boton " +(i+1))
        con++;
        contadorCarrito.textContent = con;
        //Llamar la función de agregar producto al carrito
        // agregarProducto();
        infoProducto(i);
    });
});

//Agregar producto al carrito
function agregarProducto(producto){
    let fila = document.createElement("tr");
    fila.innerHTML = `
        <td> ${con} </td>
        <td> <img src="${producto.imagen}" width="70px"> </td>
        <td> ${producto.nombre} </td>
        <td> $${producto.precio} </td>
        <td>
            <span onclick="borrarProducto(${con});" class="btn btn-danger">X</span>
        </td>
    `;
    listadoCarrito.appendChild(fila);
};

//Función para agregar la información del producto al carrito
function infoProducto(pos){
    let producto = btnProducts[pos].parentElement.parentElement.parentElement;
    let infoPro = {
        nombre: producto.querySelector("h3").textContent,
        imagen: producto.querySelector("img").src,
        precio: producto.querySelector("h5").textContent.split("$")[1],
        cantidad: 1,
    }

    //Llamar la función del carrito
    agregarProducto(infoPro);
    guardarProLocalStorage(infoPro);
}

//Función para borrar un producto del carrito
function borrarProducto(pos){
    let producto = event.target;
    // console.log(producto.parentElement.parentElement);
    // alert("Deseas eliminar este producto");
    producto.parentElement.parentElement.remove();
    //Disminuir el contador de productos del carrito
    if(con > 0){
        con--;
        contadorCarrito.textContent = con;
    }
    eliminarProlocalStorage(pos);
}

//Guardar los productos en localStorage
function guardarProLocalStorage(producto){
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if(productosPrevios != null){
        todosProductos = Object.values(productosPrevios);
    }
    todosProductos.push(producto);
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
}

//Eliminar productos en localStorage
function eliminarProlocalStorage(pos) {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if(productosPrevios != null){
        todosProductos = Object.values(productosPrevios);
    }
    todosProductos.splice((pos-1), 1);
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
}

//Cargar productos de localStorage en el carrito
function cargarProLocalStorage() {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if(productosPrevios != null){
        todosProductos = Object.values(productosPrevios);
    }

    todosProductos.forEach((producto, i)=>{
        // agregarProducto(producto, i);
        let fila = document.createElement("tr");
            fila.innerHTML = `
                <td> ${i + 1} </td>
                <td> <img src="${producto.imagen}" width="70px"> </td>
                <td> ${producto.nombre} </td>
                <td> ${producto.precio} </td>
                <td>
                    <span onclick="borrarProducto(${i});" class="btn btn-danger">X</span>
                </td>
            `;
            listadoCarrito.appendChild(fila);
    });
}

contadorCarrito.parentElement.addEventListener("click", ()=>{
    listadoCarrito.parentElement.classList.toggle("ocultar");
});