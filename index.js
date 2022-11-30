const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('its working')
})


app.get('/product/:id', (req, res) => {
    const id = req.params.id;
    const selectedProducts = products.find(product => product._id === id);
    res.send(selectedProducts)

})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ygtywwo.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const categoriesOptionCollection = client.db('products-resell').collection('categories')
        const categoriesProductCollection = client.db('products-resell').collection('products')

        app.get('/vehaicel-categories', async (req, res) => {
            const query = {};
            const categories = await categoriesOptionCollection.find(query).toArray();
            res.send(categories)
        });
        app.get('/category', async (req, res) => {
            const query = {};
            const products = await categoriesProductCollection.find(query).toArray();
            res.send(products)
        });
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;


            const query = { cat_id: id };


            const categorisProduct = await categoriesProductCollection.find(query).toArray();

            res.send(categorisProduct)

        })


    }
    finally {

    }
}
run().catch(console.log);







app.listen(port, () => {
    console.log('its working on', port)
})