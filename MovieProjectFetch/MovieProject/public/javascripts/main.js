
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

    document.getElementById("buttonFiveEmpMostVol").addEventListener("click", function () {
        createFiveEmpMostVolList();
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

function createFiveEmpMostVolList() {
    // update local array from server
    fetch('/getFiveEmpMostVolList')
        // Handle success
        .then(response => response.json())  // get the data out of the response object
        .then(responseData => fillULFiveMostVol(responseData))    //update our array and li's
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

function fillULFiveMostVol(data) {
    // clear prior data
    var divOrderList = document.getElementById("divCDList");
    while (divOrderList.firstChild) {    // remove any old data so don't get duplicates
        divOrderList.removeChild(divOrderList.firstChild);
    };

    var ul = document.createElement('ul');
    CDArray = data;

    let emplID1 = 0;
    let emplID2 = 0;
    let emplID3 = 0;
    let emplID4 = 0;
    let emplID5 = 0;
    let emplID6 = 0;
    let emplID7 = 0;
    let emplID8 = 0;
    let emplID9 = 0;
    let emplID10 = 0;
    let emplID11 = 0;
    let emplID12 = 0;
    let emplID13 = 0;
    let emplID14 = 0;
    let emplID15 = 0;
    let emplID16 = 0;
    let emplID17 = 0;
    let emplID18 = 0;
    let emplID19 = 0;
    let emplID20 = 0;
    let emplID21 = 0;
    let emplID22 = 0;
    let emplID23 = 0;
    let emplID24 = 0;

    CDArray.forEach(element => {
        if (element.SalesPersonID == 1) {
            emplID1++;
        } else if (element.SalesPersonID == 2) {
            emplID2++;
        } else if (element.SalesPersonID == 3) {
            emplID3++;
        } else if (element.SalesPersonID == 4) {
            emplID4++;
        } else if (element.SalesPersonID == 5) {
            emplID5++;
        } else if (element.SalesPersonID == 6) {
            emplID6++;
        } else if (element.SalesPersonID == 7) {
            emplID7++;
        } else if (element.SalesPersonID == 8) {
            emplID8++;
        } else if (element.SalesPersonID == 9) {
            emplID9++;
        } else if (element.SalesPersonID == 10) {
            emplID10++;
        } else if (element.SalesPersonID == 11) {
            emplID11++;
        } else if (element.SalesPersonID == 12) {
            emplID12++;
        } else if (element.SalesPersonID == 13) {
            emplID13++;
        } else if (element.SalesPersonID == 14) {
            emplID14++;
        } else if (element.SalesPersonID == 15) {
            emplID15++;
        } else if (element.SalesPersonID == 16) {
            emplID16++;
        } else if (element.SalesPersonID == 17) {
            emplID17++;
        } else if (element.SalesPersonID == 18) {
            emplID18++;
        } else if (element.SalesPersonID == 19) {
            emplID19++;
        } else if (element.SalesPersonID == 20) {
            emplID20++;
        } else if (element.SalesPersonID == 21) {
            emplID21++;
        } else if (element.SalesPersonID == 22) {
            emplID22++;
        } else if (element.SalesPersonID == 23) {
            emplID23++;
        } else if (element.SalesPersonID == 24) {
            emplID24++;
        }
    });

    var employeeList = [emplID1, emplID2, emplID3, emplID4, emplID5, emplID6, emplID7, emplID8, emplID9, emplID10, emplID11, emplID12, emplID13, emplID14, emplID15, emplID16, emplID17,
        emplID18, emplID19, emplID20, emplID21, emplID22, emplID23, emplID24];
    employeeList.sort().reverse();

    document.getElementById("textString").innerHTML = "The number of sales by the top 5 associates made in the past 4 days are:"
        + "<br/> " + employeeList[0];
    + "<br/> " + employeeList[1];
    + "<br/> " + employeeList[2];
    + "<br/> " + employeeList[3];
    + "<br/> " + employeeList[4];

}


  
