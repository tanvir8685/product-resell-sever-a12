const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const cors = require('cors');

const products = require('./data/producucts.json')


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('its working')
})


app.get('/category/:id', (req, res) => {
    const id = req.params.id;
    const category_product = products.filter(product => product.cat_id === id);
    res.send(category_product)
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
    try{
        const categoriesOptionCollection=client.db('products-resell').collection('categories')

        app.get('/vehaicel-categories',async(req,res)=>{
            const query={};
            const categories=await categoriesOptionCollection.find(query).toArray();
            res.send(categories)
        })

    }
    finally{

    }
}
run().catch(console.log);







app.listen(port, () => {
    console.log('its working on', port)
})