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
    .catch(function(){
        alert("Connection Failed! Check your internet connection.")
    })
}

//Sign in using fetch api
function sign_in(){
    let sign_in_data = {
        username : document.getElementById("username").value,
        password : document.getElementById("password").value
    }
    document.getElementById("loading_page").style.display = "flex"
    // post_user("http://127.0.0.1:5000/api/v1/auth/sign_in", sign_in_data)
    post_user("https://fred-reporter.herokuapp.com/api/v1/auth/sign_in", sign_in_data)
    .then(data => {
        document.getElementById("loading_page").style.display = "none"
        if(data.status == 201){
            localStorage.setItem("access_token", data["data"][0]["token"]);
            localStorage.setItem("admin", data["data"][0]["user"]["isadmin"])
            localStorage.setItem("user_id", data["data"][0]["user"]["id"])
            document.getElementById("error_message").innerHTML = "Logged In successfully"
            document.getElementsByClassName("alert")[0].style.display = "block"
            document.getElementsByClassName("alert")[0].style.background = "green"
            window.setTimeout(function(){
                location = "profile.html"
            }, 2500)
        }else if(data.status == 400){
            document.getElementById("error_message").innerHTML = "username or email doesn't exist"
            document.getElementsByClassName("alert")[0].style.display = "block"
        }
    })
    return false;
}

//Sign up using fetch api
function sign_up(){
    let sign_up_data = {
        firstname : document.getElementById("firstName").value,
        lastname : document.getElementById("lastName").value,
        username : document.getElementById("userName").value,
        phoneNumber : document.getElementById("phoNumber").value,
        email : document.getElementById("email").value,
        password : document.getElementById("password").value
    }
    confirm_password = document.getElementById("confirm_password")
    document.getElementById("loading_page").style.display = "flex"
    if(sign_up_data["password"] == confirm_password.value){
        // post_user("http://127.0.0.1:5000/api/v1/auth/sign_up", sign_up_data)
        post_user("https://fred-reporter.herokuapp.com/api/v1/auth/sign_up", sign_up_data)
        .then(data => {
            document.getElementById("loading_page").style.display = "none"
            if(data.status == 201){
                document.getElementById("error_message").innerHTML = "User Registered successfully"
                document.getElementsByClassName("alert")[0].style.display = "block"
                document.getElementsByClassName("alert")[0].style.background = "green"
                window.setTimeout(function(){
                    location = "sign_in.html"
                }, 2500)
            }else if(data.status == 400){
                document.getElementById("error_message").innerHTML = data.error
                document.getElementsByClassName("alert")[0].style.display = "block"
            }
        })
    }else{
        document.getElementById("loading_page").style.display = "none"
        document.getElementById("error_message").innerHTML = "Password don't match"
        document.getElementsByClassName("alert")[0].style.display = "block"
    }
    return false;
}
