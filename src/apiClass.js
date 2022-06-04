import fs from 'fs'
// const fs = require('fs')

export default class Contenedor {
    constructor(file) {
        this.file = __dirname + file;
    }

// las primeras 3 son funciones accesorias para armar más facilmente los pedidos y escritura de la base de datos    
    async read() {
     let allProductsArray = [];
        try {
            allProductsArray = await fs.promises.readFile(this.file, 'utf8');
            allProductsArray.length > 0 ? allProductsArray = JSON.parse(allProductsArray) : allProductsArray = [];
        } catch (err) {
            console.log('Error en la lectura del archivo', err);
        }
        return allProductsArray;
    }

    async getNextId() {
        let lastId = 0;
        let allProductsArray = await this.read();
        if (allProductsArray.length > 0) {
            lastId = allProductsArray[allProductsArray.length - 1].id;
        }
        return lastId + 1;
    }

    async write(allProductsArray) {
        let json = JSON.stringify(allProductsArray);
        try {
            await fs.promises.writeFile(this.file, json);
            console.log('escritura de archivo exitosa')
        } catch (err) {
            console.log('Error en la escritura', err);
        }
    }

// A partir de aca tenemos las funciones que consultan y escriben la base de datos y las que vamos a usar en los archivos de rutas.

    // Esta forma de hacer saveNew no es la más eficiente, estamos leyendo el archivo tanto en el getNextID como en el read. Poderia hacerse de forma tal de leer el archivo una sola vez
    async saveNew(product) {
        try {
            let nextId = await this.getNextId();  
            product.id = nextId;
            console.log(product)
            const allProductsArray = await this.read();
            allProductsArray.push(product);
            await this.write(allProductsArray);
            return nextId
        }
        catch {
            console.log('Error al guardar un objeto', err);
        }
    }

    async getById(id) {
        try {
            let allProductsArray = await this.read();
            let product = allProductsArray.find(product => product.id == id);
            product ? console.log("busqueda por ID exitosa") : console.log("el producto con el ID buscado no fue encontrado")
            return product ? product : null;
        }
        catch {
            console.log('Error en la busquedo por ID', err);
        }
    }

    async getAll() {
        let allProductsArray = await this.read();
        return allProductsArray;
    }

    async deleteById(id) {
        let allProductsArray = await this.read();
        let index = allProductsArray.findIndex(product => product.id == id);
        // findIndex devuelve -1 si no encuentra el valor, entonces podemos usar el if de abajo para saber si encontro un valor.
        if (index >= 0) {
            allProductsArray.splice(index, 1);
            // aca deberia ver que no entre al write antes de resolver el splice de arriba!
            await this.write(allProductsArray);
            return true
        } else {
            return false
        }
    }

    async replaceById(id,product) {    
        let allProductsArray = await this.read();
        let index = allProductsArray.findIndex(product => product.id == id);
        product.id = Number(id);
        // findIndex devuelve -1 si no encuentra el valor, entonces podemos usar el if de abajo para saber si encontro un valor.
        if (index >= 0) {
            allProductsArray.splice(index, 1, product);
            // aca deberia ver que no entre al write antes de resolver el splice de arriba!
            this.write(allProductsArray);
            return true
        } else {
            return false
        }
    }

    async deleteProductById(id_prod, id, cart) {
        let index = await cart.products.findIndex(product => product.id == id_prod);
        // findIndex devuelve -1 si no encuentra el valor, entonces podemos usar el if de abajo para saber si encontro un valor.
        if (index >= 0) {
            cart.products.splice(index, 1);
            await this.replaceById(id, cart);
            return cart
        } else {
            return false
        }
    }

/*     deleteAll() {
        let allProductsArray = [];
        this.write(allProductsArray);
    } */

}