const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rkqrz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanics');
        const serviceCollection = database.collection('services');

        ///GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Getting Specific Id', id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hitting the post api', service);
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        ///Delete API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);

        })
    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hitting My Server');
});
app.get('/new', (req, res) => {
    res.send('Hitting my new')
})
app.listen(port, () => {
    console.log('Running genius car mechanics', port);
})

/*
One time:
1. heroku account open
2.Heroku software install

Every Projects:
1.git init
2. .gitignore(node_modules,.env)
3. Push everything to github
4. make sure that you have this script: "start": "node index.js"
5. make sure: put process.env.PORT in front of your port number
6.heroku login
7.heroku create (only one time for a project)
8. command: git push heroku main
-------

Update:
1.save everything check locally
2. git add, git commit-m"",git push
3.git push heroku main
*/