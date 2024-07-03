const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const cors = require('cors');



//middleware
app.use(cors());
app.use(express.json());


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u675lb8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


// function

async function  run(){
try{
     await client.connect();
     const todoDatabaseCollection = client.db("databaseCenter").collection("store")

     //all post data get 
     app.get('/tasks' , async(req,res)=>{
        const cursor = todoDatabaseCollection.find({});
        const tasks = await cursor.toArray();
        res.send({status:true, data:tasks})
     })
    //app.post todo
     app.post('/task' , async(req,res)=>{
         const task = req.body;
         const result = await todoDatabaseCollection.insertOne(task);
         res.send(result)
        })
 //  app. delete id and database
     app.get('/task/:id' , async(req,res)=>{
        const id = req.params.id;
        const result = await  todoDatabaseCollection.findOne({_id: new ObjectId(id)})
        res.send(result)
          
        })
        app.delete('/task/:id' , async(req,res)=>{
            const id  = req.params.id;
            const result = await todoDatabaseCollection.deleteOne({_id: new ObjectId(id)})
            res.send(result)
          })
  

    // app.put todo update 

    app.put('/task/:id', async(req, res)=>{
        const id= req.params.id;
        const task = req.body;
        const filter = {_id: new ObjectId(id)};
        const updateDoc={
            $set:{
                status:task.status,
                title: task.title,
                description: task.description,
                dateTime:task.dateTime,
                priority: task.priority,
            }
        }
        const result = await todoDatabaseCollection.updateOne(filter, updateDoc);
        res.json(result)
    })
}
finally{
     //await client.close();

}
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Todo server is running ')
})

app.listen(port, () => {
  console.log('listening to the port ' , port)
})