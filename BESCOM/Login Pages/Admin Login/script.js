/*
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM content to be loaded
  
    // Find the button and add a click event listener
    const submitButton = document.getElementById('login-Button');
    
    submitButton.addEventListener('click', function() {
        // Code to be executed when the button is clicked
        // For example, you might want to perform some action or make an AJAX request.
        console.log('Button clicked!');
    });
});

const loginBtn = document.querySelector('#login-button');
*/


function submitForm(){
    var username = document.getElementById("adminid").value;
    var password = document.getElementById("password").value;
    fetch('http://localhost:5000/checkInUser', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name: username, pass: password })
    })
    .then(response => response.json())
    .then(data => getTruth(data['data']))
    .then(x => loadNewPage(x))
    .catch(error => console.error('Error:', error));
};

function getTruth(data){  //returns true if 1 has been returned, else returns 0
    let val = data[0].truth;
    return val===1?true:false;
}

function loadNewPage(truth) {

    console.log("In submitForm");
    if (truth) {
        document.getElementById("loginMessage").innerHTML = "Login successful!";
        window.location.href = '../../Home Page/index.html';
    } 
    else {
        document.getElementById("loginMessage").innerHTML = "Invalid username or password.";
    }
}


/*
function submitForm() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Dummy authentication (replace with server-side validation)
    if (username === "user" && password === "pass") {
        document.getElementById("loginMessage").innerHTML = "Login successful!";
        window.location.href = '../User_MainPage/index.html';

    } else {
        document.getElementById("loginMessage").innerHTML = "Invalid username or password.";
    }
}
*/