import {Router} from 'express'
import Api from '../apiClass'
const router = Router()
// aca tengo que poner la direccion desde el archivo apiClass que es el que va a consumir esa ruta! No desde mi archivo actual.
const api = new Api("/dataBase/products.json")

const admin = true;

function access(req,res,next){
    if(!admin){
        res.send("El acceso a esta ruta no esta permitida para tu tipo de usuario")
    } else {
        next()
    }
}

router.get('/', async (req,res)=>{
    const products = await api.getAll()
    res.json(products)
})

router.get('/:id', async (req,res)=>{
    const {id} = req.params
    const product = await api.getById(id)
    if (product == null ) {
        res.json("el ID buscado no existe")
    }
    res.json(product)
})

router.post('/', access, async (req,res)=>{
    const obj = req.body
    obj.timestamps = Date.now()
    const newId= await api.saveNew(obj)
    res.json(newId)
})

router.put('/:id', access, async (req,res)=>{
    const {id} = req.params
    const obj = req.body
    obj.timestamps = Date.now()
    const exito = await api.replaceById(id, obj)
    if (exito) {
        res.json("producto reemplazado con exito")
    } else {
        res.json("el producto no fue encontrado y por lo tanto no pudimos reemplazarlo")
    }
})

router.delete('/:id', access, async (req,res)=>{
    const {id} = req.params
    const exito = await api.deleteById(id)
    if (exito) {
        res.json("producto eliminado con exito")
    } else {
        res.json("el producto no fue encontrado y por lo tanto no pudimos borrarlo")
    }
})

export default router