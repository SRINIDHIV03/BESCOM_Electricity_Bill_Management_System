/*document.addEventListener("DOMContentLoaded", function() {
    var header = document.getElementById("myHeader");
    header.textContent = "Hello, World!";
});*/

document.addEventListener("DOMContentLoaded", function() {
    //var username = document.getElementById("username").value;
    //var password = document.getElementById("password").value;
    fetch('http://localhost:5000/getUserNameFromLogin', {
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
    var header = document.getElementById("myHeader");
    var str = "";
    data.forEach(function(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                str+= key + ": " + obj[key]+"<br>";
            }
        str+="<br>";
        }
    });
    header.innerHTML = str;
    
        // Get the dropdown element
        var dropdown = document.getElementById("dropdown");

        // Clear existing options
        dropdown.innerHTML = "";

        // Add new options
        var newOptions = [
            { value: "kiwi", text: "Kiwi" },
            { value: "pineapple", text: "Pineapple" },
            { value: "watermelon", text: "Watermelon" }
        ];

        data.forEach(function(option) {
            var newOption = document.createElement("option");
            newOption.value = option.Username;
            newOption.text = option.Username;
            dropdown.add(newOption);
        });
    
   
    var header = document.getElementById("myHeader");
    var str = "";
    data.forEach(function(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                str+= key + ": " + obj[key]+"<br>";
            }
        str+="<br>";
        }
    });
    header.innerHTML = str;
  //  header.textContent = "Helol, world";  
}

function submitForm(){
    var str = document.getElementById("dropdown").value;
    var header = document.getElementById("myHeader");
    header.innerHTML = str;
}