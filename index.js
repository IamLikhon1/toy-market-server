const express = require('express');
const cors = require('cors');
const port=process.env.PORT||5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const categoryOne=require('./cetagoryOne.json')
const categoryTwo=require('./cetagoryTwo.json')
const categoryThree=require('./categoryThree.json')

// Middleware:

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.snwbd1q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

        const toysCollection=client.db('masterToy').collection('toys');

    app.get('/allToy',async(req,res)=>{
        let query={}
        if(req.query?.email){
            query={email:req.query.email}
        }
        
        const result=await toysCollection.find(query).toArray();
        res.send(result)
    });

    app.get('/allToy/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)};
        const result=await toysCollection.findOne(query);
        res.send(result)
    });

  


    app.post('/addToy',async(req,res)=>{
        const toyData=req.body;
        const result=await toysCollection.insertOne(toyData);
        res.send(result)
    });

    app.delete('/toyDelete/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const result=await toysCollection.deleteOne(query);
      res.send(result)

    });

    app.put('/updateToy/:id',async(req,res)=>{
      const id=req.params.id;
      const update=req.body;
      const filter={_id:new ObjectId(id)};
      const options={upsert:true};
      const data={
        $set:{
          price:update.price,
          quantity:update.quantity,
          description:update.description
        }
      }
      const result=await toysCollection.updateOne(filter,data,options);
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/',(req,res)=>{
    res.send('Cars Toys is running')
});


app.get('/categoryOne',(req,res)=>{
  res.send(categoryOne)
})
app.get('/categoryTwo',(req,res)=>{
  res.send(categoryTwo)
})
app.get('/categoryThree',(req,res)=>{
  res.send(categoryThree)
})

app.listen(port,()=>{
    console.log(`Cars toys is running on port:${port}`)
})