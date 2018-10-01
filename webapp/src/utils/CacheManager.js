import * as localforage from "localforage";

const VERSION = "version";
const CURRENT_VERSION = "1.1";

export class CacheManager {
    static instance = new CacheManager();

    static get() {
        return this.instance;
    }

    async checkVersion() {
        let isCached = await this.isCached(VERSION);
        if (isCached) {
            let version = await this.getFromCache(VERSION);
            console.info(`On version ${version}`);
            if (version !== CURRENT_VERSION) {
                console.info(`Version ${version} is out of date. Clearing cache`);
                this.clear();
                console.info(`Caching version ${CURRENT_VERSION}`);
                this.cache(VERSION, CURRENT_VERSION);
            }
        } else {
            console.info(`Caching version ${CURRENT_VERSION}`);
            this.cache(VERSION, CURRENT_VERSION);
        }
    }

    async isCached(key) {
        let retObj = await localforage.getItem(key);
        return retObj !== null;
    }

    async getFromCache(key) {
        return await localforage.getItem(key);
    }

    cache(key, value) {
        localforage.setItem(key, value)
            .then(success => console.log(`Value ${value} cached under key ${key} succesfully`))
            .catch(error => console.error(`Value ${value} failed to cache under key ${key}`));
    }

    clear() {
        localforage.clear();
    }
}