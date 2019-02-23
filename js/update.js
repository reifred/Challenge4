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

function toastFunction(message){
    var x = document.getElementById("toast")
    x.innerHTML = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
}

function edit_comment(){
	document.getElementsByClassName("edit_comment")[0].contentEditable = "true";	
}

function update_comment(record_id){
	document.getElementsByClassName("edit_comment")[0].contentEditable = "false";
    current_location = window.location.pathname
    if(current_location.includes("redflag")){
        incident_type = "red_flags"
    }else if(current_location.includes("intervention")){
        incident_type = "interventions"
    }
    let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}/${record_id}/comment`
    // let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}/${record_id}/comment`
    comment_update = {"comment": document.getElementsByClassName("edit_comment")[0].innerHTML}
    update_data(incident_url, comment_update)
    .then(data => {
        if(data.status == 200){
			toastFunction("Comment update successful");
            window.setTimeout(function(){
            	window.location.reload()
            }, 2500)
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

//Function to update the location of a record
function update_location(record_id){
    let current_location = window.location.pathname
    if(current_location.includes("redflag")){
        incident_type = "red_flags"
    }else if(current_location.includes("intervention")){
        incident_type = "interventions"
    }
	let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}/${record_id}/location`
	// let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}/${record_id}/location`
    location_update = {"location": document.getElementById("location").innerHTML}
    update_data(incident_url, location_update)
    .then(function(data){
        if(data.status == 200){
            toastFunction("Record status update successfull")
            window.setTimeout(function(){
            	window.location.reload()
            }, 2500)
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
function update_status(record_id){
    let select_status = document.getElementById("select_status")
    let status_value = select_status.options[select_status.selectedIndex].value

    let current_location = window.location.pathname
    if(current_location.includes("redflag")){
        incident_type = "red_flags"
    }else if(current_location.includes("intervention")){
        incident_type = "interventions"
    }
    let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}/${record_id}/status`
    // let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}/${record_id}/status`
    status_update = {"status": status_value}
    update_data(incident_url, status_update)
    .then(data => {
        if(data.status == 200){
            toastFunction("Record status update successfull")
            window.setTimeout(function(){
            	window.location.reload()
            }, 2500)
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
    current_location = window.location.pathname
    if(current_location.includes("redflag")){
        incident_type = "red_flags"
    }else if(current_location.includes("intervention")){
        incident_type = "interventions"
    }

    // let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}/${record_id}`
    let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}/${record_id}`
    let confirm_delete = confirm("Do you want to delete the record")
    if(confirm_delete == true){
        delete_data(incident_url)
        .then(function(data){
            if(data.status == 200){
	            toastFunction("Record deleted successfully")
                window.setTimeout(function(){
                	window.location.reload()
                }, 2500)
            }else if(data.status == 401){
            	toastFunction("Dear User, your session expired sign in again")
                log_out()
            }else if(data.status == 403){
            	toastFunction("Dear User, your aren't authorized to view that page")
                log_out()
            }else if(data.status == 400){
                alert(data.error)
            }
        });
    }
}
