// Browser ES-module port of jikanjs Request.js
// Same public interface as the Node original — send(args, parameter, mal)
// and urlBuilder(args, parameter, mal) — but network I/O uses the browser's
// native fetch() instead of Node's https module (which doesn't exist here).

import Settings from './Settings.js';

class Request {
    /**
     * Sends a request with URL parts and optional query parameters.
     * @param {*[]} args           URL parts
     * @param {{}} [parameter]     Query parameters
     * @param {boolean} [mal=false] Request to official MAL API?
     * @returns {Promise<*>}
     */
    async send(args, parameter, mal = false) {
        const url = this.urlBuilder(args, parameter, mal);
        const init = mal
            ? { headers: { 'X-MAL-CLIENT-ID': '6114d00ca681b7701d1e15fe11a4987e' } }
            : {};
        const response = await fetch(url, init);
        const data = await response.json();
        if (!response.ok) return Promise.reject(new Error((data && data.error) || response.status));
        return data;
    }

    /**
     * Same URL builder as the original Node version.
     */
    urlBuilder(args, parameter, mal) {
        const url = new URL(mal ? 'https://api.myanimelist.net/v2' : Settings.getBaseURL());
        url.pathname += '/' + args.filter(x => x).join('/');
        if (parameter) {
            for (const [key, value] of Object.entries(parameter)) {
                if (value !== 0 && !value) continue;
                url.searchParams.append(key, value);
            }
        }
        return url.href;
    }
}

export default Request;
