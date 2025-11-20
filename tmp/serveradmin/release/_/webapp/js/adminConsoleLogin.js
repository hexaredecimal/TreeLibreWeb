var baseUrl = getBaseUrl();

Webswing.getWebswingApi(baseUrl).then(api => {
	window.webswingInstance0 = api.bootstrap(document.querySelector("#webswing"),
		{
            autoStart: false,
            args: api.getParam('args'),
	        securityToken: api.getParam('securityToken'),
	        realm: api.getParam('realm'),
            onReady: function() {
                getAdminLoginToken(function(data) {
                    if (data) {
                        var json = JSON.parse(data);
                        if (json && json.accessId) {
                            loadAdminConsoleUrl(function(adminConsoleUrl) {
                                if (!document.referrer || document.referrer.length == 0) {
                                    window.location.href = baseUrl + "adminConsoleLoginError.html?error=unknown";
                                } else if (!adminConsoleUrl || adminConsoleUrl.length == 0) {
                                    window.location.href = baseUrl + "adminConsoleLoginError.html?error=not_found";
                                /* } else if (adminConsoleUrl.indexOf("http") == 0 && document.referrer.indexOf("http") == 0 && adminConsoleUrl.indexOf(document.referrer) != 0) {
                                    window.location.href = baseUrl + "adminConsoleLoginError.html?error=referrer"; */
                                } else if (document.referrer.indexOf("http://localhost:9004") == 0) {
                                    window.location.href = "http://localhost:9004/admin/" + "login.html?accessId=" + json.accessId;
                                } else {
                                    window.location.href = adminConsoleUrl + "login.html?accessId=" + json.accessId + "&securitySuffix=" + api.getParam("securitySuffix");
                                }
                            });
                        }
                    } else {
                        console.error("Failed to get accessId!");
                    }
                });
            }
		},
		(injector) => {
            // define customizations
		}
	)
}).catch(e => {
	console.error(e);
});

function getBaseUrl() {
    var baseUrl = document.location.origin + document.location.pathname;
    baseUrl = baseUrl.indexOf('adminConsoleLogin.html') > -1 ? baseUrl.split('adminConsoleLogin.html').join('') : baseUrl;
    return baseUrl;
}

function loadAdminConsoleUrl(callback) {
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            var data;
            if (xmlhttp.status == 200) {
            	data = xmlhttp.responseText;
            } else if (xmlhttp.status == 401 || xmlhttp.status == 403) {
            	// not authorized to get the url
            	window.location.href = baseUrl + "adminConsoleLoginError.html?error=unauthorized";
            } else {
            	// different problem
            	window.location.href = baseUrl + "adminConsoleLoginError.html?error=unknown";
            }
            if (callback) {
            	(callback)(data);
            }
        }
    };
    xmlhttp.open("GET", baseUrl + "rest/adminConsoleUrl", true);
    xmlhttp.withCredentials = true;
    xmlhttp.send();
}

function getAdminLoginToken(callback) {
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            var data;
            if (xmlhttp.status == 200) {
            	data = xmlhttp.responseText;
            } else if (xmlhttp.status == 401 || xmlhttp.status == 403) {
            	// not authorized to get the url
            	window.location.href = baseUrl + "adminConsoleLoginError.html?error=unauthorized";
            } else {
            	// different problem
            	window.location.href = baseUrl + "adminConsoleLoginError.html?error=unknown";
            }
            if (callback) {
            	(callback)(data);
            }
        }
    };
    xmlhttp.open("GET", baseUrl + "rest/adminConsoleToken", true);
    xmlhttp.withCredentials = true;
    xmlhttp.send();
}