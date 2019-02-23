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

//Get all users and present them in user template table
// get_data("http://127.0.0.1:5000/api/v1/users")
get_data("https://fred-reporter.herokuapp.com/api/v1/users")
.then(function(data){
    if(data.status == 200){
        user_template = "";
        user_modal = "";
        users = data["data"][0]["users"]
        users.forEach((user) => {
            user_template += user_table(user)
        });
        if(users.length == 0){
        	document.getElementById("user_template").innerHTML	= no_records()
        }else{
	        document.getElementById("user_template").innerHTML = user_template 
        }
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

function no_records(){
	return `
		<div id="norecord">
			<img width="100%;" src="../images/norecord.png">
		</div>
	`
}

function user_table(user_data){
    return `
        <div class="card">
            <div class="user">
                <img src="../images/user.jpg">
                <div><b>${user_data.username}</b></div>
                <div>${user_data.email}</div>
                <input type="button" onclick="openUserModal(${user_data.id})" name="" value="view more">
            </div>
        </div>
    `
}

function openUserModal(user_data){
    console.log(user_data)
    document.getElementById("myusermodal").style.display = "block";
    
    //Get all users and present them in user template table
    // get_data(`http://127.0.0.1:5000/api/v1/users/${user_data}`)
    get_data(`https://fred-reporter.herokuapp.com/api/v1/users/${user_data}`)
    .then(function(data){
        if(data.status == 200){
            user_modal = "";
            user = data["data"]
            user.forEach((field) => {
                user_modal += modal_table(field)
            });
            document.getElementById("user_modal").innerHTML = user_modal 
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

function closeUserModal(){
    document.getElementById("myusermodal").style.display = "none";
}

function modal_table(user_data){
    return `
    <form>              
        <div class="cards">
        <div class="card">
            <div class="profile">
                <img src="../images/user.jpg">
                <div></div>
                <table>
                    <thead><b>Account Information</b></thead>
                    <tr>
                        <td class="profile_details_title">Username:</td><td>${user_data.username}</td>
                    </tr>
                    <tr>
                        <td class="profile_details_title">Email:</td><td>${user_data.email}</td>
                    </tr>
                    <tr>
                        <td class="profile_details_title">Registered:</td><td>${user_data.registered}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="card">
            <div class="profile">
                <table>
                    <thead><b>Personal Information</b></thead>
                    <tr>
                        <td class="profile_details_title">First Name:</td><td>${user_data.firstname}</td>
                    </tr>
                    <tr>
                        <td class="profile_details_title">Last Name:</td><td>${user_data.lastname}</td>
                    </tr>
                    <tr>
                        <td class="profile_details_title">Other Names:</td><td>${user_data.othername}</td>
                    </tr>
                    <tr>
                        <td class="profile_details_title">Phone Number:</td><td>${user_data.phonenumber}</td>
                    </tr>
                    <tr>
                        <td class="profile_details_title">Administrator:</td><td>${user_data.isadmin}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="card">
            <div class="profile">
                <table>
                    <thead>
                        <th>Redflags</th><th>20</th>
                    </thead>
                    <tr>
                        <td class="profile_details_title">Draft:</td><td>5</td>
                    </tr>
                    <tr>
                        <td class="profile_details_title">Resolved:</td><td>6</td>
                    </tr>
                    <tr>
                        <td class="profile_details_title">Rejected:</td><td>2</td>
                    </tr>
                    <tr>
                        <td class="profile_details_title">Investigation:</td><td>9</td>
                    </tr>
                </table>
            </div>
        </div>

    <div class="card">
        <div class="profile">
            <table>
                <thead>
                    <th>Interventions</th><th>20</th>
                </thead>
                <tr>
                    <td class="profile_details_title">Draft:</td><td>5</td>
                </tr>
                <tr>
                    <td class="profile_details_title">Resolved:</td><td>6</td>
                </tr>
                <tr>
                    <td class="profile_details_title">Rejected:</td><td>2</td>
                </tr>
                <tr>
                    <td class="profile_details_title">Investigation:</td><td>9</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="card">
        <div class="single_record">
            <select>
                <option>Admin</option>
                <option>Non Admin</option>
            </select>
            <input type="button" name="" value="Change User role">
        </div>
    </div>

    <div class="card">
        <div class="record_buttons">
            <input type="button" name="" onclick="closeUserModal();" value="Cancel">
            <input type="submit" name="" value="Update">
        </div>
    </div>

    </form>
    `
}