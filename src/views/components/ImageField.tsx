import * as React from "react";
import { ImageProperties, Image, ViewProperties, ImageURISource } from "react-native";

import res from "@root/resources";
import Touchable from "./common/Touchable";
import { AppActionSheet } from "./Themed";

export interface ImageFieldProperties {
    onTakeImage?: () => Promise<ImageURISource>,
    onPickImage?: () => Promise<ImageURISource>,
    onInputSource?: (input: string) => Promise<ImageURISource>,
    onChangeImage?: (image: ImageURISource, oldImage?: ImageURISource)=> void,
    imageStyle?: ImageProperties["style"],
    style?: ViewProperties["style"],
    initialImage?: ImageURISource,
    noImage?: ImageURISource,
}

interface State {
    source: ImageURISource,
    hasImage: boolean,
}

const transparentImage = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default class ImageField extends React.Component<ImageFieldProperties, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            source: this.props.initialImage || this.props.noImage || { uri: transparentImage },
            hasImage: this.props.initialImage !== undefined,
        }
        if (this.state.hasImage) {
            this.props.onChangeImage && this.props.onChangeImage(this.state.source);
        }
    }

    showInputView = () => {
        // TODO: implement
    }

    fireOnChange = (source: ImageURISource) => {
        let old = this.state.source;
        this.setState({ source: source, hasImage: true });
        this.props.onChangeImage && this.props.onChangeImage(source, old);
    }

    handleTakeImage = async () => {
        if (this.props.onTakeImage) {
            try {
                let source = await this.props.onTakeImage();
                AppActionSheet.hide();
                this.fireOnChange(source);
            } catch (e) {
                // canceled
            }
        }
    }

    handlePickImage = async () => {
        if(this.props.onPickImage) {
            try {
                let source = await this.props.onPickImage();
                AppActionSheet.hide();
                this.fireOnChange(source);
            } catch (e) {
                // canceled
            }
        }
    }

    handleDeleteImage = async () => {
        this.setState({ source: this.props.noImage || { uri: transparentImage }, hasImage: false })
        this.props.onChangeImage && this.props.onChangeImage(this.state.source);
        AppActionSheet.hide();
    }

    showMenu = () => {
        AppActionSheet.show({
            items: [
                { icon: "camera-outline", label: res.strings.imageFieldTakePhoto(), onPress: this.handleTakeImage, hide: this.props.onTakeImage === undefined },
                { icon: "images-outline", label: res.strings.imageFieldPickImage(), onPress: this.handlePickImage, hide: this.props.onPickImage === undefined },
                { icon: "globe-outline", label: res.strings.imageFieldInputUrl(), onPress: this.showInputView, hide: this.props.onInputSource === undefined },
                { icon: "trash-outline", label: res.strings.imageFieldDeleteImage(), onPress: this.handleDeleteImage, hide: !this.state.hasImage },
            ]
        })
    }

    render() {
        return (
            <Touchable onPress={this.showMenu} style={this.props.style}>
                <Image source={this.state.source} style={this.props.imageStyle} />
            </Touchable>
        );
    }
}