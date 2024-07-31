document.addEventListener("DOMContentLoaded", function() {
    acc_id = localStorage.getItem("ACCID");
    //var username = document.getElementById("username").value;
    //var password = document.getElementById("password").value;
    fetch('http://localhost:5000/user/getUserDetails', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ ACCID:acc_id })
    })
    .then(response => response.json())
    .then(data=>tempfunc(data['data'][0]))
    .catch(error => console.error('Error:', error));
});

function tempfunc(data){
    console.log("Writing data");
    console.log(data);
    document.getElementById("accid").textContent = "Account ID: "+ data.ACC_ID;
    document.getElementById("name").textContent ="Name: "+ data.NAME;
    document.getElementById("addr").textContent = "Address:   "+ data.ADDRESS;
    document.getElementById("TID").textContent ="Tariff ID: "+ data.Tariff_ID;
    document.getElementById("SID").textContent = "Scheme ID:   "+ data.SCHEME_ID;
    document.getElementById("CStatus").textContent ="Connection Status: "+ (data.C_STATUS==1?"Active":"Inactive");    
    document.getElementById("rcode").textContent = "Region Code:   "+ data.REGION_CODE;
    document.getElementById("Mread").textContent ="Previous Meter Reading: "+ data.PREV_READ;    

}

function Hello(){
    console.log("Hello");
    fetch('http://localhost:5000/user/test', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
//        body: JSON.stringify({ name: username, pass: password })
    })
    .then(response => console.log("tested"))
    .catch(error => console.error('Error:', error));

}
function Logout(){
    console.log("Logging out");
    localStorage.removeItem('ACCID');
    loadHomePage();
}

function loadHomePage(){
    window.location.href = '../../Home Page/index.html';
}

async function password_change(){
    console.log("Change password...");
    var new_pass = prompt("Enter the new password: ");
    console.log(new_pass);
    acc_id = localStorage.getItem("ACCID");
    console.log(acc_id);

    var hashedPass = await fetch('http://localhost:5000/hashPass',{
        headers:{
            'Content-type':'application/json'
        },
        method: 'POST',
        body: JSON.stringify({"pass":new_pass})
    })
    .then(response=>response.json())
    .catch(error=>console.error(error));
    console.log(hashedPass['data']);

    var res = await fetch('http://localhost:5000/genericQuery',{
        headers:{
            'Content-type':'application/json'
        },
        method:'POST',
        body: JSON.stringify({query:"UPDATE USER_LOGINS SET PASSWORD=? WHERE ACC_ID=?;", params:[hashedPass['data'],acc_id]})
    })
    .then(response=>response.json())
    .catch(error=>console.error(error));
    console.log(res);
    alert("Password successfully updated");
}

async function add_bank(){
    console.log("Adding Bank Details...");
    query = "SELECT EXISTS(SELECT * FROM BANK_DETAILS WHERE ACC_ID=?) as truth;";
    acc_id = localStorage.getItem("ACCID");
    console.log(acc_id);

    var res = await fetch('http://localhost:5000/genericQuery',{
        headers:{
            'Content-type':'application/json'
        },
        method:'POST',
        body: JSON.stringify({query:query, params:[acc_id]})
    })
    .then(response=>response.json())
    .catch(error=>console.error(error));
    console.log(res);
    if(res.data[0].truth) //if there already exist bank details, exit
        {
        alert("Error. Bank details already exist");
        return;
        }
    var name = (document.getElementById("name").innerText).substring(6);
    console.log(name);
    var bank_acc_no = prompt("Enter Bank Account Number: ");
    console.log(bank_acc_no);
    var IFSC = prompt("Enter IFSC: ");
    console.log(IFSC);
    query = "INSERT INTO BANK_DETAILS(BANK_ACC_NO,NAME,IFSC,ACC_ID) VALUES (?,?,?,?);";
    

    var res = await fetch('http://localhost:5000/genericQuery',{
        headers:{
            'Content-type':'application/json'
        },
        method:'POST',
        body: JSON.stringify({query:query, params:[bank_acc_no,name,IFSC,acc_id]})
    })
    .then(response=>response.json())
    .catch(error=>console.error(error));
    console.log(res);
    alert("Bank details successfully inserted");
        
}

async function remove_bank(){
    console.log("Removing Bank Details...");
    query = "SELECT EXISTS(SELECT * FROM BANK_DETAILS WHERE ACC_ID=?) as truth;";
    acc_id = localStorage.getItem("ACCID");
    console.log(acc_id);

    var res = await fetch('http://localhost:5000/genericQuery',{
        headers:{
            'Content-type':'application/json'
        },
        method:'POST',
        body: JSON.stringify({query:query, params:[acc_id]})
    })
    .then(response=>response.json())
    .catch(error=>console.error(error));
    console.log(res);
    if(!res.data[0].truth) //if no bank details exist, exit
        {
        alert("Error. Bank details do not exist");
        return;
        }

    query = "DELETE FROM BANK_DETAILS WHERE ACC_ID=?;"
    res = await fetch('http://localhost:5000/genericQuery',{
        headers:{
            'Content-type':'application/json'
        },
        method:'POST',
        body: JSON.stringify({query:query, params:[acc_id]})
    })
    .then(response=>response.json())
    .catch(error=>console.error(error));
    console.log(res);
    
    alert("Bank details succesfully removed.");

}
