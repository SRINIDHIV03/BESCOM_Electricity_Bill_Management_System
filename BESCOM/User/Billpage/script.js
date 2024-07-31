var billIssuedDate;

function Logout(){
    console.log("Logging out");
    localStorage.removeItem('ACCID');
    loadHomePage();
}

function loadHomePage(){
    window.location.href = '../../Home Page/index.html';
}

document.addEventListener("DOMContentLoaded", function() {
        acc_id = localStorage.getItem("ACCID");
    console.log(acc_id);
    fetch('http://localhost:5000/getUserHistory/'+acc_id, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
//        body: JSON.stringify({ ACCID:acc_id })
    })
    .then(response => response.json())
    .then(data=>tempfunc(data,data.Credit))
    .catch(error => console.error('Error:', error));
});
function tempfunc(data1,x){
//    mongodata = data1;
//    console.log(mongodata);
    data = data1.Latest_Bill_ID
//    console.log(data);
    document.getElementById("AccId").value=data.userAcc;
    document.getElementById("BillId").value=data._id;
    
    datetimeStr=data.issuedDate;
    var originalDatetime = new Date(datetimeStr);
    var dateOnly = originalDatetime.toISOString().split('T')[0];
    billIssuedDate=dateOnly;
    document.getElementById("issuedDate").value=dateOnly;

    datetimeStr=data.dueDate;
    var originalDatetime = new Date(datetimeStr);
    var dateOnly = originalDatetime.toISOString().split('T')[0];

    document.getElementById("dueDate").value=dateOnly;
    document.getElementById("prevRead").value=data.prevRead;
    document.getElementById("presRead").value=data.presRead;
    document.getElementById("Fixed").value=data.Fixed;
    document.getElementById("FPPCA").value=data.FPPCA;
    document.getElementById("Energy").value=data.Energy;
    document.getElementById("bill").value=data.Bill;
    document.getElementById("Credit").value=data.Credit;
    document.getElementById("Interest").value=data.Interest;
    document.getElementById("Total").value=data.Total;

    if(x==0){  //user has paid bill
        document.getElementById("Paid").value="Paid";
    }
    else{
        document.getElementById("Paid").value="Not Paid";
    }
}

async function pay(event){
    event.preventDefault();
    console.log(billIssuedDate);

    var str =  document.getElementById("Paid").innerHTML;
    if(str=="Payment Status: Paid"){
        alert("You have already paid your bills.");
        return;
    }
    acc_id = localStorage.getItem("ACCID");
    console.log(acc_id);

    var res = await fetch('http://localhost:5000/genericQuery',{
        headers:{
            'Content-type':'application/json'
        },
        method:'POST',
        body: JSON.stringify({query:"SELECT REGION_CODE FROM USER WHERE ACC_ID=?;", params:[acc_id]})
    })
    .then(response=>response.json())
    .catch(error=>console.error(error))
    rcode = res.data[0]['REGION_CODE'];

    await fetch('http://localhost:5000/updateCreditAndCollectedEarnings', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            userAccId:acc_id,
            regionCode:rcode,
            timePeriod:billIssuedDate
        })
    })
    .then(response => response.json())
    .then(data=>tempfunc(data.Latest_Bill_ID,data.Credit))
    .catch(error => console.error('Error:', error));

    alert("Payment success. Reload this page.");
}

async function loadOldbill(){
    var billcode = prompt("Enter bill ID:");

    acc_id = localStorage.getItem("ACCID");
    console.log(acc_id);
    var res = await fetch('http://localhost:5000/getBillID/'+billcode+'/'+acc_id, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
//        body: JSON.stringify({ ACCID:acc_id })
    })
    .then(response => response.json())
    .catch(error => console.error('Error:', error));

    if(res.bill!=undefined){
        updateParams(res.bill);
    }
    else{
        alert("Invalid Bill ID");
    }
}
function updateParams(data){
    console.log(data);
    document.getElementById("AccId").value=data.userAcc;
    document.getElementById("BillId").value=data._id;
    
    datetimeStr=data.issuedDate;
    var originalDatetime = new Date(datetimeStr);
    var dateOnly = originalDatetime.toISOString().split('T')[0];
    billIssuedDate=dateOnly;
    document.getElementById("issuedDate").value=  dateOnly;

    datetimeStr=data.dueDate;
    var originalDatetime = new Date(datetimeStr);
    var dateOnly = originalDatetime.toISOString().split('T')[0];

    document.getElementById("dueDate").value=dateOnly;
    document.getElementById("prevRead").value=data.prevRead;
    document.getElementById("presRead").value=data.presRead;
    document.getElementById("Fixed").value=data.Fixed;
    document.getElementById("FPPCA").value=data.FPPCA;
    document.getElementById("Energy").value=data.Energy;
    document.getElementById("bill").value=data.Bill;
    document.getElementById("Credit").value=data.Credit;
    document.getElementById("Interest").value=data.Interest;
    document.getElementById("Total").value=data.Total;

}

