import {Router} from 'express'
import Api from '../apiClass'
const router = Router()
// aca tengo que poner la direccion desde el archivo apiClass que es el que va a consumir esa ruta! No desde mi archivo actual.
const api = new Api("/dataBase/products.json")

router.get('/', async (req,res)=>{
    const products = await api.getAll()
    res.json(products)
})

router.get('/:id', async (req,res)=>{
    const {id} = req.params
    const product = await api.getById(id)
    res.json(product)
})

router.post('/', async (req,res)=>{
    const obj = req.body
    const newId= await api.saveNew(obj)
    res.json(newId)
})


export default router