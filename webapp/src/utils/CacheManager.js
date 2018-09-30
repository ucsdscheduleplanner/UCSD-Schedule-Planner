import * as localforage from "localforage";

const VERSION = "version";

export class CacheManager {

    static async init() {
        if (await this.isCached(VERSION)) {
            let version = await this.get(VERSION);
            if (version !== "1.0") {
                window.console.log(`Version ${version} is out of date. Clearing cache`);
                this.clear();
            }
        }
        this.cache(VERSION, "1.0");
    }

    static async isCached(key) {
        let retObj = await localforage.getItem(key);
        return retObj !== null;
    }

    static async get(key) {
        return await localforage.getItem(key);
    }

    static cache(key, value) {
        localforage.setItem(key, value)
            .then(success => console.log(`Value ${value} cached under key ${key} succesfully`))
            .catch(error => console.error(`Value ${value} failed to cache under key ${key}`));
    }

    static clear() {
        localforage.clear();
    }
}