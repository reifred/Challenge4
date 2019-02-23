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

function toastFunction(message){
    var x = document.getElementById("toast")
    x.innerHTML = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
}

function uploadImage(){
    image_file = document.getElementById("image").files[0]
    var formData = new FormData()
    formData.append("images", image_file)
    if(image_file){
        // post_image_url = `http://127.0.0.1:5000/api/v1/image`
        post_image_url = `https://fred-reporter.herokuapp.com/api/v1/images`
        fetch(post_image_url, {
            method: "POST",
            body: formData
        })
        .then(response => {
            if(response.status == 200){
                localStorage.setItem("image_upload", "success")
            }else{
                console.log("failed")
                localStorage.setItem("image_upload", "failure")
            }
        })
        localStorage.setItem("image_file", image_file["name"])
    }
}

//Functionality to add an incident
function add_record(){
    image_status = localStorage.getItem("image_upload")
    image_name = localStorage.getItem("image_file")
    let incident_select = document.getElementById("incident_type")
    incident_type = incident_select.options[incident_select.selectedIndex].value
    uploadImage()
    record = {
        "title": document.getElementById("title").value,
        "comment": document.getElementById("comment").value,
        "location": document.getElementById("location").innerHTML,
        "videos": ["none"]
    }

    let upload_status = true;
    if(image_status == "failure"){
        upload_status = confirm("Image upload failed continue anyway")
    }
    record["images"] = (image_status == "success") ? [image_name] : ["none"]
    
    passed = validation_passed()

    if(upload_status == true && passed == true ){
        // let incident_url = `http://127.0.0.1:5000/api/v1/${incident_type}`
        let incident_url = `https://fred-reporter.herokuapp.com/api/v1/${incident_type}`
        post_data(incident_url, record)
        .then(data => {
            console.log(data)
            if(data.status == 201){
                toastFunction("Record created successfully")
            }else if(data.status == 401){
                alert("Dear User, your session expired sign in again")
                log_out()
            }else if(data.status == 403){
                alert("Dear User, your aren't authorized to view that page")
                log_out()
            }else if(data.status == 400){
                console.log(data.error)
            }
        })
    }
    localStorage.removeItem("image_upload")
    localStorage.removeItem("image_file")
    return false;
}


function validation_passed(){
    const title = document.getElementById("title")
    const comment = document.getElementById("comment")
    const location = document.getElementById("location")

    let passed = true

    if(title.value.length < 5){
        title.classList.add("error")
        title.placeholder = "Title should not be atleast 5 characters"
        passed = false
    }
    if(comment.value.length < 10){
        comment.placeholder = "Comment should not be atleast 10 characters"
        comment.classList.add("error")
        passed = false;
    }
    if(location.innerHTML.length == 0){
        location.innerHTML = "Location should not be empty"
        location.style.color = "red"
        passed = false;
    }
    return passed
}