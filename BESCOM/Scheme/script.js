/*document.addEventListener("DOMContentLoaded", function() {
    var header = document.getElementById("myHeader");
    header.textContent = "Hello, World!";
});*/

document.addEventListener("DOMContentLoaded", function() {
    //var username = document.getElementById("username").value;
    //var password = document.getElementById("password").value;
    fetch('http://localhost:5000/getSchemes', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
//        body: JSON.stringify({ name: username, pass: password })
    })
    .then(response => response.json())
    .then(data=>tempfunc(data['data']))
    .catch(error => console.error('Error:', error));
});

function tempfunc(data){
        // Get the dropdown element
        var dropdown = document.getElementById("dropdown");
        dropdown.innerHTML = ""; //clear existing

        data.forEach(function(option) {
            var newOption = document.createElement("option");
            newOption.value = option.SCHEME_ID;
            newOption.text = option.SCHEME_ID;
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
    fetch('http://localhost:5000/getSchemeDetails', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({SID:str})
    })
    .then(response => response.json())
    .then(data=>fillTable(data['data']))
    .catch(error => console.error('Error:', error));
}

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
    clearTable();
    var table = document.getElementById("customers");

    // Create a new row
    var newRow = table.insertRow(-1);

    // Insert cells into the row
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);

    // Set the inner HTML of cells with the provided values
    cell1.innerHTML = data[0].SCHEME_ID;
    cell2.innerHTML = data[0].PERCENT_INC;
    cell3.innerHTML = data[0].MAX_ENTITLEMENT;
}
