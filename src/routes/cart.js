import {Router} from 'express'
import Api from '../apiClass'
const router = Router()

const apiCart = new Api("/dataBase/cart.json")
const apiProd = new Api("/dataBase/products.json")

router.get('/', async (req,res)=>{
    const cart = await apiCart.getAll()
    res.json(cart)
})

router.post('/', async (req,res)=>{
    // el objeto lo tengo que armar desde el front, con todos los productos que tiene el carrito. Aca solo guardo el array de productos y le asigno un ID-carrito
    const obj = {}
    obj.products = req.body
    obj.timestamps = Date.now()
    const newId = await apiCart.saveNew(obj)
    res.json(newId)
})

router.delete('/:id', async (req,res)=>{
    const {id} = req.params
    const exito = await apiCart.deleteById(id)
    if (exito) {
        res.json("carrito vaciado y eliminado con exito")
    } else {
        res.json("el carrito no fue encontrado y por lo tanto no pudimos eliminarlo")
    }
})

router.get('/:id', async (req,res)=>{
    const {id} = req.params
    const cart = await apiCart.getById(id)
    if (cart == null ) {
        res.json("No existe ningun carrito con el ID buscado")
    } else {
        res.json(cart.products)
    }  
})

// Hay un problema con que el carrito no maneja cantidad de productos, solo productos. Entonces cuando metemos un producto repetido no puedo checkear si existe y sumarle uno. Por lo tanto estoy decidiendo cargar repetido el producto.
router.post('/:id/productos/:id_prod', async (req,res)=>{
    // Suponiendo que desde el front recibo solo el ID-producto como body (asi dice la consigna). Voy a buscar el producto con ese ID y luego agregarlo al carrito con ID-carrito
    // el enunciado esta medio raro, dice que recibis un ID de producto pero no explica si por body o por params, voy a asumir que es por params.
    const {id, id_prod} = req.params
    const product = await apiProd.getById(id_prod)
    if (product == null ) {
        res.json("el ID del producto no existe! Intente con un producto valido")
    } else {
        const cart = await apiCart.getById(id)
        if (cart == null ) {
            res.json("el ID del carrito no existe! No puedes agregar productos a un carrito inexistente")
        } else {
            await cart.products.push(product)
            await apiCart.replaceById(id, cart)           
            res.json("Producto agregado con exito!")
        }
    }
})

// mismo comentario que arriba, si tenemos 2 productos iguales en el carrito, la funcion delete by ID los va a ir borrado de a uno.
router.delete('/:id/productos/:id_prod', async (req,res)=>{
    const {id, id_prod} = req.params
    // aca elegí primero buscar el carrito para ver si existe y luego hacer el delete by ID pasandole directamente el carrito que ya traje.
    const cart = await apiCart.getById(id)
    if (cart == null ) {
        res.json("el ID del carrito no existe! No puedes agregar productos a un carrito inexistente")
    } else {
        const newCart = await apiCart.deleteProductById(id_prod, id, cart)
        if (!newCart) {
            res.json("el ID del producto no esta dentro del carrito seleccionado y por lo tanto no podemos eliminarlo")
        } else {
            res.json("Producto eliminado con exito!")
        }
    }
})


export default router