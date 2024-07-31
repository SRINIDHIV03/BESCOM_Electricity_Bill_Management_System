/*document.addEventListener("DOMContentLoaded", function() {
    var header = document.getElementById("myHeader");
    header.textContent = "Hello, World!";
});*/

document.addEventListener("DOMContentLoaded", function() {
    //var username = document.getElementById("username").value;
    //var password = document.getElementById("password").value;
    fetch('http://localhost:5000/getRegionDetails', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
//        body: JSON.stringify({ name: username, pass: password })
    })
    .then(response => response.json())
    .then(data=>fillTable(data['data']))
    .catch(error => console.error('Error:', error));
});

function clearTable() {
    var table = document.getElementById("customers");
    // Remove all rows except the header
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    console.log("Table cleared");
}


function fillTable(data) {
    console.log("In Fill Table");
    console.log(data[0]);
//    clearTable();

    var table = document.getElementById("customers");
    // Create a new row
    for (var i = 0; i < data.length; i++) {
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        // Set the cell values from the JSON data
        cell1.innerHTML = data[i].REGION_CODE;
        cell2.innerHTML = data[i].REGION_NAME;
        cell3.innerHTML = data[i].OFFICE_LOC;
    }
}



function tempfunc(data){
        // Get the dropdown element
        var dropdown = document.getElementById("dropdown");
        dropdown.innerHTML = ""; //clear existing

        data.forEach(function(option) {
            var newOption = document.createElement("option");
            newOption.value = option.REGION_NAME;
            newOption.text = option.REGION_NAME;
            dropdown.add(newOption);
        });   
    // var header = document.getElementById("myHeader");
    // var str = "";
    // data.forEach(function(obj) {
    //     for (var key in obj) {
    //         if (obj.hasOwnProperty(key)) {
    //             str+= key + ": " + obj[key]+"<br>";
    //         }
    //     str+="<br>";
    //     }
    // });
    // header.innerHTML = str;
  //  header.textContent = "Helol, world";  
}

function submitForm(){
    var str = document.getElementById("dropdown").value;
    
    // var header = document.getElementById("myHeader");
    // header.innerHTML = str;
    fetch('http://localhost:5000/getRegionDetails', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({RNAME:str})
    })
    .then(response => response.json())
    .then(data=>fillTable(data['data']))
    .catch(error => console.error('Error:', error));
}

