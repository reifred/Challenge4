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
    // get_data("http://127.0.0.1:5000/api/v1/users")
    get_data("https://fred-reporter.herokuapp.com/api/v1/users")
    .then(function(data){
        if(data.status == 200){
            let user_template = ""
            users = data["data"][0]["users"]
            users.forEach((user) => {
                user_template += user_table(user)
                document.getElementById("table").innerHTML = user_template
            });
        }else if(data.status == 401){
            alert("Dear User, your session expired sign in again")
            log_out()
        }else if(data.status == 403){
            alert("Dear User, your aren't authorized to view that page")
            log_out()
        }else if(data.status == 400){
            document.getElementById("table").innerHTML = data.error
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
        incident_type = "red_flags"
    }else if(button_clicked == "intervention"){
        incident_type = "interventions"
    }
    // let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}`
    let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}`
    get_data(incident_url)
    .then(function(data){
        redflag_template = "";
        if(data.status == 200){
            records = data["data"]
            records.forEach((record) => {
                redflag_template += incident_table(record)
                document.getElementById("table2").innerHTML = redflag_template
            });
        }else if(data.status == 401){
            alert("Dear User, your session expired sign in again")
            log_out()
        }else if(data.status == 403){
            alert("Dear User, your aren't authorized to view that page")
            log_out()
        }else if(data.status == 400){
            document.getElementById("table2").innerHTML = data.error
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
        incident_type = "red_flags"
        incident_page = "red_flag.html"
    }else if(add_record == "Intervention"){
        incident_type = "interventions"
        incident_page = "intervention.html"
    }
    // let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}`
    let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}`
    post_data(incident_url, record)
    .then(data => {
        if(data.status == 201){
            location = incident_page
        }else if(data.status == 401){
            alert("Dear User, your session expired sign in again")
            log_out()
        }else if(data.status == 403){
            alert("Dear User, your aren't authorized to view that page")
            log_out()
        }else if(data.status == 400){
            document.getElementById("message").innerHTML = data.error
        }
    })
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
                <div id="row_row_details" class="flex_column">
                    <div class="title text_center">${draft.title}</div>
                    <div class="text_center">
                        <div class="geo_loc">
                            ${draft.location}
                        </div>
                        <div class="flex text_center status">
                            <div class="right">${draft._type}</div>
                            <div class="left">${draft.status}</div>
                        </div>
                    </div>
                    <div>
                        ${draft.comment}
                    </div>
                </div>
                <div id="row_buttons" class="flex text_center">
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
        incident_type = "red_flags"
    }else if(current_page == "intervention.html"){
        incident_type = "interventions"
    }
    // let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}`
    let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}`
    get_data(incident_url)
    .then(function(data){
        draft_template = "";
        if(data.status == 200){
            records = data["data"]
            records.forEach((record) => {
                if(record.status == "draft"){
                    draft_template += incident_draft(record)
                    document.getElementById("main").innerHTML = draft_template
                }else{
                    document.getElementById("main").innerHTML = empty_records()
                }
            });
        }else if(data.status == 401){
            alert("Dear User, your session expired sign in again")
            log_out()
        }else if(data.status == 403){
            alert("Dear User, your aren't authorized to view that page")
            log_out()
        }else if(data.status == 400){
            document.getElementById("main").innerHTML = data.error
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
        incident_type = "red_flags"
    }else if(current_page == "intervention.html"){
        incident_type = "interventions"
    }
    let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}/${record_id}/location`
    // let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}/${record_id}/location`
    document.getElementById("update_loc").onclick = function(){
        location_coords = document.getElementById("lat").value + 
        " " + document.getElementById("long").value
        location_update = {"location":location_coords}
        update_data(incident_url, location_update)
        .then(function(data){
            if(data.status == 200){
                alert(data["data"][0]["message"])
            }else if(data.status == 401){
                alert("Dear User, your session expired sign in again")
                log_out()
            }else if(data.status == 403){
                alert("Dear User, your aren't authorized to view that page")
                log_out()
            }else if(data.status == 400){
                alert(data.error)
            }
        })
        .catch(function(){
            console.log("Connection failed")
        })
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
        incident_type = "red_flags"
    }else if(current_page == "intervention.html"){
        incident_type = "interventions"
    }
    let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}/${record_id}/comment`
    // let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}/${record_id}/comment`
    document.getElementById("update_com").onclick = function(){
        comment_update = {"comment": document.getElementById("comment").value}
        update_data(incident_url, comment_update)
        .then(data => {
            if(data.status == 200){
                alert(data["data"])
            }else if(data.status == 401){
                alert("Dear User, your session expired sign in again")
                log_out()
            }else if(data.status == 403){
                alert("Dear User, your aren't authorized to view that page")
                log_out()
            }else if(data.status == 400){
                alert(data.error)
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
        incident_type = "red_flags"
    }else if(current_page == "intervention.html"){
        incident_type = "interventions"
    }
    // let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}/${record_id}`
    let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}/${record_id}`
    let confirm_delete = confirm("Do you want to delete the record")
    if(confirm_delete == true){
        delete_data(incident_url)
        .then(function(data){
            if(data.status == 200){
                alert(data["data"][0]["message"])
                location.reload()
            }else if(data.status == 401){
                alert("Dear User, your session expired sign in again")
                log_out()
            }else if(data.status == 403){
                alert("Dear User, your aren't authorized to view that page")
                log_out()
            }else if(data.status == 400){
                alert(data.error)
            }
        });
    }
}

//Admin template for draft records
function admin_draft_incident(draft_incident){
    let incident_url = `https://fred-reporter.herokuapp.com/api/v1/users/${draft_incident.createdby}`
    // let incident_url = `http://127.0.0.1:5000/api/v1/users/${draft_incident.createdby}`
    let username = ""
    get_data(incident_url)
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
                    <div id="row_row_details" class="flex_column">
                    <div class="title text_center">${draft_incident.title}</div>
                    <div class="right text_center">
                        <div class="geo_loc">
                            ${draft_incident.location}
                        </div>
                        <div class="flex text_center status">
                            <div class="right">${draft_incident._type}</div>
                            <div class="left">${draft_incident.status}</div>
                        </div>
                    </div>
                    <div>
                        ${draft_incident.comment}
                    </div>
                </div>
                <div id="row_buttons" class="flex text_center">
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
    // redflag_url = "http://127.0.0.1:5000/api/v1/red_flags"
    // intervention_url = "http://127.0.0.1:5000/api/v1/interventions"
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
                }else{
                    document.getElementById("main").innerHTML = empty_records()
                }
            });
        }else if(data["error"] == "Your token expired"){
            alert("Dear User, your session expired sign in again")
            log_out()
        }else if(data["error"]){
            document.getElementById("main").innerHTML = draft_template2
        }
    })
}

//Change the status of the record
function change_status(button, record_id, record_type){
   if(record_type == "red-flag"){
        incident_type = "red_flags"
    }else if(record_type == "intervention"){
        incident_type = "interventions"
    }
    let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}/${record_id}/status`
    // let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}/${record_id}/status`
    status_update = {"status": button.name}
    update_data(incident_url, status_update)
    .then(data => {
        if(data.status == 200){
            alert(data["data"][0]["message"])
            location.reload()
        }else if(data.status == 401){
            alert("Dear User, your session expired sign in again")
            log_out()
        }else if(data.status == 403){
            alert("Dear User, your aren't authorized to view that page")
            log_out()
        }else if(data.status == 400){
            alert(data.error)
        }
    })
}

function empty_records(){
    return `
        <div class="card text_center">
            <img width="90%;" src="../images/no-records.jpg">
        </div>
    `
}

//remove items from local storage
function log_out(){
    localStorage.clear()
    location = "../index.html"
    return false;
}
