document.getElementById('backLink').addEventListener('click', function(event) {
    event.preventDefault();
    goBack();
});

function goBack() {
    window.location.href = getBaseUrl();
}

function getBaseUrl() {
    var baseUrl = document.location.origin + document.location.pathname;
    baseUrl = baseUrl.indexOf('loginError.html') > -1 ? baseUrl.split('loginError.html').join('') : baseUrl;
    return baseUrl;
}