/*
Custom tabs for v1 REST API documentation pages.

See api/rest/v1/rest_bulk_api_template.md for an example of where this code is used.

Based on https://www.w3schools.com/howto/howto_js_tabs.asp
*/
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

// open "GET Request" tab by default
document.getElementById("get-button").click()