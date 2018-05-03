import { ImageURISource, NativeModules } from "react-native";

export interface API {
    image: {
        takePhoto: () => Promise<ImageURISource>,
        pickImage: () => Promise<ImageURISource>,
    }
}

let backend: API;
if (NativeModules.ExponentConstants) {
    backend = require("./expo").default;
} else {
    backend = require("./native").default;
}

export default backend;