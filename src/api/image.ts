//import { ImagePicker, FileSystem } from "expo"
import { ImageURISource } from "react-native";

// TODO: resize image

//const imageDir = FileSystem.documentDirectory + "saved_images";
//const copyImage = async (from: string) => {
//    //let filename = from.substring(from.lastIndexOf("/"));
//    //let to = imageDir + "/" + filename;
//    //await FileSystem.makeDirectoryAsync(imageDir, { intermediates: true });
//    //await FileSystem.copyAsync({from, to})
//    //return to;
//    throw "not implemented"
//};

export const takePhoto = async (): Promise<ImageURISource> => {
    //let result = await ImagePicker.launchCameraAsync({ quality: 0 });
    //if (result.cancelled === true) {
    //    throw "canceled";
    //} else {
    //    let uri = await copyImage(result.uri);
    //    return {
    //        uri: uri,
    //        width: result.width,
    //        height: result.height,
    //    }
    //}
    throw "not implemented"
}

export const pickImage = async (): Promise<ImageURISource> => {
    //let result = await ImagePicker.launchImageLibraryAsync({ quality: 0 });
    //if (result.cancelled === true) {
    //    throw "canceld"
    //} else {
    //    let uri = await copyImage(result.uri);
    //    return {
    //        uri: uri,
    //        width: result.width,
    //        height: result.height,
    //    }
    //}
    throw "not implemented"
}
