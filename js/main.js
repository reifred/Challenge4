//Collapsile button
  var coll = document.getElementsByClassName("collapsible");
  for (var i=0; i<coll.length; i++){
    coll[i].addEventListener("click", function(){
      this.classList.toggle("active");
      var records_content = this.nextElementSibling;
      if(records_content.style.display === "block"){
        records_content.style.display = "none";
        document.getElementById("user_name_top").style.display = "block";
      }else{
        records_content.style.display = "block";
        document.getElementById("user_name_top").style.display = "none";
      }
    });
  }

  function getLocation(){
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
      }else{
        alert("Failed to get location insert it manually")
      }
  }

  function showPosition(position){
    document.getElementById("lat").value = "Lat: " + position.coords.latitude;
    document.getElementById("long").value = "Long: " + position.coords.longitude;    
  }

