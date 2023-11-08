const express = require('express');
const ObjectID = require('mongodb').ObjectId;

const router = express.Router();
const db = require('../db/conn');


// zwraca wszytkie produkty w bazie posortowane po nazwie
router.get('/products', (req, res) => {
    const collection = db.getDatabase().collection('products');

    collection.find().sort({ nazwa: 1 }).toArray().then((result) => {
        res.status(200).json(result)
    }).catch((error) => {
        res.status(500).send(error)
    });
});

// zwraca wszytkie produkty w bazie posortowane po type danych w endpoincie np. /products/sort/nazwa
router.get('/products/sort/:type', (req, res) => {
    const collection = db.getDatabase().collection('products');

    collection.find().sort({ [req.params.type]: 1 }).toArray().then((result) => {
        res.status(200).json(result)
    }).catch((error) => {
        res.status(500).send(error)
    });
});

router.get("/products/report", async (req, res) => {
    try {
        const collection = await db.getDatabase().collection('products');
        const report = await collection.aggregate([
            {$project: {
                _id: 0,
                nazwa: 1,
                ilosc: 1,
                "laczna_wartosc": {$multiply: ["$cena", "$ilosc"]}
            }}
        ]).toArray()
        res.status(200).json(report)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

//wstawia produkt do bazy o unikalnej nazwie
router.post("/products", async (req, res) => {
    try {
        const collection = await db.getDatabase().collection('products');
        const ifExists = await collection.find({ "nazwa": req.body.nazwa }).toArray()
        if (ifExists.length === 0) {
            const newItem = {
                nazwa: req.body.nazwa,
                cena: req.body.cena,
                ilosc: req.body.ilosc,
                opis: req.body.opis
            }
            const result = await collection.insertOne(newItem)
            res.status(200).send(result)
        } else {
            res.status(400).send("nazwa nie jest unikalana")
        }
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
});

//uaktulania obiekt o zadanym id
router.put("/products/:id", async (req, res) => {
    try {
        const collection = await db.getDatabase().collection("products")
        const query = { _id: new ObjectID(req.params.id) }
        const update = {
            $set: {
                nazwa: req.body.nazwa,
                cena: req.body.cena,
                ilosc: req.body.ilosc,
                opis: req.body.opis
            }
        }
        const result = await collection.updateOne(query, update)
        if (result.matchedCount === 1) res.status(200).send(result)
        else res.status(400).send("obiekt nie zostal zaktualizowany")
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
});

//usuwa produkt o zadanym id
router.delete("/products/:id", async (req, res) => {
    try {
        const collection = await db.getDatabase().collection("products")
        const query = {_id: ObjectID(req.params.id)}
        const result = await collection.deleteOne(query)
        console.log(result)
        if (result.deletedCount === 0) res.status(400).send("produkt nie zostal usuniety")
        else res.status(200).send(result)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
});

module.exports = router;
