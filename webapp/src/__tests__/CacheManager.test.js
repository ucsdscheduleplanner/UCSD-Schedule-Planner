import {CacheManager} from "../utils/CacheManager";
import React from "react";

describe('Caching and storing information locally', () => {
    class TestCache {
        cache = {};

        async setItem(key, value) {
            this.cache[key] = value;
        }

        async getItem(key) {
            return this.cache[key];
        }

        async clear() {
            this.cache = {};
        }
    }

    let testCache = new TestCache();

    test('Can put things in the cache', async () => {
        const VERSION = "1.0";
        const VERSION_KEY = "version";
        CacheManager.get().cache(VERSION_KEY, VERSION, testCache);
        let result = await CacheManager.get().getFromCache(VERSION_KEY, testCache);
        expect(result).toBe(VERSION);
    });

    test('Invalidates the cache when version changes', async () => {
        const VERSION = "1.0";
        const NEW_VERSION = "1.1";
        const VERSION_KEY = "version";

        CacheManager.get().cache(VERSION_KEY, VERSION, testCache);
        let result = await CacheManager.get().getFromCache(VERSION_KEY, testCache);
        expect(result).toBe(VERSION);

        CacheManager.get().cache("hello", "hello_str", testCache);

        result = await CacheManager.get().getFromCache("hello", testCache);
        expect(result).toBe("hello_str");

        await CacheManager.get().checkVersion(NEW_VERSION, testCache);

        // check after the clear to see if cache was cleared
        result = await CacheManager.get().getFromCache(VERSION_KEY, testCache);
        expect(result).toBe(NEW_VERSION);

        result = await CacheManager.get().getFromCache("hello", testCache);
        expect(result).toBe(undefined);
    });
});