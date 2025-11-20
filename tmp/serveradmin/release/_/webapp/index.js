Webswing.getWebswingApi(document.location.origin + document.location.pathname).then(api => {
	window.webswingInstance0 = api.bootstrap(document.querySelector("#webswing"),
		{
	        // define startup options
            args: api.getParam('args'),
	        recording: api.getParam('recording'),
	        debugPort: api.getParam('debugPort'),
	        securityToken: api.getParam('securityToken'),
	        realm: api.getParam('realm'),
	        linkedViewId: api.getParam('linkedViewId'),
	        linkedViewName: api.getParam('linkedViewName')
		},
		(injector) => {
            // define customizations
		}
	)
}).catch(e => {
	console.error(e);
});