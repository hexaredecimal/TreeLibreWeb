var baseUrl = getBaseUrl();

Webswing.getWebswingApi(baseUrl).then(api => {
	window.webswingInstance0 = api.bootstrap(document.querySelector("#webswing"),
		{
			autoStart: false,
			useWindowTop: false,
            args: api.getParam('args'),
	        debugPort: api.getParam('debugPort'),
	        securityToken: api.getParam('securityToken'),
	        realm: api.getParam('realm'),
			onReady: function(wapi) {
				var targetWindow = window.opener || window.top;
				wapi.readUnlockToken().then(function(unlockToken){
					targetWindow.postMessage({ type: 'webswing-unlock-token', value: unlockToken }, baseUrl);
				}).catch(function(e){
					targetWindow.postMessage({ type: 'webswing-unlock-token', value: '"unlockTokenError:' + e + '"' }, baseUrl);
				})
			},
		},
		(injector) => {
			injector.services.webswing.configureFetchHeaders = function(headers){
				headers["X-webswing-challenge"] = api.getParam("challenge");
				return headers;
			}
		}
	)
}).catch(e => {
	console.error(e);
});

function getBaseUrl() {
	var baseUrl = document.location.origin + document.location.pathname;
    baseUrl = baseUrl.indexOf('unlockSessionLogin.html') > -1 ? baseUrl.split('unlockSessionLogin.html').join('') : baseUrl;
    return baseUrl;
}