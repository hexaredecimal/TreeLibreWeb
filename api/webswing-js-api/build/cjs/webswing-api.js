"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebswingApi = getWebswingApi;
exports.getWebswingApiFactory = getWebswingApiFactory;
const inProgress = new Map();
const randomPrefix = (Math.random() + 1).toString(36).substring(7);
const globalApiRegister = self['__webswing_api_module__'] = self['__webswing_api_module__'] || { api: {} };
const apiRegister = globalApiRegister.api = globalApiRegister["api"] || {};
function getWebswingApi(connectionUrl, i18n) {
    return getWebswingApiFactory(connectionUrl).then(factory => {
        return factory.createWebswingApi(i18n);
    });
}
function getWebswingApiFactory(connectionUrl) {
    connectionUrl = initUrl(connectionUrl);
    return loadVersion(connectionUrl).then(v => {
        const version = normalizeVersionString(v);
        if (!apiRegister[version]) {
            return new Promise((resolve, reject) => {
                const url = connectionUrl + 'javascript/webswing-embed.js?version=' + version;
                loadScript(url, (event) => {
                    if (isEvent(event)) {
                        if (event.type === 'error') {
                            reject(`Failed to load script at ${url}!`);
                        }
                        else if (!apiRegister[version]) {
                            reject(`Failed to load webswingApi due to unexpected or missing version. Expected version [${version}], loaded versions [${Object.keys(apiRegister).join(',')}]!`);
                        }
                        else {
                            resolve(apiRegister[version](connectionUrl));
                        }
                    }
                    else {
                        reject(`Failed to load ${connectionUrl}/javascript/webswing-embed.js due to ${event}!`);
                    }
                }, version);
            });
        }
        else {
            return apiRegister[version](connectionUrl);
        }
    });
}
function normalizeVersionString(version) {
    if (version == null) {
        return version;
    }
    const idx = version.indexOf('-modified-');
    if (idx != -1) {
        version = version.substring(0, idx);
    }
    return version;
}
function initUrl(baseUrl) {
    if (baseUrl == null) {
        baseUrl = document.location.origin + document.location.pathname;
        baseUrl = baseUrl.indexOf("/", baseUrl.length - 1) !== -1 ? baseUrl : (baseUrl + "/");
    }
    return withTrailingSlash(baseUrl);
}
function withTrailingSlash(url) {
    return !url.endsWith('/') ? url + '/' : url;
}
function loadVersion(connectionUrl) {
    var url = connectionUrl + "rest/version";
    return fetch(url).then((val) => {
        return val.text();
    }).catch(e => {
        console.error(`Failed to resolve version from url ${url}!`);
        console.error(e);
        return 'undefined';
    });
}
function isEvent(eventOrString) {
    return eventOrString.type !== undefined;
}
const loadScript = (url, done, key) => {
    const inProgressUrl = inProgress.get(url);
    if (inProgressUrl != undefined) {
        inProgressUrl.push(done);
        return;
    }
    let script;
    let needAttach = false;
    if (key !== undefined) {
        let scripts = document.getElementsByTagName("script");
        for (let i = 0; i < scripts.length; i++) {
            let s = scripts[i];
            if (s.getAttribute("src") == url || s.getAttribute("data-webswing-script") == randomPrefix + key) {
                script = s;
                break;
            }
        }
    }
    if (!script) {
        needAttach = true;
        script = document.createElement('script');
        script.setAttribute("data-webswing-script", randomPrefix + key);
        script.src = url;
    }
    inProgress.set(url, [done]);
    var onScriptComplete = (prev, event) => {
        if (script) {
            script.onerror = script.onload = null;
            clearTimeout(timeout);
            var doneFns = inProgress.get(url);
            inProgress.delete(url);
            script.parentNode && script.parentNode.removeChild(script);
            doneFns && doneFns.forEach((fn) => (fn(event)));
            if (prev)
                return prev.apply(script, event);
        }
    };
    var timeout = setTimeout(onScriptComplete.bind(script, null, 'timeout'), 120000);
    script.onerror = onScriptComplete.bind(script, script.onerror);
    script.onload = onScriptComplete.bind(script, script.onload);
    needAttach && document.head.appendChild(script);
};
