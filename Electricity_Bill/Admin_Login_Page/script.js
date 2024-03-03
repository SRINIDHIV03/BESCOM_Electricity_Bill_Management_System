function submitForm() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Dummy authentication (replace with server-side validation)
    if (username === "user" && password === "pass") {
        document.getElementById("loginMessage").innerHTML = "Login successful!";
        window.location.href = '../Admin_MainPage/index.html';

    } else {
        document.getElementById("loginMessage").innerHTML = "Invalid username or password.";
    }
}
