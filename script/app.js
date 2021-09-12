// creo una app de clase Vue a traves del método createApp()
// recibe como argumento un objeto con métodos y propiedades,
// para manejar la informacion q va a tener nuestra data usamos
// lo siguiente


// let chamber = document.querySelector("body").id
const endpoint = `https://apipetShop.herokuapp.com/api/articulos`
// const init = {
//     headers: {
//         "X-API-key": "eObmd0hjXfacZmdqvTlfLNE1iyVFB4jp8yxtLqDP"
//     }
// }
// VUE
const app = Vue.createApp({
    data() {
        return {
            productos: [],
            productosJugueteria: [],
            productosFarmacia: [],
            carrito:[],
            nombreMascota:"tu mascota"
        }
    },
    created() {
        fetch(endpoint)
            .then(respuesta => respuesta.json())
            .then(data => {
                this.productos = data.response;
                this.filtrarProductos();
            })
            .catch(err => console.error(err.message))
    },
    methods: {
        filtrarProductos() {
            this.productosFarmacia = this.productos.filter(producto => producto.tipo == "Medicamento")
            this.productosJugueteria = this.productos.filter(producto => producto.tipo == "Juguete")
        },
        alertaContacto(){
            alertify.defaults.glossary.title = "¡Qué bien!"
            alertify.alert('Nos vamos a comunicar prontisimo con vos, acordate que estamos en Caballito y podes venir a visitarnos cuando quieras! Atentamente: Franco y sus amigos');
        }
    },
    computed: {
        


    }
})
const debug = app.mount("#app")
const alerta = alertify




// const app = Vue.createApp({
//     // funcion data, devuelve un objeto con mucha información
//     data() {
//         return {
//             nombre: "Rodrigo",
//             apellido: "Paris",
//             edad: 30,
//             esVisible: true,
//             posts: [
//                 {
//                     titulo: "Este es un post",
//                     cuerpo: "este es el primero de todos",
//                     imagen: "./assets/confused.png"
//                 },
//                 {
//                     titulo: "Este es otro post",
//                     cuerpo: "este es el segundo de todos"
//                 },
//                 {
//                     titulo: "Este es el ultimo post",
//                     cuerpo: "terminamos"
//                 }
//             ]
//         }
//     },
//     methods: {
//         aumentarEdad() {
//             this.edad++
//         },
//         disminuirEdad() {
//             this.edad--
//         },
//         setearEdad(edad) {
//             this.edad = edad
//         },
//         
//         restablecerNombre(nombre) {
//             this.nombre = nombre
//         },
//         toggleVisibilidad() {
//             this.esVisible = !this.esVisible
//         }
//     }
// })

// // monto esa aplicación en el elemento del dom que tenga el ID app (similiar a query selector)
// app.mount("#app")