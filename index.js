const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k5mh2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('brahmaputra_travels');
        const tourCollection = database.collection('tours');
        const orderCollection = database.collection('orders');


        // GET API
        app.get('/tours', async (req, res) => {
            const cursor = tourCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours)
        })

        // GET ORDER API
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders)
        })

        // GET SINGLE Tour
        app.get('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tour = await tourCollection.findOne(query);
            res.json(tour);
        })
        // GET SINGLE ORDER API
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const query = { email: email }
            const result = await orderCollection.find(query).toArray();
            res.json(result);
        })

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.findOne(query);
            res.json(result)
        })



        // POST API
        app.post('/tours', async (req, res) => {
            const tour = req.body;
            const result = await tourCollection.insertOne(tour);
            res.json(result);
        })

        // ADD ORDERS API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query)
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

        // UPDATE API
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedOrder.status
                }
            }
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Brahmaputra travels server is running')
});

app.listen(port, () => {
    console.log('Server is running at port', port)
})