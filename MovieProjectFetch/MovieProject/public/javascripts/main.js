
let CDArray = [];

const storeIDArray = ['98053', '98007', '98077', '98055', '98011', '98046'];
const cdIDArray = ['123456', '123654', '321456', '321654', '654123', '654321', '543216', '354126', '621453', '623451']

let orderObject = function (pStoreID, pSalesPersonID, pCdID, pPricePaid, pDate) {
    this.StoreID = pStoreID;
    this.SalesPersonID = pSalesPersonID;
    this.CdID = pCdID;
    this.PricePaid = pPricePaid;
    this.Date = pDate;
}

let timeElapsed;

document.addEventListener("DOMContentLoaded", function () {

    timeElapsed = Date.now();

// add button events ************************************************************************

    document.getElementById("buttonGet").addEventListener("click", function () {
        createList();      
    });

    document.getElementById("buttonCreate").addEventListener("click", function () {
        CreateOneOrder();      
    });
    
    document.getElementById("buttonSubmitOne").addEventListener("click", function () {
        PostOneOrder();
    });

    document.getElementById("buttonSubmit500").addEventListener("click", function () {
        for (let i = 0; i < 500; i++)
        {
            WriteOneOrder();
        }
    });

    document.getElementById("button15").addEventListener("click", function () {
        createList15();
    });

});  
// end of wait until document has loaded event  *************************************************************************

function GetTimeString()
{
    timeElapsed = timeElapsed + ((Math.floor(Math.random() * 25000) + 5000) * 60);
    let rightNow = new Date(timeElapsed);
    return rightNow.toISOString();
}

function CreateOneOrder(){
    let storeNumberPointer = Math.floor(Math.random() * storeIDArray.length);
    let randomStoreID = storeIDArray[storeNumberPointer];

    let salesPersonPointer = (Math.floor(Math.random() * 4)) + 1;
    let salesPersonID = (storeNumberPointer * 4) + salesPersonPointer;

    let cdID = cdIDArray[Math.floor(Math.random() * cdIDArray.length)];
    let pricePaid = Math.floor(Math.random() * 11) + 5;
    let randomTimeValue = GetTimeString();

    document.getElementById("storeID").value = randomStoreID;
    document.getElementById("salesPersonID").value = salesPersonID;
    document.getElementById("cdID").value = cdID;
    document.getElementById("pricePaid").value = pricePaid;
    document.getElementById("date").value = randomTimeValue;
}

function PostOneOrder(){
    CreateOneOrder();
    let newOrder = new orderObject(
        document.getElementById("storeID").value,
        document.getElementById("salesPersonID").value,
        document.getElementById("cdID").value,
        document.getElementById("pricePaid").value,
        document.getElementById("date").value 
    );

    fetch('/ShowOneOrder', {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));

};

function WriteOneOrder(){
    CreateOneOrder();
    let newOrder = new orderObject(
        document.getElementById("storeID").value,
        document.getElementById("salesPersonID").value,
        document.getElementById("cdID").value,
        document.getElementById("pricePaid").value,
        document.getElementById("date").value  
    );

    fetch('/StoreOneOrder', {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));


};

function createList() {
// update local array from server

    fetch('/getAllCDs')
    // Handle success
    .then(response => response.json())  // get the data out of the response object
    .then( responseData => fillUL(responseData))    //update our array and li's
    .catch(err => console.log('Request Failed', err)); // Catch errors
};

function createList15() {
    // update local array from server
    fetch('/getAll15')
        // Handle success
        .then(response => response.json())  // get the data out of the response object
        .then(responseData => fillUL15(responseData))    //update our array and li's
        .catch(err => console.log('Request Failed', err)); // Catch errors
};

function fillUL(data) {
        // clear prior data
    var divOrderList = document.getElementById("divCDList");
    while (divOrderList.firstChild) {    // remove any old data so don't get duplicates
        divOrderList.removeChild(divOrderList.firstChild);
    };

    var ul = document.createElement('ul');
    CDArray = data;
    CDArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        li.innerHTML = element.StoreID + ":  &nbsp &nbsp  &nbsp &nbsp " + 
        element.SalesPersonID + "  &nbsp &nbsp  &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp"  
        + element.CdID + " &nbsp &nbsp  &nbsp &nbsp  " 
        + element.PricePaid + " &nbsp &nbsp  &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp "
        + element.Date
        ul.appendChild(li);
    });
    divOrderList.appendChild(ul)
}

function fillUL15(data) {
    // clear prior data
    var divOrderList = document.getElementById("divCDList");
    while (divOrderList.firstChild) {    // remove any old data so don't get duplicates
        divOrderList.removeChild(divOrderList.firstChild);
    };

    let Store98053 = 0;
    let Store98007 = 0;
    let Store98077 = 0;
    let Store98055 = 0;
    let Store98011 = 0;
    let Store98046 = 0;

    CDArray = data;
    CDArray.forEach(element => {
        if (element.StoreID == "98053") {
            Store98053++;
        }
        else if (element.StoreID == "98007") {
            Store98007++;
        }
        else if (element.StoreID == "98077") {
            Store98077++;
        }
        else if (element.StoreID == "98055") {
            Store98055++;
        }
        else if (element.StoreID == "98011") {
            Store98011++;
        }
        else {
            Store98046++;
        };
    });

    document.getElementById("textString").innerHTML = "The number of $15 CD's each store sold between April 17th and April 20th:</br>"
        + "<br/>Store 98053: &nbsp " + Store98053
        + "<br/>Store 98007: &nbsp " + Store98007
        + "<br/>Store 98077: &nbsp " + Store98077
        + "<br/>Store 98055: &nbsp " + Store98055
        + "<br/>Store 98011: &nbsp " + Store98011
        + "<br/>Store 98046: &nbsp " + Store98046;
}


  
