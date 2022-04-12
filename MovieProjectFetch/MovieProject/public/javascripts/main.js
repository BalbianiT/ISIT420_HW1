
let CDArray = [];

const storeIDArray = ["98053", "98007", "98077", "98055", "98011", "98046"];
const cdIDArray = ["123456", "123654", "321456", "321654", "654123", "654321", "543216", "354126", "621453", "623451"]

let OrderObject = function (pStoreID, pSalesPersonID, pCdID, pPricePaid, pDate) {
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

    document.getElementById("StoreID").value = randomStoreID;
    document.getElementById("SalesID").value = salesPersonID;
    document.getElementById("cdID").value = cdID;
    document.getElementById("pricepaid").value = pricePaid;
    document.getElementById("date").value = randomTimeValue;
}

function PostOneOrder(){
    CreateOneOrder();
    let newOrder = new OrderObject(
        document.getElementById("StoreID").value,
        document.getElementById("SalesID").value,
        document.getElementById("cdID").value,
        document.getElementById("pricepaid").value,
        document.getElementById("date").value,  
    );

    fetch('/ShowOneOrder', {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: {"Content-type": "application/json: charset=UTF-8"}
        })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));

};

function WriteOneOrder(){
    CreateOneOrder();
    let newOrder = new OrderObject(
        document.getElementById("StoreID").value,
        document.getElementById("SalesID").value,
        document.getElementById("cdID").value,
        document.getElementById("pricepaid").value,
        document.getElementById("date").value,  
    );

    fetch('/StoreOneOrder', {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: {"Content-type": "application/json: charset=UTF-8"}
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

function fillUL(data) {
        // clear prior data
    var divOrderList = document.getElementById("divOrderList");
    while (divOrderList.firstChild) {    // remove any old data so don't get duplicates
        divOrderList.removeChild(divOrderList.firstChild);
    };

    var ul = document.createElement('ul');
    CDArray = data;
    CDArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        li.innerHTML = element.StoreID + ":  &nbsp &nbsp  &nbsp &nbsp " + 
        element.SalesPersonID + "  &nbsp &nbsp  &nbsp &nbsp "  
        + element.CdID + " &nbsp &nbsp  &nbsp &nbsp  " 
        + element.PricePaid + " &nbsp &nbsp  &nbsp &nbsp  "
        + element.Date
        ul.appendChild(li);
    });
    divOrderList.appendChild(ul)
}


  
