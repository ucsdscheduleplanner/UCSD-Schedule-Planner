import {CacheManager} from "../utils/CacheManager";
import React from "react";

it('Puts correctly into cache', () => {
    CacheManager.cache("version", ".9");
    expect(CacheManager.get("version")).toBe(".9");
});