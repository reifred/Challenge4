//My fuction to post user to the server
function post_user(url,data){
    return fetch(url, {
        credentials: "same-origin",
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
            "Content-Type": "application/json"
        })
    })
    .then(response => response.json())
}

//Sign in using fetch api
function sign_in(){
    let sign_in_data = {
        username : document.getElementById("username").value,
        password : document.getElementById("password").value
    }
    // post_user("http://127.0.0.1:5000/api/v1/auth/sign_in", sign_in_data)
    post_user("https://fred-reporter.herokuapp.com/api/v1/auth/sign_in", sign_in_data)
    .then(data => {
        if(data.status == 201){
            localStorage.setItem("access_token", data["data"][0]["token"]);
            localStorage.setItem("username", data["data"][0]["user"]["username"])
            localStorage.setItem("email", data["data"][0]["user"]["email"])
            is_admin = data["data"][0]["user"]["isadmin"]
            if(is_admin == true){
                location = "admin.html"
            }else{
                location = "red_flag.html";
            }
        }else if(data.status == 400){
            document.getElementById("error_message").innerHTML = "username or password is incorrect";
        }
    })
    return false;
}

//Check whether user registering is admin or normal user
function user_type(button){
    var is_admin = button.value
    if(is_admin == "User"){
        isadmin = false
    }else if(is_admin == "Admin"){
        isadmin = true
    }
}

//Sign up using fetch api
function sign_up(){
    let sign_up_data = {
        firstname : document.getElementById("firstName").value,
        lastname : document.getElementById("lastName").value,
        username : document.getElementById("userName").value,
        phoneNumber : document.getElementById("phoNumber").value,
        email : document.getElementById("email").value,
        password : document.getElementById("password").value,
        isAdmin: isadmin  
    }
    // post_user("http://127.0.0.1:5000/api/v1/auth/sign_up", sign_up_data)
    post_user("https://fred-reporter.herokuapp.com/api/v1/auth/sign_up", sign_up_data)
    .then(data => {
        if(data.status == 201){
            document.getElementById("sign_up_message").innerHTML = data["data"][0]["message"];
            location = "sign_in.html"
        }else if(data.status == 400){
            document.getElementById("sign_up_message").innerHTML = data["error"];
        }
    })
    return false;
}
