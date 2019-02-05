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
        incident_url = "https://fred-reporter.herokuapp.com/api/v1/red_flags"
    }else if(button_clicked == "intervention"){
        incident_url = "https://fred-reporter.herokuapp.com/api/v1/interventions"
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

//My fuction to create a record to the server
function post_data(url,data){
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": "Bearer "+ localStorage.getItem("access_token")
        })
    })
    .then(response => response.json())
}

//Check to know whether to add redflag or intervention record
function create_button(button){
    localStorage.setItem("add_record", button.value)
}

//Functionality to add an incident
function create_record(){

    location_coords = document.getElementById("lat").value + 
    " " + document.getElementById("long").value

    record = {
        "title": document.getElementById("title").value,
        "comment": document.getElementById("comment").value,
        "images": ["picjava.jpg"],
        "location": location_coords,
        "videos": ["vidjava.mp4"]
    }

    add_record = localStorage.getItem("add_record")

    if(add_record == "Red Flag"){
        incident_url = "https://fred-reporter.herokuapp.com/api/v1/red_flags"
        incident_page = "red_flag.html"
    }else if(add_record == "Intervention"){
        incident_url = "https://fred-reporter.herokuapp.com/api/v1/interventions"
        incident_page = "intervention.html"
    }    
    post_data(incident_url, record)
    .then(data => {
        if(data["data"]){
            document.getElementById("message").innerHTML = data["data"][0]["message"];
            location = incident_page
        }else{
            document.getElementById("message").innerHTML = data["error"];
        }
    })
    localStorage.removeItem("add_record")
    return false;
}

//Template for draft incidents
function incident_draft(draft){
    return `
        <div class="row card">
            <div id="media">
                <img width="200px" height="150px" src="../images/bad_roads.jpg">
                <video width="50%" height="150px" controls>
                    <source src="movie.mp4" type="video/mp4">
                </video>
            </div>
            <div id="row_details">
                <div id="row_row_details" class="flex">
                    <div class="right text_center about">
                        <div class="title">${draft.title}</div>
                        <div class="geo_loc">
                            ${draft.location}
                        </div>
                        <div class="flex text_center">
                            <div class="right">${draft._type}</div>
                            <div class="left">${draft.status}</div>
                        </div>
                    </div>
                    <div class="left">
                        <div id="details">
                            ${draft.comment}
                        </div>
                    </div>
                </div>
                <div id="row_buttons" class="text_center">
                    <div class="dropdown left">
                      <button class="dropbtn">Update</button>
                      <div class="dropdown-content">
                        <a onclick="update_location(${draft.id})" >Location</a>
                        <a onclick="update_comment(${draft.id});" >Comment</a>
                      </div>
                    </div>                          
                    <div id="delete" class="right">
                        <a onclick="delete_record(${draft.id});">Delete</a>
                    </div>
                </div>
            </div>
        </div>
    `
}

//Get incidents that can be edited
function get_draft_records(){
    current_page = localStorage.getItem("page")
    if(current_page == "red_flag.html"){
        page_url = "https://fred-reporter.herokuapp.com/api/v1/red_flags"
    }else if(current_page == "intervention.html"){
        page_url = "https://fred-reporter.herokuapp.com/api/v1/interventions"
    }
    get_data(page_url)
    .then(function(data){
        draft_template = "";
        if(data["data"]){
            records = data["data"]
            records.forEach((record) => {
                if(record.status == "draft"){
                    draft_template += incident_draft(record)
                    document.getElementById("main").innerHTML = draft_template
                }
            });
        }else{
            document.getElementById("main").innerHTML = data["error"]
        }
    })
}

//Update functionality using fetch api end point 
function update_data(url, data){
    return fetch(url,{
        method: "PATCH",
        body: JSON.stringify(data),
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": "Bearer "+ localStorage.getItem("access_token")
        })
    })
    .then(response => response.json())
}

//Function to update the location of a record
function update_location(record_id){
    document.getElementById("myForm2").style.display = "block";
    current_page = localStorage.getItem("page")
    if(current_page == "red_flag.html"){
        page_url = `https://fred-reporter.herokuapp.com/api/v1/red_flags/${record_id}/location`
    }else if(current_page == "intervention.html"){
        page_url = `https://fred-reporter.herokuapp.com/api/v1/interventions/${record_id}/location`
    }
    document.getElementById("update_loc").onclick = function(){
        location_coords = document.getElementById("lat").value + 
        " " + document.getElementById("long").value
        location_update = {"location":location_coords}
        update_data(page_url, location_update)
        .then(function(data){
            if(data["data"]){
                alert(data["data"][0]["message"])
                location = current_page
            }else{
                alert(data["error"])
            }
        });
    }
    document.getElementById("cancel_loc").onclick = function(){
        document.getElementById("myForm2").style.display = "none"
    }
}
