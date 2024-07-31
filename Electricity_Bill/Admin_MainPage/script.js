/*
fetch('http://localhost:5000/getAll', {
    headers: {
        'Content-type': 'application/json'
    },
    method: 'GET',
//    body: JSON.stringify({ name : name})    //this is input to the backend nodeJS
})
.then(response => response.json())
.then(data => insertRowIntoTable(data['data']));

function insertRowIntoTable(data){
    console.log(data);
}
*/


const xyz = "Srinidhi";
const pass = "12345";
let data = {name:xyz,pass:pass};
//var truth = false;
//console.log(truth);
fetch('http://localhost:5000/checkInUser', {
    headers: {
        'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => getTruth(data['data']))
.then(x => loginFunc(x))
.catch(error => console.error('Error:', error));

function getTruth(data){
    let val = data[0].truth;
    console.log(data);
//    console.log(val);
    return val===1;
//    val===1 ? truth=true : truth=false;
//    console.log(truth);
}

function loginFunc(truth){
    console.log(truth);
    if(truth){
        console.log("Yes");
    }
    else console.log("No");
}
