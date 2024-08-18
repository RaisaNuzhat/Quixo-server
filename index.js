const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;
//  middlewares
const corsOptions = {
    origin: [
      "http://localhost:5173",
      "https://quixo-91bef.web.app",
      "https://quixo-91bef.firebaseapp.com",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  app.use(express.json());
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9odt6wv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    const productCollection = client.db("quixo").collection("products");
    app.get("/all-products", async (req, res) => {
        const size = parseInt(req.query.size)
        const page = parseInt(req.query.page)-1
        const filter = req.query.filter
        const sort = req.query.sort
        const search = req.query.search
        console.log(size,page,filter)
        let query = {
          // Product_Name: { $regex: search, $options: 'i' },
        }
        if (filter) query.Category = filter
        let options = {}
        if (sort) options = { sort: {  Price : sort === 'asc' ? 1 : -1 } }
        const result = await productCollection.find(query,options).skip(page*size).limit(size).toArray();
        console.log(result);
        res.send(result);
      });
// get all products for count
      app.get("/productcount", async (req, res) => {
        const filter = req.query.filter
        const search = req.query.search
      let query = {
        // Product_Name: { $regex: search, $options: 'i' },
      }
        if (filter) query.Category = filter
        const count = await productCollection.countDocuments(query);
        res.send({count})
      });
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("SIMPLE CRUD IS RUNNNING");
});

app.listen(port, () => {
  console.log(`simple crud is running on port:${port}`);
});
  