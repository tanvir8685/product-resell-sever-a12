const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const jwt=require('jsonwebtoken')
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


function verifyJWT(req,res,next){
    // console.log('token inside verifyJWT',req.headers.authorization);
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(401).send('unauthorized access');
    }
    const token=authHeader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN,function(err,decoded){
        if(err){
            return res.status(403).send({message:'forbidden access'})
        }
        req.decoded=decoded;
        next();
    })
}


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
        const bokkingsCollection=client.db('products-resell').collection('bookings')
        const userCollection=client.db('products-resell').collection('alluser')


        // for load the all categories 

        app.get('/vehaicel-categories', async (req, res) => {
            const query = {};
            const categories = await categoriesOptionCollection.find(query).toArray();
            res.send(categories)
        });

        // all categories product 
        app.get('/category', async (req, res) => {
            const query = {};
            const products = await categoriesProductCollection.find(query).toArray();
            res.send(products)
        });
        // specific category product 
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { cat_id: id };
            const categorisProduct = await categoriesProductCollection.find(query).toArray();
            res.send(categorisProduct)

        });

        // make api for get bookings data 
        app.get('/bookings',verifyJWT, async (req, res) => {
            const email=req.query.email;
            
            const decodedEmail=req.decoded.email;

            if(email!==decodedEmail){
                return res.status(403).send({message:'forbidden access'});
            }
            const query = {email:email};
            const bookingproducts = await bokkingsCollection.find(query).toArray();
            res.send(bookingproducts)
        });
        app.post('/bookings',async(req,res)=>{
            const bookings=req.body;
            const result=await bokkingsCollection.insertOne(bookings);
            res.send(result);
        })

        // make api for all user 
        app.get('/alluser', async (req, res) => {
            
            let query = {};
            if(req.query.categori){
                query={
                    categori:req.query.categori
                }
            } 
            const alluser = await userCollection.find(query).toArray();
            res.send(alluser)
        });
        app.post('/alluser',async(req,res)=>{
            const alluser=req.body;
            const result=await userCollection.insertOne(alluser);
            res.send(result);
        });
        // try for seller 
        app.get('/alluser/seller/:email',async(req,res)=>{
            const email=req.params.email;
            const query={email};
            const seller=await userCollection.findOne(query);
            res.send({isSeller:seller?.categori==='seller'})
        })


        app.get('/jwt',async(req,res)=>{
            const email=req.query.email;
            const query={email:email}
            const user=await userCollection.findOne(query);
            if(user ){
                const token=jwt.sign({email},process.env.ACCESS_TOKEN,{expiresIn:'5h'})
                return res.send({accessToken:token})

            }
            console.log(user)
            res.status(403).send({token:""})
        });
        app.get('/alluser/admin/:email',async(req,res)=>{
            const email=req.params.email;
            const query={email}
            const user=await userCollection.findOne(query);
            res.send({isAdmin:user?.role==='admin'});
        })
        app.put('/alluser/admin/:id',verifyJWT,async(req,res)=>{
            const decodedEmail=req.decoded.email;
            const query={email:decodedEmail};
            const user= await userCollection.findOne(query);
            if(user.role !=='admin'){
                return res.status(403).send({message:'forbidden'})
            }
            const id =req.params.id;
            const filter={_id:ObjectId(id)}
            const options={upsert:true};
            const updatedDoc={
                $set:{
                    role:'admin'
                }
            }
            const result =await userCollection.updateOne(filter,updatedDoc,options);
            res.send(result);


        })


    }
    finally {

    }
}
run().catch(console.log);







app.listen(port, () => {
    console.log('its working on', port)
})