var baseUrl = getBaseUrl();

Webswing.getWebswingApi(baseUrl).then(api => {
	window.webswingInstance0 = api.bootstrap(document.querySelector("#webswing"),
		{
            autoStart: false,
            args: api.getParam('args'),
	        securityToken: api.getParam('securityToken'),
	        realm: api.getParam('realm'),
            onReady: function(wapi) {
                wapi.logout()
            }
		},
		(injector) => {
		}
	)
}).catch(e => {
	console.error(e);
});

function testIfAuthenticated() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == XMLHttpRequest.DONE) {
			var data;
			if (xmlhttp.status == 401 || xmlhttp.status == 403) {
				// not authorized redirect to baseurl
				window.location.href = baseUrl
			}
		}
	};
	xmlhttp.open("POST", baseUrl + "rest/refreshToken", true);
	xmlhttp.withCredentials = true;
	xmlhttp.send();
}

function getBaseUrl() {
    var baseUrl = document.location.origin + document.location.pathname;
    baseUrl = baseUrl.indexOf('adminConsoleLogout.html') > -1 ? baseUrl.split('adminConsoleLogout.html').join('') : baseUrl;
    return baseUrl;
}

testIfAuthenticated();
