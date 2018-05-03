import { NativeModules, Platform, PlatformOSType } from "react-native";

export function getRNPackagerHostname(): string {
    const scriptURL = NativeModules.SourceCode.scriptURL;
    const address = scriptURL.split('://')[1].split('/')[0];
    const hostname = address.split(':')[0];

    return hostname;
}

export const isRunningOnExpo = (): boolean => {
    return !!NativeModules.ExponentConstants;
}

export const os = (): PlatformOSType => {
    return Platform.OS;
}

export default {
    os,
    getRNPackagerHostname,
    isRunningOnExpo,
}