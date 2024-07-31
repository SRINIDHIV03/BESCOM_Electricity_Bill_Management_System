function submitForm(){
    
    console.log("Submitting...");
//    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var acc_id = document.getElementById("adminid").value;
    console.log(acc_id+password);
    fetch('http://localhost:5000/checkInUser', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({pass: password, ACCID:acc_id })
    })
    .then(response => response.json())
    .then(data => getTruth(data['data']))
    .then(x => loginPage(x))
    .catch(error => console.error('Error:', error));
}

function getTruth(data){  //returns true if 1 has been returned, else returns 0
    console.log("Getting truth");
    let val = data;
//    return val===1?true:false;
    return val===1;
}

function loginPage(truth) {
    console.log("In submitForm");
    
    if (truth) {
        var acc_id = document.getElementById("accountid").value;
        localStorage.setItem('ACCID', acc_id);
        fetch('http://localhost:5000/user/login', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ACCID:acc_id })
        }).then(response => response.json())
.then(data => {
  if (data.redirect) {
    window.location.href = data.redirect;
  }
})
.catch(error => console.error('Error:', error));
        
    } 
    else {
        console.log("Invalid login");
        }
}

function loadNewPage(){
    window.location.href = '../../User/Profile Page/index.html';
}

function Hello(){
    console.log("Hello");
}