const express = require('express');

const app = express();
const cors = require('cors');
const categories=require('./data/categories.json')
const products=require('./data/producucts.json')


const port = process.env.PORT || 5000;

app.use(cors());
app.get('/',(req,res)=>{
    res.send('its working')
})
app.get('/vehaicel-categories',(req,res)=>{
    res.send(categories)
})


app.get('/product/:id',(req,res)=>{
    const id=req.params.id;
    const selectedProducts=products.find(product=>product._id===id);
    res.send(selectedProducts)

})

app.listen(port,()=>{
    console.log('its working on',port)
})