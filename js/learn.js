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
	.catch(function(){
	    alert("Connection Failed! Check your internet connection.")
	})
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
	if(redflag._type == "red-flag"){
		image_url = "../images/no_corruption.jpg"
	}else{
		image_url = "../images/help_wanted.png"
	}
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
        <td class="media"><img src="${image_url}" alt="" /></td>
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
    draft_n = 0; resolved_n = 0; rejected_n = 0; investigation_n = 0;  
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
                if(record.status == "rejected"){
                    rejected_n += 1
                }else if(record.status == "resolved"){
                    resolved_n += 1
                }else if(record.status == "under investigation"){
                    investigation_n += 1
                }
                else if(record.status == "draft"){
                    draft_n += 1
                }
                redflag_template += incident_table(record)
                document.getElementById("table2").innerHTML = redflag_template
            });
            console.log(`Draft = ${draft_n} Investigation = ${investigation_n} Resolved = ${resolved_n}`)
            document.getElementById("draft_num").value = draft_n
            document.getElementById("resolved_num").value = resolved_n
            document.getElementById("rejected_num").value = rejected_n
            document.getElementById("investigation_num").value = investigation_n
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
	.catch(function(){
	    alert("Connection Failed! Check your internet connection.")
	})
}


//Functionality to add an incident
function create_button(button){
    location_coords = document.getElementById("lat").value + 
    " " + document.getElementById("long").value

    record = {
        "title": document.getElementById("title").value,
        "comment": document.getElementById("comment").value,
        "images": ["none"],
        "location": location_coords,
        "videos": ["none"]
    }

    if(button.value == "Red Flag"){
        incident_type = "red_flags"
        incident_page = "red_flag.html"
    }else if(button.value == "Intervention"){
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
	if(draft._type == "red-flag"){
		image_url = "../images/no_corruption.jpg"
	}else{
		image_url = "../images/help_wanted.png"
	}
    return `
        <div class="row card">
            <div class="title text_center">${draft.title}</div>
            <div id="media">
            	<div class="left image">
	                <img width="100%" height="150px" src="${image_url}">
            	</div>
                <div class="comment right">
                	${draft.comment}
            	</div>
            </div>
            <div id="row_details">
                <div id="row_row_details" class="flex_column text_center">
                    <div class="geo_loc">
                        ${draft.location}
                    </div>
                    <div class="flex status">
                        <div class="right">${draft._type}</div>
                        <div class="left">${draft.status}</div>
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
            if(records.length == 0){
                document.getElementById("main").innerHTML = empty_records()
            }
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
	.catch(function(){
	    alert("Connection Failed! Check your internet connection.")
	})
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
            	location = current_page
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
            	location = current_page
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
	.catch(function(){
	    alert("Connection Failed! Check your internet connection.")
	})
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
	createdby = get_record_username(draft_incident.createdby)
	if(draft_incident._type == "red-flag"){
		image_url = "../images/no_corruption.jpg"
	}else{
		image_url = "../images/help_wanted.png"
	}
    return `
        <div class="row card">
	            <div class="title text_center">${draft_incident.title}</div>
	            <div id="media">
	            	<div class="left image">
		                <img width="100%" height="150px" src="${image_url}">
	            	</div>
	                <div class="comment right">
	                	${draft_incident.comment}
	            	</div>
	            </div>
                <div id="row_details">
	                <div id="row_row_details" class="flex_column text_center">
	                    <div class="geo_loc">
	                        ${draft_incident.location}
	                    </div>
	                    <div class="flex status">
	                        <div class="right">${draft_incident._type}</div>
	                        <div class="left">${draft_incident.status}</div>
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
                    <div id="poster" class="right">Posted by: ${createdby}</div>
                </div>
            </div>
        </div>
    `
}

function get_record_username(record_user_id){
    let incident_url = `https://fred-reporter.herokuapp.com/api/v1/users/${record_user_id}`
    // let incident_url = `http://127.0.0.1:5000/api/v1/users/${record_user_id}`
    let username = ""
    get_data(incident_url)
    .then(function(data){
        if(data.status == 200){
            username = data["data"][0]["username"]
            localStorage.setItem("user_record", username)
        }
    })
    return localStorage.getItem("user_record")
}

//Function to get all records that are in draft state
function admin_get_draft_records(){
    current_page = localStorage.getItem("page")
    if(current_page == "admin_redflag.html"){
        incident_type = "red_flags"
    }else if(current_page == "admin_intervention.html"){
        incident_type = "interventions"
    }
    // let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}`
    let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}`
    get_data(incident_url)
    .then(function(data){
        draft_template2 = ""
        if(data.status == 200){
        	draft_records = data["data"]
            if(draft_records.length == 0){
                document.getElementById("main").innerHTML = empty_records()
            }
            draft_records.forEach((record) => {
                if(record.status == "draft"){
                    draft_template2 += admin_draft_incident(record)
                }
            })
            document.getElementById("main").innerHTML = draft_template2
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
