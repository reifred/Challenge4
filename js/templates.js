is_admin = localStorage.getItem("admin")

admin_links = document.getElementsByClassName("admin_link");
user_links = document.getElementsByClassName("user_link");


for(let link = 0; link < admin_links.length; link++){
	if(is_admin == "true"){
		admin_links[link].style.display = "block";
	}
}

for(let link = 0; link < user_links.length; link++){
	if(is_admin == "false"){
		user_links[link].style.display = "block";
	}
}

function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }else{
    alert("Failed to get location use map cordinates")
  }
}

function showPosition(position){
	Lat_cordinates = "Lat: " + position.coords.latitude;
	Long_cordinates = "Long: " + position.coords.longitude;
	document.getElementById("location").innerHTML = `${Lat_cordinates} ${Long_cordinates}`
}

function edit_record(record_status){
	if(is_admin == "true"){
		document.getElementById("admin_link_update").style.display = "block"
	}else if(is_admin == "false" && record_status == "draft"){
		document.getElementById("user_link_comment").style.display = "block"
		document.getElementById("user_link_location").style.display = "block"
		document.getElementById("user_link_image").style.display = "block"
		document.getElementById("user_link_delete").style.display = "block"
	}
	document.getElementById("edit").style.display = "none"
}

function log_out(){
    localStorage.clear()
    location = "sign_in.html"
    return false;
}