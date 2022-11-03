const fs = require("fs").promises;
const path = require("path");

class Contenedor {

    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }

    async save(producto) {
        try {
            const productos = await this.getAll();
            if (productos.length === 0) {
                producto.id = 1;
            } else {
                producto.id = productos[productos.length - 1].id + 1;
            }
            productos.push(producto);
            await fs.writeFile(
                path.resolve("./", this.nombreArchivo),
                JSON.stringify(productos, null, 2)
            );
            return producto.id;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id) {
        try {
            const productos = await this.getAll();
            const producto = productos.find((producto) => producto.id === id);
            return producto;
        } catch (error) {
            console.log(error);
        }
    }

    async getAll() {
        try {
            const contenido = await fs.readFile(
                path.resolve("./", this.nombreArchivo),
                "utf-8"
            );
            return JSON.parse(contenido);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id) {
        try {
            const productos = await this.getAll();
            const producto = productos.find((producto) => producto.id === id);
            if (producto) {
                const index = productos.indexOf(producto);
                productos.splice(index, 1);
                await fs.writeFile(
                    path.resolve("./", this.nombreArchivo),
                    JSON.stringify(productos, null, 2)
                );
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteAll() {
        try {
            await fs.writeFile(
                path.resolve("./", this.nombreArchivo),
                JSON.stringify([], null, 2)
            );
        } catch (error) {
            console.log(error);
        }
    }
}

const contenedor = new Contenedor("productos.txt");

const main = async () => {

    await contenedor.save({
        title: "Vaca Lechera",
        price: 235600,
        id: 1,
        thumbnail:
            "https://revistageneticabovina.com/wp-content/uploads/2020/07/v1.jpg",
    });

    await contenedor.save({
        title: "Toro reproductor",
        price: 855000,
        id: 2,
        thumbnail:
        "https://secure.ganaderia.com/razas/Raza593184b741af4_02062017.jpg"
    });

    await contenedor.save({
        title: "Ternero",
        price: 130000,
        id: 3,
        thumbnail:
        "https://media.istockphoto.com/photos/hereford-calf-on-white-background-looking-at-camera-picture-id155004548?k=20&m=155004548&s=612x612&w=0&h=3b61RDqyrvDABSnDrPEzRhg8RK5bM80iaQaC6TY_964="
    });

    const producto = await contenedor.getById(2);
    console.log(producto);

    const productos = await contenedor.getAll();
    console.log(productos);

    const prod = await contenedor.deleteById(1);
    console.log(prod)
    
    await contenedor.deleteAll();
    
    const productos2 = await contenedor.getAll();
    console.log(productos2);
};

main();