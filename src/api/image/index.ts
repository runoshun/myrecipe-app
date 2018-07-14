import { ImageURISource } from "react-native";
import * as RNFS from "react-native-fs";
import ImagePicker, { Image, Options } from "react-native-image-crop-picker";
import logger from "@root/utils/logger";

const parseUrl: (url: string) => URL = require("url-parse");

const log = logger.create("image");

const toFileUri = (path: string) => "file://" + path;

const imageDir = RNFS.DocumentDirectoryPath + "/saved_images";
const copyImage = async (from: string) => {
    let filename = from.substring(from.lastIndexOf("/") + 1);
    let to = imageDir + "/" + filename;
    await RNFS.mkdir(imageDir);
    try {
        await RNFS.copyFile(from, to);
    } catch(_) {
        // do nothing, because error is thrown if image already exitsts on iOS, 
    }
    return to;
};

const imageSourceFromResult = async (result: Image | Image[]) => {
    let image;
    if (Array.isArray(result)) {
        // this case will be impossible
        image = result[0];
    } else {
        image = result;
    }
    log("pick result: ", image);

    let path = await copyImage(image.path)
    log("saved_path: ", path);

    return { uri: toFileUri(path) };
}

const defaultOptions: Options = {
    cropping: true,
    multiple: false,
    mediaType: "photo",
    height: 1600,
    width: 2048,
    compressImageMaxHeight: 1600,
    compressImageMaxWidth: 2048,
}

export const takePhoto = async (): Promise<ImageURISource> => {
    let result = await ImagePicker.openCamera({
        ...defaultOptions
    });

    return imageSourceFromResult(result);
}

export const pickImage = async (): Promise<ImageURISource> => {
    let result = await ImagePicker.openPicker({
        ...defaultOptions
    });

    return imageSourceFromResult(result);
}

export const cleanImages = async (excludes: string[]) => {
    let items = await RNFS.readDir(imageDir);
    let images = items.filter(i => i.isFile()).map(i => imageDir + "/" + i.name);

    log("excludes: ", excludes);
    log("saved images: ", images);
    let ps = images.map(img => {
        if (!excludes.includes(img) && !excludes.includes(toFileUri(img))) {
            log("unlink: ", img);
            return RNFS.unlink(img);
        }
        return Promise.resolve(undefined);
    });
    ps.push(ImagePicker.clean());

    return Promise.all(ps).then(() => undefined);
};

export const maybeDownloadImage = async (url?: string) => {
    if (url && url.startsWith("http")) {
        let parsedUrl = parseUrl(url);
        let pathname = parsedUrl.pathname;
        let imagePath = imageDir + "/" + pathname.substring(pathname.lastIndexOf("/") + 1);

        let result = await RNFS.downloadFile({
            fromUrl: url,
            toFile: imagePath,
        }).promise;

        log("url: ", url);
        log("download result: ", result);
        log("imagePath: ", imagePath);
        if (result.statusCode === 200) {
            return toFileUri(imagePath);
        }
    }

    return url;
}

export default {
    takePhoto,
    pickImage,
    cleanImages,
    maybeDownloadImage,
}