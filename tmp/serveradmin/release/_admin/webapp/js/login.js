function login() {
    var baseUrl = getBaseUrl();
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                var json = JSON.parse(xmlhttp.responseText);
                if (json && json.accessToken) {
                    window.location.href = baseUrl;
                    return;
                }
            }
            window.location.href = baseUrl + "loginError.html";
        }
    };
    xmlhttp.open("GET", baseUrl + "rest/login?accessId=" + getParam("accessId"), true);
    xmlhttp.setRequestHeader("X-webswing-securitySuffix", getParam("securitySuffix"));
    xmlhttp.withCredentials = true;
    xmlhttp.send();
}

function getBaseUrl() {
    var baseUrl = document.location.origin + document.location.pathname;
    baseUrl = baseUrl.indexOf('login.html') > -1 ? baseUrl.split('login.html').join('') : baseUrl;
    return baseUrl;
}

function getParam(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var results = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(location.href);
    return results == null ? null : decodeURIComponent(results[1]);
}

login();