// Browser ES-module port of jikanjs (mateoaranda/jikanjs).
// All function names, argument order and defaults are preserved verbatim.
// Only the CommonJS require/module.exports were replaced with ESM import/export.

import Request from './util/Request.js';
import Settings from './util/Settings.js';

class JikanAPI {
    constructor() {
        this.settings = Settings;
        this.request = new Request();
    }

    loadAnime(id, request, parameters) {
        if (request === 'episodes' && typeof parameters === 'number') {
            return this.request.send(['anime', id, request, parameters]);
        } else if (request === 'videosepisodes') {
            return this.request.send(['anime', id, 'videos', 'episodes']);
        }
        return this.request.send(['anime', id, request], parameters);
    }

    loadCharacter(id, request) {
        return this.request.send(['characters', id, request]);
    }

    loadClub(id, request, page = 1) {
        return this.request.send(['clubs', id, request], { page });
    }

    loadGenres(type, filter) {
        return this.request.send(['genres', type], { filter });
    }

    loadMagazines(page = 1) {
        return this.request.send(['magazines'], { page });
    }

    loadManga(id, request, page = 1) {
        return this.request.send(['manga', id, request], { page });
    }

    loadPerson(id, request) {
        return this.request.send(['people', id, request]);
    }

    loadProducers(id = null, request, page = 1) {
        if (id) return this.request.send(['producers', id, request], { page });
        return this.request.send(['producers'], { page });
    }

    loadRandom(type) {
        return this.request.send(['random', type]);
    }

    loadRecommendations(type, page = 1) {
        return this.request.send(['recommendations', type], { page });
    }

    loadReviews(type, page = 1, preliminary, spoiler) {
        return this.request.send(['reviews', type], { page, preliminary, spoiler });
    }

    loadSchedule(day, page = 1, limit, kids = false, sfw = false, unapproved = false) {
        return this.request.send(['schedules'], { filter: day, page, limit, kids, sfw, unapproved });
    }

    loadUser(username, request, page = 1) {
        return this.request.send(['users', username, request], { page });
    }

    loadAnimelist(username, limit = 1000, offset = 0) {
        return this.request.send(['users', username, 'animelist'], { fields: 'list_status', limit, offset }, true);
    }

    loadMangalist(username, limit = 1000, offset = 0) {
        return this.request.send(['users', username, 'mangalist'], { fields: 'list_status', limit, offset }, true);
    }

    loadSeason(year, season, page = 1) {
        return this.request.send(['seasons', year, season], { page });
    }

    loadSeasonArchive() {
        return this.request.send(['seasons']);
    }

    loadCurrentSeason(page = 1) {
        return this.request.send(['seasons', 'now'], { page });
    }

    loadUpcomingSeason(page = 1) {
        return this.request.send(['seasons', 'upcoming'], { page });
    }

    loadTop(type, page = 1, subtype, filter) {
        return this.request.send(['top', type], { type: subtype, filter, page });
    }

    loadWatch(type, page = 1, limit, popular) {
        return this.request.send(['watch', type, popular ? 'popular' : undefined], { page, limit });
    }

    search(type, query, limit, parameters = {}) {
        if (!parameters.q && query) parameters.q = query;
        if (!parameters.limit && limit) parameters.limit = limit;
        return this.request.send([type], parameters);
    }

    raw(urlParts, queryParameters, mal = false) {
        if (!Array.isArray(urlParts)) {
            return Promise.reject(new Error(`The given parameter should be an array like [anime, 1] but given was ${urlParts}`));
        }
        return this.request.send(urlParts, queryParameters, mal);
    }
}

export default new JikanAPI();
