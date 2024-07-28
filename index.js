// const express = require("express");
// const app = express();
// const cors = require("cors");
// const port = process.env.PORT || 5000;
// require("dotenv").config();

// // Middleware
// app.use(cors());
// app.use(express.json());

// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o8mpxcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     await client.connect();
//     console.log("Connected to MongoDB!");

//     const userCollection = client.db("usermanagementdb").collection("users");
//     // app.get("/users", async(req, res) =>{
//     //   const result = await userCollection.find().toArray();
//     //   res.send(result);
//     // })
//     // Get all users
//     app.get("/users", async (req, res) => {
//       const result = await userCollection.find().toArray();
//       res.send(result);
//     });

//     // 

//     // 
//     // Add new user
//     app.post("/users", async (req, res) => {
//       const user = req.body;

//       // Check if user already exists
//       const query = { email: user.email };
//       const existingUser = await userCollection.findOne(query);

//       if (existingUser) {
//         return res.send({ message: "User already exists", insertedId: null });
//       }

//       try {
//         const result = await userCollection.insertOne(user);
//         res.send({
//           message: "User added successfully",
//           insertedId: result.insertedId,
//         });
//       } catch (error) {
//         console.error("Error inserting user:", error);
//         res
//           .status(500)
//           .send({ message: "Failed to add user", error: error.message });
//       }
//     });

//     // Routes
//     app.get("/", (req, res) => {
//       res.send("Welcome to the API!");
//     });

//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// }

// run().catch(console.dir);
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o8mpxcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    // console.log("Connected to MongoDB!");

    const userCollection = client.db("usermanagementdb").collection("users");

    // Get all users
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // Add new user
    app.post("/users", async (req, res) => {
      const user = req.body;

      // Check if user already exists
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }

      try {
        const result = await userCollection.insertOne(user);
        res.send({
          message: "User added successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Error inserting user:", error);
        res
          .status(500)
          .send({ message: "Failed to add user", error: error.message });
      }
    });

    // Block user
    app.patch("/users/block/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await userCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "blocked" } }
        );
        res.send(result);
      } catch (error) {
        console.error("Error blocking user:", error);
        res
          .status(500)
          .send({ message: "Failed to block user", error: error.message });
      }
    });

    // Unblock user
    app.patch("/users/unblock/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await userCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "active" } }
        );
        res.send(result);
      } catch (error) {
        console.error("Error unblocking user:", error);
        res
          .status(500)
          .send({ message: "Failed to unblock user", error: error.message });
      }
    });

    // Delete user
    app.delete("/users/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await userCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        console.error("Error deleting user:", error);
        res
          .status(500)
          .send({ message: "Failed to delete user", error: error.message });
      }
    });

    // Routes
    app.get("/", (req, res) => {
      res.send("Welcome to the API!");
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run().catch(console.dir);
