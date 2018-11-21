import * as localforage from "localforage";

const VERSION = "version";

export class CacheManager {
    static instance = new CacheManager();
    cacheInstance = localforage;

    static get() {
        return this.instance;
    }

    async clearCacheIfNecessary(currentVersion, cache=this.cacheInstance) {
        let isCached = await this.isCached(VERSION, cache);
        if (isCached) {
            let version = await this.getFromCache(VERSION, cache);
            console.info(`On version ${version}`);
            if (version !== currentVersion) {
                console.info(`Version ${version} is out of date. Clearing cache`);
                this.clear(cache);
                console.info(`Caching version ${currentVersion}`);
                this.cache(VERSION, currentVersion, cache);
            }
        } else {
            console.info(`Caching version ${currentVersion}`);
            this.cache(VERSION, currentVersion, cache);
        }
    }

    async isCached(key, cache=this.cacheInstance) {
        let retObj = await cache.getItem(key);
        return retObj !== null;
    }

    async getFromCache(key, cache=this.cacheInstance) {
        return await cache.getItem(key);
    }

    cache(key, value, cache=this.cacheInstance) {
        cache.setItem(key, value)
            .then(success => console.log(`Value ${value} cached under key ${key} succesfully`))
            .catch(error => console.error(`Value ${value} failed to cache under key ${key}`));
    }

    clear(cache=this.cacheInstance) {
        cache.clear();
    }
}