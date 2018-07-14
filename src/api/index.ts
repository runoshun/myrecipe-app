import { ImageURISource } from "react-native";
import { Ingredient } from "@root/EntityTypes";

import _image, { maybeDownloadImage } from "./image";
import _web from "./web";
import * as _units from "./common/extractUnit";
import * as _forms from "./common/formUtils";

export const image = _image;
export const web = _web;
export const forms = _forms;
export const units = _units;

export interface API {
    image: {
        takePhoto: () => Promise<ImageURISource>,
        pickImage: () => Promise<ImageURISource>,
        cleanImages: (excludes: string[]) => Promise<void>,
        maybeDownloadImage: (url?: string) => Promise<string | undefined>,
    },
    web: {
        parseIngredientsFromHtml: (url: string, html: string) => Promise<Ingredient[]>,
    },
    units: typeof units,
    forms: typeof forms,
}

export default ({
    image,
    web,
    units,
    forms
} as API);