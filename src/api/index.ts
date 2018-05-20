import { ImageURISource, NativeModules } from "react-native";
import logger from "@root/utils/logger";
import { Ingredient } from "@root/EntityTypes";
import common from "./common";

const log = logger.create("backend");

export interface API {
    image: {
        takePhoto: () => Promise<ImageURISource>,
        pickImage: () => Promise<ImageURISource>,
    },
    web: {
        parseIngredientsFromHtml: (url: string, html: string) => Promise<Ingredient[]>,
    }
}

let backend: API;
if (NativeModules.ExponentConstants) {
    log("Using Expo backend");
    backend = require("./expo").default;
} else {
    log("Using Native backend");
    backend = require("./native").default;
}

backend.web = common.web;

export default backend;