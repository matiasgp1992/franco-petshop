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
            carga: true,
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
                    "id" : "gaviota",
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
                this.carga = false
            })
            .catch(err => console.error(err.message))
    },
    methods: {
        filtrarProductos() {
            this.productosFarmacia = this.productos.filter(producto => producto.tipo == "Medicamento")
            this.productosJugueteria = this.productos.filter(producto => producto.tipo == "Juguete")
        },
        alertaContacto() {
            alertify.defaults.glossary.title = "¡Qué bien!"
            alertify.alert('Nos vamos a comunicar prontisimo con vos, acordate que estamos en Caballito y podes venir a visitarnos cuando quieras! Atentamente: Franco y sus amigos');
        },
        agregarProductoCarrito(producto) {
            console.log("estamos agregando" + producto.nombre)
            if (this.carrito.some(prod => prod._id == producto._id)) {
                console.log("este producto ya esta en el carrito")
                let pos = this.carrito.findIndex(prod => prod._id == producto._id);
                console.log(pos)
                console.log()
                this.carrito[pos]["cantidad"] = this.carrito[pos]["cantidad"] + 1;
            } else {
                let productoAComprar = {
                    "_id": producto._id,
                    "nombre": producto.nombre,
                    "descripcion": producto.descripcion,
                    "precio": producto.precio,
                    "imagen": producto.imagen,
                    "cantidad": 1
                }
                this.carrito.push(productoAComprar);
            }
        },
        quitarProductoCarrito(producto) {
            console.log("Llegamos al método eliminar el producto")

            if (this.carrito.some(prod => prod._id == producto._id)) {
                let pos = this.carrito.findIndex(prod => prod._id == producto._id);
                if (this.carrito[pos]["cantidad"] == 1) {
                    this.carrito.splice(pos, 1)
                    console.log("este producto ya no esta en el carrito")
                    return
                } else if (this.carrito[pos]["cantidad"] == 0) {
                    return
                }
                this.carrito[pos]["cantidad"] = this.carrito[pos]["cantidad"] - 1;
            }
        },
        subtotalProducto(producto) {
            return producto.precio * producto.cantidad
        },
        eliminarProducto(producto) {
            let pos = this.carrito.findIndex(prod => prod._id == producto._id);
            this.carrito.splice(pos, 1)
        },
        mostrarAnimal(animal) {
            imageSrc = this.animalesJuego.filter(elem=> elem.id == animal)
            console.log(imageSrc[0].src)
            this.animalAMostrar = imageSrc[0].src;
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
            return this.carrito.reduce((acumulador, producto) => {
                return acumulador += producto.cantidad
            }, 0)
        },
        escucharWindow(){
           
            
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