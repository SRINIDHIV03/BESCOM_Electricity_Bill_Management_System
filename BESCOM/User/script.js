function submitForm(){
    console.log("Submitting...");
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var acc_id = document.getElementById("accountid").value;
    fetch('http://localhost:5000/checkInUser', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name: username, pass: password, ACCID:acc_id })
    })
    .then(response => response.json())
    .then(data => getTruth(data['data']))
    .then(x => loginPage(x))
    .catch(error => console.error('Error:', error));
}

function getTruth(data){  //returns true if 1 has been returned, else returns 0
    console.log("Getting truth");
    let val = data[0].truth;
//    return val===1?true:false;
    return val===1;
}

function loginPage(truth) {
    console.log("In submitForm");
    
    if (truth) {
        var acc_id = document.getElementById("accountid").value;
        fetch('http://localhost:5000/user/login', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ACCID:acc_id })
        })
        .then(response => loadNewPage())
        // .then(data => getTruth(data['data']))
        // .then(x => loadNewPage(x))
        .catch(error => console.error('Error:', error));
        
    } 
    else {
        console.log("Invalid login");
        }
}

function loadNewPage(){
    window.location.href = 'Profile Page/index.html';
}

function Hello(){
    console.log("Hello");
}