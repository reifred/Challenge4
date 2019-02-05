//My function to get data from server
function get_data(url){
    return fetch(url,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+ localStorage.getItem("access_token")
        }
    })
    .then(response => response.json())
}

//Template for user table
function user_table(user){
    return `
      <tr>
         <td><img src="../images/user.jpg" alt="" /></td>
         <td>${user.firstname}</td>
         <td>${user.lastname}</td>
         <td>${user.othername}</td>
         <td>${user.email}</td>
         <td>${user.phonenumber}</td>
         <td>${user.username}</td>
         <td>${user.registered}</td>
         <td>${user.isadmin}</td>
      </tr>
    `
}

//Get all users and present them in user template table
function get_all_users(){
    get_data("http://127.0.0.1:5000/api/v1/users")
    .then(function(data){
        user_template = "";
        if(data["data"]){
            users = data["data"][0]["users"]
            console.log(users)
            users.forEach((user) => {
                user_template += user_table(user)
                document.getElementById("table").innerHTML = user_template
            });
        }else{
            document.getElementById("table").innerHTML = data["error"]
        }
    })
}
