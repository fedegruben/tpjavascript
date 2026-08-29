const contenedorProductos = document.querySelector("#contenedor-productos");
const estadoCarga = document.querySelector("#estado-carga");
const buscadorProductos = document.querySelector("#buscador-productos");
const panelCarrito = document.querySelector("#panel-carrito");
const fondoCarrito = document.querySelector("#fondo-carrito");
const productosCarrito = document.querySelector("#productos-carrito");
const cantidadCarrito = document.querySelector("#cantidad-carrito");
const totalCarrito = document.querySelector("#total-carrito");
const botonFinalizar = document.querySelector("#finalizar-compra");

let productos = [];
let carrito = [];

function mostrarProductos(listaProductos) {
    if (listaProductos.length === 0) {
        contenedorProductos.innerHTML = '<p class="sin-resultados">No se encontraron cartas.</p>';
        return;
    }

    contenedorProductos.innerHTML = listaProductos.map((producto) => `
        <article class="tarjeta-producto">
            <img src="${producto.imagen}" alt="Carta ${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="tarjeta-producto__tipo">Tipo: ${producto.tipo}</p>
            <div class="tarjeta-producto__pie">
                <p class="tarjeta-producto__precio">$${producto.precio.toLocaleString("es-AR")}</p>
                <button class="boton-agregar" data-id="${producto.id}">Agregar al carrito</button>
            </div>
        </article>
    `).join("");
}

async function cargarProductos() {
    try {
        const respuesta = await fetch("data/productos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los productos");
        }

        productos = await respuesta.json();
        estadoCarga.style.display = "none";
        mostrarProductos(productos);
    } catch (error) {
        estadoCarga.textContent = "No se pudieron cargar los productos. Intenta nuevamente.";
    }
}

function mostrarCarrito() {
    if (carrito.length === 0) {
        productosCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito esta vacio.</p>';
    } else {
        productosCarrito.innerHTML = carrito.map((producto) => `
            <article class="producto-carrito">
                <img src="${producto.imagen}" alt="Carta ${producto.nombre}">
                <div>
                    <h3>${producto.nombre}</h3>
                    <p>$${producto.precio.toLocaleString("es-AR")} x ${producto.cantidad}</p>
                    <div class="producto-carrito__acciones">
                        <button class="boton-cantidad" data-accion="restar" data-id="${producto.id}">-</button>
                        <span>${producto.cantidad}</span>
                        <button class="boton-cantidad" data-accion="sumar" data-id="${producto.id}">+</button>
                    </div>
                </div>
                <button class="boton-quitar" data-accion="quitar" data-id="${producto.id}" aria-label="Quitar ${producto.nombre}">x</button>
            </article>
        `).join("");
    }

    const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    const precioTotal = carrito.reduce(
        (total, producto) => total + producto.precio * producto.cantidad,
        0
    );

    cantidadCarrito.textContent = cantidadTotal;
    totalCarrito.textContent = `$${precioTotal.toLocaleString("es-AR")}`;
    botonFinalizar.disabled = carrito.length === 0;
}

function agregarAlCarrito(idProducto) {
    const productoEnCarrito = carrito.find((producto) => producto.id === idProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        const productoElegido = productos.find((producto) => producto.id === idProducto);
        carrito.push({ ...productoElegido, cantidad: 1 });
    }

    mostrarCarrito();
}

function cambiarCantidad(idProducto, cambio) {
    const producto = carrito.find((item) => item.id === idProducto);
    producto.cantidad += cambio;

    if (producto.cantidad === 0) {
        carrito = carrito.filter((item) => item.id !== idProducto);
    }

    mostrarCarrito();
}

function abrirCarrito() {
    panelCarrito.classList.add("abierto");
    fondoCarrito.classList.add("visible");
    panelCarrito.setAttribute("aria-hidden", "false");
}

function cerrarCarrito() {
    panelCarrito.classList.remove("abierto");
    fondoCarrito.classList.remove("visible");
    panelCarrito.setAttribute("aria-hidden", "true");
}

contenedorProductos.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("boton-agregar")) {
        agregarAlCarrito(Number(evento.target.dataset.id));
    }
});

productosCarrito.addEventListener("click", (evento) => {
    const idProducto = Number(evento.target.dataset.id);
    const accion = evento.target.dataset.accion;

    if (accion === "sumar") cambiarCantidad(idProducto, 1);
    if (accion === "restar") cambiarCantidad(idProducto, -1);

    if (accion === "quitar") {
        carrito = carrito.filter((producto) => producto.id !== idProducto);
        mostrarCarrito();
    }
});

document.querySelector("#abrir-carrito").addEventListener("click", abrirCarrito);
document.querySelector("#cerrar-carrito").addEventListener("click", cerrarCarrito);
fondoCarrito.addEventListener("click", cerrarCarrito);

buscadorProductos.addEventListener("input", () => {
    const textoBuscado = buscadorProductos.value.toLowerCase().trim();
    const productosFiltrados = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(textoBuscado)
        || producto.tipo.toLowerCase().includes(textoBuscado)
    );

    mostrarProductos(productosFiltrados);
});

cargarProductos();
mostrarCarrito();
