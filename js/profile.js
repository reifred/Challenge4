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
user_id = localStorage.getItem("user_id")
let user_url = `https://fred-reporter.herokuapp.com/api/v1/users/${user_id}`
// let user_url = `http://127.0.0.1:5000/api/v1/users/${user_id}`
get_data(user_url)
.then(function(data){
    console.log(data)
    if(data.status == 200){
        user_template = "";
        user_info = data["data"]
        user_info.forEach((field) => {
            user_template += user_table(field)
            document.getElementById("user_template").innerHTML = user_template
        });
    }
})


function user_table(user_data){
    return `
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
                                <td class="profile_details_title">Email:</td><td>${user_data.email}m</td>
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

            </div>    
    `
}
