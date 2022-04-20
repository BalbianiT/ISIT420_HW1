
var express = require('express');
var router = express.Router();
var fs = require("fs");

// start by creating data so we don't have to type it in each time
let ServerOrderArray = [];


const mongoose = require("mongoose");

const OrderSchema = require("../orderSchema");


// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection is in (MoviesDB)
//const dbURI =
//    "mongodb+srv://ISIT420:isitpassword420@teresa-cluster.45mkj.mongodb.net/Orders?retryWrites=true&w=majority";

const dbURI = "mongodb+srv://exitvisa:Maythefourth@isit420.pk5eo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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
    let date1 = "2022-04-21T00:56:32.512Z";
    let date2 = "2022-04-24T00:56:32.512Z";
    OrderSchema.find({ PricePaid: value, TheDate: { $gt: date1, $lt: date2 } }).sort({ Year: -1 })
    .exec(function (err, All15) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        console.log(All15);
        res.status(200).json(All15);
    });
});

// GET the five employees who sold the most volume over the past four days 

router.get('/getFiveEmpMostVolList', function (req, res) {

    OrderSchema.aggregate([
//I create 500 orders, list them, and then cut and paste the first order time into the first date, and paste
// into the 2nd data, but bump the day by one so it covers 24 hours
        {$match: { TheDate: {"$gte": new Date("2022-04-21T00:56:32.512Z"), "$lt": new Date("2022-04-22T00:48:27.532Z") } } },
        { $group : { _id: {SalesPersonID : '$SalesPersonID',}, TotalSales: {$sum: "$PricePaid"}}},
        { $project : {SalesPersonID: '$_id.SalesPersonID', PricePaid: '$TotalSales', _id:0}},  // _id:0  Specifies the suppression of the _id field.
        { $sort : {PricePaid : -1}},
      ])

      .exec(function (err, storeRanking) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      console.log(storeRanking);
      res.status(200).json(storeRanking);
      });

});


module.exports = router;
