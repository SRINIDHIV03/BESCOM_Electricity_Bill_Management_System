/*document.addEventListener("DOMContentLoaded", function() {
    var header = document.getElementById("myHeader");
    header.textContent = "Hello, World!";
});*/

document.addEventListener("DOMContentLoaded", function() {
    //var username = document.getElementById("username").value;
    //var password = document.getElementById("password").value;
    fetch('http://localhost:5000/getRegionNames', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
//        body: JSON.stringify({ name: username, pass: password })
    })
    .then(response => response.json())
    .then(data=>loadVals(data['data']))
    .catch(error => console.error('Error:', error));
    
    fetch('http://localhost:5000/getSuperadminDetails', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
//        body: JSON.stringify({ name: username, pass: password })
    })
    .then(response => response.json())
    .then(data=>tempfunc(data['data'][0]))
    .catch(error => console.error('Error:', error));

});
function loadVals(data){
    var dropdown = document.getElementById("dropdown");
    dropdown.innerHTML = ""; //clear existing

    data.forEach(function(option) {
        var newOption = document.createElement("option");
        newOption.value = option.REGION_NAME;
        newOption.text = option.REGION_NAME;
        dropdown.add(newOption);
    });   

}

function tempfunc(superadminInfo){
        // Get the dropdown element
        // var dropdown = document.getElementById("dropdown");
        // dropdown.innerHTML = ""; //clear existing
    // Append data to the paragraphs
    console.log(superadminInfo);
    document.getElementById("superadminofficeLocation").textContent = "Office Location:   "+ superadminInfo.OFFICE_LOC;
//    document.getElementById("superadminName").textContent ="Superadmin Name:   "+ superadminInfo.NAME;
    document.getElementById("superadminPhone").textContent ="Contact Details: "+ superadminInfo.PHONE;
}

function submitForm(){
    var str = document.getElementById("dropdown").value;
    
    // var header = document.getElementById("myHeader");
    // header.innerHTML = str;
    fetch('http://localhost:5000/getRegionAdminDetails', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({RNAME:str})
    })
    .then(response => response.json())
    .then(data=>fillData(data['data'][0]))
    .catch(error => console.error('Error:', error));
}


function fillData(adminInfo) {
    console.log("In Fill Data");
  //  console.log(data);
    console.log(adminInfo);
    document.getElementById("officeLocation").textContent = "Office Location:   "+ adminInfo.OFFICE_LOC;
    document.getElementById("adminName").textContent ="Admin Name:   "+ adminInfo.NAME;
    document.getElementById("adminPhone").textContent ="Admin Phone No: "+ adminInfo.PHONE;
}

