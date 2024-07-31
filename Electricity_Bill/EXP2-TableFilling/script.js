// // Sample data to populate the table
// var data = [
//     { name: 'John', age: 25, city: 'New York' },
//     { name: 'Alice', age: 30, city: 'London' },
//     { name: 'Bob', age: 22, city: 'Tokyo' }
// ];

// // Function to fill the table
// function fillTable() {
//     var table = document.getElementById('myTable');
//     var tbody = table.getElementsByTagName('tbody')[0];

//     // Loop through the data and create rows and cells
//     for (var i = 0; i < data.length; i++) {
//         var row = tbody.insertRow(i);

//         var cell1 = row.insertCell(0);
//         cell1.innerHTML = data[i].name;

//         var cell2 = row.insertCell(1);
//         cell2.innerHTML = data[i].age;

//         var cell3 = row.insertCell(2);
//         cell3.innerHTML = data[i].city;
//     }
// }

// // Call the fillTable function when the page is loaded
// window.onload = fillTable;

// Sample data to populate the table with nested tables
var data = [
    { name: 'John', age: 25, city: 'New York', contact: { phone: '123-456-7890', email: 'john@example.com' } },
    { name: 'Alice', age: 30, city: 'London', contact: { phone: '987-654-3210', email: 'alice@example.com' } },
    { name: 'Bob', age: 22, city: 'Tokyo', contact: { phone: '555-123-4567', email: 'bob@example.com' } }
];

// Function to fill the table
function fillTable() {
    var table = document.getElementById('myTable');
    var tbody = table.getElementsByTagName('tbody')[0];

    // Loop through the data and create rows and cells
    for (var i = 0; i < data.length; i++) {
        var row = tbody.insertRow(i);

        var cell1 = row.insertCell(0);
        cell1.innerHTML = data[i].name;

        var cell2 = row.insertCell(1);
        cell2.innerHTML = data[i].age;

        var cell3 = row.insertCell(2);
        cell3.innerHTML = data[i].city;

        var cell4 = row.insertCell(3);
        // Create a nested table for contact details
        var nestedTable = document.createElement('table');
        var nestedRow = nestedTable.insertRow(0);

        var nestedCell1 = nestedRow.insertCell(0);
        nestedCell1.innerHTML = 'Phone: ' + data[i].contact.phone;

        var nestedCell2 = nestedRow.insertCell(1);
        nestedCell2.innerHTML = 'Email: ' + data[i].contact.email;

        cell4.appendChild(nestedTable);
    }
}

// Call the fillTable function when the page is loaded
window.onload = fillTable;
