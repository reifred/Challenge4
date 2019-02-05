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
    get_data("https://fred-reporter.herokuapp.com/api/v1/users")
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

//Template table for available incidents
function incident_table(redflag){
    return `
      <tr>
         <td>${redflag.id}</td>
         <td>${redflag.createdon}</td>
         <td>${redflag.createdby}</td>
         <td>${redflag._type}</td>
         <td>${redflag.location}</td>
         <td>${redflag.status}</td>
         <td>
          <div class="comments">
            ${redflag.comment}
          </div>
        </td>
        <td class="media"><img src="../images/bad_roads.jpg" alt="" /></td>
        <td class="media">
            <video height="50%" controls>
              <source src="movie.mp4" type="video/mp4">
            </video>
        </td>
      </tr>
    `
}

//Check to know whether to go redflags or interventions page
function record_type(button){
    location = "records.html"
    localStorage.setItem("button_clicked",button.name)
}

//Get all redflag/intervention records and present them in redflag template table
function get_all_records(){
    button_clicked = localStorage.getItem("button_clicked")    
    if(button_clicked == "redflags"){
        incident_url = "http://127.0.0.1:5000/api/v1/red_flags"
    }else if(button_clicked == "intervention"){
        incident_url = "http://127.0.0.1:5000/api/v1/interventions"
    }
    get_data(incident_url)
    .then(function(data){
        redflag_template = "";
        if(data["data"]){
            records = data["data"]
            console.log(records)
            records.forEach((record) => {
                redflag_template += incident_table(record)
                document.getElementById("table2").innerHTML = redflag_template
            });
        }else{
            document.getElementById("table2").innerHTML = data["error"]
        }
    })
}
