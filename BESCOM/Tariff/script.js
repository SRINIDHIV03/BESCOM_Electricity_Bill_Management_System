/*document.addEventListener("DOMContentLoaded", function() {
    var header = document.getElementById("myHeader");
    header.textContent = "Hello, World!";
});*/

document.addEventListener("DOMContentLoaded", function() {
    //var username = document.getElementById("username").value;
    //var password = document.getElementById("password").value;
    fetch('http://localhost:5000/getTariffs', {
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
            newOption.value = option.Tariff_id;
            newOption.text = option.Tariff_id;
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
    fetch('http://localhost:5000/getTariffDetails', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({TID:str})
    })
    .then(response => response.json())
    .then(data=>fillTable(data['data']))
    .catch(error => console.error('Error:', error));
}

function clearTable() {
    var table = document.getElementById("customers");
    // Remove all rows except the header
    while (table.rows.length > 2) {
        table.deleteRow(2);
    }
    console.log("Table cleared");
}

function fillTable(data) {
    console.log("In Fill Table");
    console.log(data);
    clearTable();
    var table = document.getElementById("customers");
    
    var newRow = table.insertRow(-1);
    
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);

    var cell4 = newRow.insertCell(3);
    var cell5 = newRow.insertCell(4);
    var cell6 = newRow.insertCell(5);
    var cell7 = newRow.insertCell(6);
    
    cell1.innerHTML = data.Tariff_ID;
    cell2.innerHTML = data.Tariff_Name;
            // Create a string for the Slab cell containing multiple values
                
    var slabHTML1 = "";
    var slabHTML2 = "";
    var slabHTML3 = "";
    var slabValues = data.slabs;
    var i;
    for (i = 0; i < slabValues.length; i++) {
        slabHTML1 += slabValues[i].low+ "<br>";
        slabHTML2 += slabValues[i].up+ "<br>";
        slabHTML3 += slabValues[i].slabs + "<br>";
    }
    slabHTML1 += slabValues[i-1].up+ "<br>";
    slabHTML2 += "inf"+ "<br>";
    slabHTML3 += data.default_rate + "<br>";

    cell3.innerHTML = slabHTML1;
    cell4.innerHTML = slabHTML2;
    cell5.innerHTML = slabHTML3;
    
    cell6.innerHTML = data.fppca;
    cell7.innerHTML = data.energy;
}

