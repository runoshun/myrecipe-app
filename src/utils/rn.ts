import { NativeModules } from "react-native";

export function getRNPackagerHostname(): string {
    const scriptURL = NativeModules.SourceCode.scriptURL;
    const address = scriptURL.split('://')[1].split('/')[0];
    const hostname = address.split(':')[0];

    return hostname;
}

export default {
    getRNPackagerHostname,
}