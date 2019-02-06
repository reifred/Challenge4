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
         <td>${redflag.title}</td>
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
    console.log(record)
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

//Function to update the comment of a record
function update_comment(record_id){
    document.getElementById("myForm").style.display = "block";
    current_page = localStorage.getItem("page")
    if(current_page == "red_flag.html"){
        page_url = `https://fred-reporter.herokuapp.com/api/v1/red_flags/${record_id}/comment`
    }else if(current_page == "intervention.html"){
        page_url = `https://fred-reporter.herokuapp.com/api/v1/interventions/${record_id}/comment`
    }
    document.getElementById("update_com").onclick = function(){
        comment_update = {"comment": document.getElementById("comment").value}
        update_data(page_url, comment_update)
        .then(data => {
            if(data["data"]){
                location = current_page
            }
        })
    }
    document.getElementById("cancel_com").onclick = function(){
        document.getElementById("myForm").style.display = "none"
    }
}

//Fetch api function to delete
function delete_data(url){
    return fetch(url, {
        method: "DELETE",
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": "Bearer "+ localStorage.getItem("access_token")
        })
    })
    .then(response => response.json())
}

//Function to delete the record
function delete_record(record_id){
    current_page = localStorage.getItem("page")
    if(current_page == "red_flag.html"){
        page_url = `https://fred-reporter.herokuapp.com/api/v1/red_flags/${record_id}`
    }else if(current_page == "intervention.html"){
        page_url = `https://fred-reporter.herokuapp.com/api/v1/interventions/${record_id}`
    }
    var confirm_delete = confirm("Do you want to delete the record")
    if(confirm_delete == true){
        delete_data(page_url)
        .then(function(data){
            if(data["data"]){
                alert(data["data"][0]["message"])
                location = current_page
            }else{
                alert(data["error"])
            }
        });
    }
}

//Admin template for draft records
function admin_draft_incident(draft_incident){
    user_url = `https://fred-reporter.herokuapp.com/api/v1/users/${draft_incident.createdby}`
    let username = ""
    get_data(user_url)
    .then(function(data){
        if(data["data"]){
            username = data["data"][0]["username"]
            localStorage.setItem("createdby", username)
        }
    })
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
                    <div class="right text_center">
                        <div class="title">${draft_incident.title}</div>
                        <div class="geo_loc">
                            ${draft_incident.location}
                        </div>
                        <div class="flex text_center">
                            <div class="right">${draft_incident._type}</div>
                            <div class="left">${draft_incident.status}</div>
                        </div>
                    </div>
                    <div class="left">
                        <div id="details">
                            ${draft_incident.comment}
                        </div>
                    </div>
                </div>
                <div id="row_buttons" class="text_center">
                    <div class="dropdown left">
                      <button class="dropbtn">Update</button>
                      <div class="dropdown-content">
                        <a name="resolved" 
                        onclick="change_status(this, ${draft_incident.id}, '${draft_incident._type}');" >resolved</a>
                        <a name="under investigation" 
                        onclick="change_status(this, ${draft_incident.id}, '${draft_incident._type}');">under investigation</a>
                        <a name="rejected" 
                        onclick="change_status(this, ${draft_incident.id}, '${draft_incident._type}');">rejected</a>
                      </div>
                    </div>                          
                    <div id="poster" class="right">Posted by: ${localStorage.getItem("createdby")}</div>
                </div>
            </div>
        </div>
    `
}

//Function to get all records that are in draft state
function admin_get_draft_records(){
    current_page = localStorage.getItem("page")
    redflag_url = "https://fred-reporter.herokuapp.com/api/v1/red_flags"
    intervention_url = "https://fred-reporter.herokuapp.com/api/v1/interventions"
    user_url = ""
    var record_first = []
    get_data(redflag_url)
    .then(function(data){
        if(data["data"]){
            record_first = data["data"]
        }
    })
    get_data(intervention_url)
    .then(function(data){
        if(data["data"]){
            draft_template2 = ""
            var record_second = data["data"]
            var draft_records = record_second.concat(record_first)
            draft_records.forEach((record) => {
                if(record.status == "draft"){
                    draft_template2 += admin_draft_incident(record)
                    document.getElementById("main").innerHTML = draft_template2
                }
            });
        }else if(data["error"]){
                    document.getElementById("main").innerHTML = draft_template2
        }
    })
}

//Change the status of the record
function change_status(button, record_id, record_type){
   if(record_type == "red-flag"){
        page_url = `https://fred-reporter.herokuapp.com/api/v1/red_flags/${record_id}/status`
    }else if(record_type == "intervention"){
        page_url = `https://fred-reporter.herokuapp.com/api/v1/interventions/${record_id}/status`
    }
    status_update = {"status": button.name}
    update_data(page_url, status_update)
    .then(data => {
        if(data["data"]){
            location = localStorage.getItem("page")
        }
    })

//remove items from local storage
function log_out(){
    localStorage.removeItem("access_token")
    localStorage.removeItem("username")
    localStorage.removeItem("email")
    localStorage.removeItem("button_clicked")
    localStorage.removeItem("page")
    localStorage.removeItem("createdby")
    location = "../index.html"
    return false;
}
