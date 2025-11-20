var baseUrl = getBaseUrl();
var successUrl = getSuccessUrl();

Webswing.getWebswingApi(baseUrl).then(api => {
	window.webswingInstance0 = api.bootstrap(document.querySelector("#webswing"),
		{
            autoStart: false,
            args: api.getParam('args'),
	        securityToken: api.getParam('securityToken'),
	        realm: api.getParam('realm'),
            onReady: function() {
                if (successUrl.startsWith(baseUrl)) {
                    window.location.href = successUrl;
                }
            }
		},
		(injector) => {
		}
	)
}).catch(e => {
	console.error(e);
});

function getSuccessUrl() {
	try {
        var successUrl = getParam("successUrl");
        if (successUrl.startsWith("http://") || successUrl.startsWith("https://")) {
        	return "";
        }
        return document.location.origin + successUrl;
	} catch (e) {
		console.error(e);
	}
}

function getBaseUrl() {
	try {
        var baseUrl = getParam("baseUrl");
        if (baseUrl.startsWith("http://") || baseUrl.startsWith("https://")) {
        	return "";
        }
        if (!baseUrl.endsWith("/")) {
        	baseUrl += "/";
        }
        return document.location.origin + baseUrl;
	} catch (e) {
		console.error(e);
	}
}

function getParam(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var results = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(location.href);
    return results == null ? null : decodeURIComponent(results[1]);
}