function openTab(evt, elementName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("api-tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("api-tablink");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(elementName).style.display = "block";
    evt.currentTarget.className += " active";
  }

document.getElementById("get-button").click()