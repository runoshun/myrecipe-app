import { ImageURISource, NativeModules } from "react-native";
import logger from "@root/utils/logger";

const log = logger.create("backend");

export interface API {
    image: {
        takePhoto: () => Promise<ImageURISource>,
        pickImage: () => Promise<ImageURISource>,
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

export default backend;