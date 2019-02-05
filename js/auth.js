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
    post_user("https://fred-reporter.herokuapp.com/api/v1/auth/sign_in", sign_in_data)
    .then(data => {
        if(data["data"]){
            localStorage.setItem("access_token", data["data"][0]["token"]);
            localStorage.setItem("username", data["data"][0]["user"]["username"])
            localStorage.setItem("email", data["data"][0]["user"]["email"])
            is_admin = data["data"][0]["user"]["isadmin"]
            if(is_admin == true){
                location = "admin.html"
            }else{
                location = "red_flag.html";
            }
        }else if(data["error"]){
            document.getElementById("error_message").innerHTML = "username or password is incorrect";
        }
    })
    return false;
}
