const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

//middleWare
app.use(cors());
app.use(express.json());

//-------------------------------------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@project1.4j1y0pd.mongodb.net/?retryWrites=true&w=majority&appName=project1`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // database name
    const userCollection = client
      .db("customFormApplication")
      .collection("users");

    // user related api
    app.post("/users", async (req, res) => {
      console.log("post method success");
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      console.log("user data get");
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    app.patch("/update/user/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            name: req?.body?.name,
            photo: req?.body?.photo,
          },
        };

        const result = await userCollection.updateOne(filter, updatedDoc);
        res.send(result);
      } catch (error) {
        res.status(404).json({ error: error.message });
      }
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//-------------------------------------------------

app.get("/", (req, res) => {
  res.send("custom form application server is running");
});

app.listen(port, () => {
  console.log(`custom form application server is running on port ${port}`);
});
