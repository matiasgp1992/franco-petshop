
const endpoint = `https://apipetShop.herokuapp.com/api/articulos`
let seccion = document.querySelector("header").id
// VUE
const app = Vue.createApp({
    data() {
        return {
            productos: [],
            productosJugueteria: [],
            productosFarmacia: [],
            productosFiltrados: [],
            carrito: [],
            busqueda: "",
            noProducts: false,
            isEmptyCart: true,
            carga: true,
            precioTotal: 0,
            nombreMascota: "Firulais",
            animalesJuego: [
                {
                    "id": "gato",
                    "src": "./assets/gato.png"
                },
                {
                    "id": "hamster",
                    "src": "./assets/hamster.png"
                },
                {
                    "id": "franco",
                    "src": "./assets/franco.png"
                },
                {
                    "id": "gaviota",
                    "src": "./assets/gaviota.png"
                }
            ],
            animalAMostrar: ""
        }
    },
    created() {
        fetch(endpoint)
            .then(respuesta => respuesta.json())
            .then(data => {
                this.productos = data.response;
                this.filtrarProductos();
                this.busquedaProductos
                this.carga = !this.carga
            })
            .catch(err => console.error(err.message))
    },
    mounted() {
        if (localStorage.getItem('carrito')) {
            try {
                this.carrito = JSON.parse(localStorage.getItem('carrito'));
            } catch (e) {
                localStorage.removeItem('carrito');
            }
        }
    },
    methods: {
        lastStock(producto){
            console.log(producto)
            return producto["stock"]<=5;
        },
        filtrarProductos() {
            this.productosFarmacia = this.productos.filter(producto => producto.tipo == "Medicamento")
            this.productosJugueteria = this.productos.filter(producto => producto.tipo == "Juguete")
        },
        alertaContacto() {
            alertify.defaults.glossary.title = "¡Qué bien!"
            alertify.alert('Nos vamos a comunicar prontisimo con vos, acordate que estamos en Caballito y podes venir a visitarnos cuando quieras! Atentamente: Franco y sus amigos');
        },
        alertaStock(producto) {
            alertify.defaults.glossary.title = "¡Ups!"
            alertify.alert(`Acabamos de cargar en tu carrito la última unidad de "${producto.nombre}". No te preocupes, ¡ya mismo estamos llamando a nuestro proveedor!`);
        },
        guardarCarrito() {
            const parsed = JSON.stringify(this.carrito);
            localStorage.setItem('carrito', parsed);
        },
        agregarProductoCarrito(producto) {
            let pos = this.carrito.findIndex(prod => prod._id == producto._id);
            if (this.carrito.some(prod => prod._id == producto._id)) {
                if (this.carrito[pos]["stock"] > 0) {
                    this.carrito[pos]["cantidad"]++;
                    this.carrito[pos]["stock"]--;
                } else if (this.carrito[pos].stock == 0) {
                    this.alertaStock(producto)
                }
            } else {
                let productoAComprar = {
                    "_id": producto._id,
                    "nombre": producto.nombre,
                    "descripcion": producto.descripcion,
                    "precio": producto.precio,
                    "imagen": producto.imagen,
                    "cantidad": 1,
                    "stock": producto.stock - 1
                }
                this.carrito.push(productoAComprar);
            }
            this.guardarCarrito();
            this.isEmptyCartWatcher()
        },
        quitarProductoCarrito(producto) {
            if (this.carrito.some(prod => prod._id == producto._id)) {
                let pos = this.carrito.findIndex(prod => prod._id == producto._id);
                if (this.carrito[pos]["cantidad"] == 1) {
                    this.carrito[pos]["stock"]++;
                    this.carrito.splice(pos, 1)
                    this.guardarCarrito();
                    this.isEmptyCartWatcher()
                    return
                } else if (this.carrito[pos]["cantidad"] == 0) {
                    console.log("Entre acá")
                    this.guardarCarrito();
                    this.isEmptyCartWatcher()

                    return
                }
                this.carrito[pos]["cantidad"] = this.carrito[pos]["cantidad"] - 1;
                this.carrito[pos]["stock"]++;
                this.guardarCarrito();
                this.isEmptyCartWatcher()

            }
            this.guardarCarrito();
            this.isEmptyCartWatcher()

        },
        obtenerCantidadProducto(producto) {
            if (this.carrito.some(prod => prod._id == producto._id)) {
                let pos = this.carrito.findIndex(prod => prod._id == producto._id);
                console.log(pos)
                return this.carrito[pos].cantidad
            } else {
                return 0
            }
        },
        subtotalProducto(producto) {
            return producto.precio * producto.cantidad
        },
        eliminarProducto(producto) {
            let pos = this.carrito.findIndex(prod => prod._id == producto._id);
            this.carrito.splice(pos, 1)
            this.guardarCarrito();
            this.isEmptyCartWatcher()

        },
        mostrarAnimal(animal) {
            imageSrc = this.animalesJuego.filter(elem => elem.id == animal)
            console.log(imageSrc[0].src)
            this.animalAMostrar = imageSrc[0].src;
        },
        isEmptyCartWatcher() {
            console.log(this.carrito.length == 0)
            if (this.carrito.length == 0) {
                this.isEmptyCart = true;
            } else {
                this.isEmptyCart = false;
            }
        }
    },
    computed: {
        busquedaProductos() {
            if (seccion == "jugueteria") {
                this.productosFiltrados = this.productosJugueteria.filter(producto => producto.nombre.toLowerCase().includes(this.busqueda.toLowerCase()))
                this.noProductstoShow
                return this.productosFiltrados
            }
            this.productosFiltrados = this.productosFarmacia.filter(producto => producto.nombre.toLowerCase().includes(this.busqueda.toLowerCase()))
            this.noProductstoShow
            return this.productosFiltrados
        },
        noProductstoShow() {
            if (this.productosFiltrados.length == 0) {
                this.noProducts = true;
            } else {
                this.noProducts = false
            }
        },
        totalProductosCarrito() {
            suma = this.carrito.reduce((acumulador, producto) => {
                return acumulador += producto.cantidad
            }, 0)
            return suma;
        },
        calcularPrecioTotal() {
            return this.carrito.reduce((acum, producto) => {
                return acum += (producto.precio * producto.cantidad)
            }, 0)
        }


    }
})
const debug = app.mount("#app")


function removeTransition(e) {
    if (e.propertyName !== "transform") return;
    this.classList.remove("playing")
}

const keys = document.querySelectorAll(".key")
keys.forEach(key => key.addEventListener("transitionend", removeTransition))

window.addEventListener(("click"), (e) => {
    keyCode = e.srcElement.dataset.key
    const audio = document.querySelector(`audio[data-key="${keyCode}"]`)
    const key = document.querySelector(`.key[data-key="${keyCode}"]`)
    if (!audio) return;
    audio.currentTime = 0;
    audio.play()
    key.classList.add("playing")
})