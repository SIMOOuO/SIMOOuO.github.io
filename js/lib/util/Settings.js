// Browser ES-module port of jikanjs Settings.js
// Original: https://github.com/mateoaranda/jikanjs — pure logic, unchanged.

class Settings {
    constructor(baseURL = 'https://api.jikan.moe', version = 4) {
        this.setBaseURL(baseURL, version);
    }

    getBaseURL() {
        return this.baseURL;
    }

    setBaseURL(baseURL, version) {
        if (version) this.v = version;
        this.baseURL = new URL(`/v${this.v}`, baseURL);
    }

    set version(version) {
        this.v = version;
        this.baseURL.pathname = `/v${version}`;
    }

    get version() {
        return this.v;
    }
}

export default new Settings();
