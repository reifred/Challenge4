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

current_location = window.location.pathname
if(current_location.includes("redflag")){
    incident_type = "red_flags"
}else if(current_location.includes("intervention")){
    incident_type = "interventions"
}

//Get all redflag/intervention records and present them in redflag template table
// let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}`
let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}`
get_data(incident_url)
.then(function(data){
    record_template = "";
    if(data.status == 200){
        records = data["data"]
        records.forEach((record) => {
            record_template += incident_table(record)
        });
        if(records.length == 0){
            document.getElementById("record_template").innerHTML  = no_records()
        }else{
            document.getElementById("record_template").innerHTML = record_template
        }
    }else if(data.status == 401){
        alert("Dear User, your session expired sign in again")
        log_out()
    }else if(data.status == 403){
        alert("Dear User, your aren't authorized to view that page")
        log_out()
    }else if(data.status == 400){
        document.getElementById("record_template").innerHTML = data.error
    }
})

function no_records(){
    return `
        <div id="norecord">
            <img width="100%" src="../images/norecord.png">
        </div>
    `
}

function incident_table(record_data){
    return `
        <div class="card">
            <div class="record">
                <div class="record_title"><b>${record_data.title}</b></div>
                <p class="record_description">${record_data.comment}</p>
                <div class="record_status">${record_data.status}</div>
                <input type="button" onclick="openModal(${record_data.id})" name="" value="view more">
            </div>
        </div>
    `
}

function openModal(record_id){
    current_location = window.location.pathname
    if(current_location.includes("redflag")){
        incident_type = "red_flags"
    }else if(current_location.includes("intervention")){
        incident_type = "interventions"
    }

    document.getElementById("mymodal").style.display = "block";
    // let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}/${record_id}`
    let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}/${record_id}`
    get_data(incident_url)
    .then(function(data){
        modal_template = ""; 
        if(data.status == 200){
            records = data["data"]
            records.forEach((record) => {
                modal_template += modal_table(record)
            });
            document.getElementById("modal_template").innerHTML = modal_template
        }else if(data.status == 401){
            alert("Dear User, your session expired sign in again")
            log_out()
        }else if(data.status == 403){
            alert("Dear User, your aren't authorized to view that page")
            log_out()
        }else if(data.status == 400){
            document.getElementById("record_template").innerHTML = data.error
        }
    })
}

function closeModal(){
    document.getElementById("mymodal").style.display = "none";
}

function modal_table(record_data){
   return `
        <div class="card page_title_card single_record">
            <div class="page_title">${record_data.title}</div>
        </div>

        <div class="card">
            <div class="profile single_record">
                <table>
                    <thead><b>Record Information</b></thead>
                    <tr>
                        <td class="profile_details_title">Created On:</td><td>${record_data.createdon}</td>
                    </tr>
                    <tr>
                        <td class="profile_details_title">Created By:</td><td>${record_data.createdby}</td>
                    </tr>
                    <tr>
                        <td class="profile_details_title">Current Status:</td><td>${record_data.status}</td>
                    </tr>
                </table>
            </div>
        </div>
    <div class="card">
        <div class="single_record">
            <div class="record_title"><b>Location</b></div>
            <p class="record_description">${record_data.location}</p>
        </div>
    </div>
    <div class="card">
        <div class="single_record">
            <div class="record_title"><b>Comment</b></div>
            <p class="record_description edit_comment" contenteditable="false">${record_data.comment}</p>
            <div class="comment_buttons" id="user_link_comment">
                <input onclick="edit_comment();" type="button" name="" value="Edit Comment">
                <input onclick="update_comment(${record_data.id});" type="button" name="" value="Update Comment">
            </div>
        </div>
    </div>
    <div class="card">
        <div class="single_record">
            <div class="record_title"><b>Media</b></div>
            <img width="50px" height="50px" src="../images/no_corruption.jpg">
            <div id="user_link_image">
                <div>
                    Add Media
                </div>
                <input type="file" name="" value="Add image">                           
            </div>
        </div>
    </div>
    <div class="card" id="user_link_location">
        <div class="single_record">
            <div class="form-field">
                <input type="button" onclick="getLocation();" name="geolocation" value="Current Location">
                <div id="location">${record_data.location}</div>
            </div>
            <div class="form-title">Location from map.</div>
            <div class="record_page_buttons">
                <input type="button" onclick="update_location(${record_data.id})" value="Update Location">
            </div>        
        </div>
    </div>
    <div class="card" id="admin_link_update">
        <div class="single_record">
            <div class="record_title"><b>${record_data.status}</b></div>
            <select id="select_status">
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
                <option value="under investigation">Under Investigation</option>
            </select>
            <input type="button" onclick="update_status(${record_data.id});" name="" value="Update Status">
        </div>
    </div>
    <div class="card">
        <div class="record_buttons">
            <input type="button" name="" onclick="closeModal();" value="Cancel">
            <input type="button" id="edit" name="" onclick="edit_record('${record_data.status}')" value="Edit">
            <input type="button" id="user_link_delete" onclick="delete_record(${record_data.id})" name="" value="Delete">
        </div>
    </div>
    `
}
