
var express = require('express');
var router = express.Router();
var fs = require("fs");

// start by creating data so we don't have to type it in each time
let ServerOrderArray = [];


const mongoose = require("mongoose");

const OrderSchema = require("../orderSchema");


// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection is in (MoviesDB)
const dbURI =
    "mongodb+srv://ISIT420:isitpassword420@teresa-cluster.45mkj.mongodb.net/Orders?retryWrites=true&w=majority";

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
    reconnectTries: Number.MAX_VALUE,
    poolSize: 10
};

mongoose.connect(dbURI, options).then(
    () => {
        console.log("Database connection established!");
    },
    err => {
        console.log("Error connecting Database instance due to: ", err);
    }
);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});


/* Show one new Order, but doesn't save the Order */
router.post('/ShowOneOrder', function(req, res) {
  const newOrder = req.body;  // get the object from the req object sent from browser
  console.log(newOrder);
  // prepare a reply to the browser
  var response = {
    status  : 200,
    success : 'Added Successfully'
  }
  res.end(JSON.stringify(response)); // send reply
});

/* Save one order to file */
router.post('/StoreOneOrder', function (req, res) {

    let oneNewCD = new OrderSchema(req.body);
    console.log(req.body);
    oneNewCD.save((err, todo) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            // console.log(todo);
            // res.status(201).json(todo);

            var response = {
                status: 200,
                success: 'Added Successfully'
            }
            res.end(JSON.stringify(response)); // send reply

        }
    });
});

// GET all CD data 
router.get('/getAllCDs', function (req, res) {
    // find {  takes values, but leaving it blank gets all}
    OrderSchema.find({}, (err, AllCDs) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        res.status(200).json(AllCDs);
    });
});

//Get Stores who sold $15 CD's April 17th through April 20th
router.get('/getAll15', function (req, res) {
    let value = "15";
    let date1 = "2022-04-17T01:37:04.072Z";
    let date2 = "2022-04-20T23:18:05.392Z";
    OrderSchema.find({ PricePaid: value, Date: { $gt: date1, $lt: date2 } }).sort({ Year: -1 }).exec(function (err, All15) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        console.log(All15);
        res.status(200).json(All15);
    });
});


module.exports = router;
