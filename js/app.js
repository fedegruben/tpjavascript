const contenedorProductos = document.querySelector("#contenedor-productos");
const estadoCarga = document.querySelector("#estado-carga");

let productos = [];

function mostrarProductos(listaProductos) {
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

cargarProductos();
