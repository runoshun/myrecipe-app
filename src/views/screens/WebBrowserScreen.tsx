import * as React from "react";
import { WebView, NavState, TextInput } from "react-native";

import KeepAwake from "react-native-keep-awake";

import res from "@root/resources";
import { Router, createAnchor } from "@root/navigators";
import { WebBrowser } from "@root/views/components/common";
import { createContainer } from "@root/views/createContainer";
import * as V from "@root/views/components/Themed";
import { AppDispatcher } from "@root/dispatchers";
import admob from "@root/admob";
import firebase from "react-native-firebase";

import Banner from "@root/views/containers/Banner";
import { ADD_RECIPES_FROM_PAGE_FAILED } from "@root/resources/errorCodes";

export interface WebBrowserScreenProperties {
    router: Router,
    app: AppDispatcher;
    keepAwakeWhileBrowse: boolean,
    parseIngredientsSuccessCount: number,
}

interface State {
    uri: string
}

interface Params {
    uri: string
}

const anchor = createAnchor<Params>("WebBrowser");

const buttonStyles = WebBrowser.defaultButtonStyles.applyVars({
    colorForeground: res.colors.accent
});

interface MessagePromise {
    resolve: (value: any) => void,
    reject: (value: any) => void,
    promise: Promise<any>
}

export class WebBrowserScreen extends React.Component<WebBrowserScreenProperties, State> {

    public static anchor = anchor;

    private reqCode: number = 0;
    private messages: { [reqCode: number]: MessagePromise } = {};

    constructor(props: any) {
        super(props);
        let uri = anchor.getParam(this.props, "uri");
        this.state = { uri: uri || "" };
    }

    private prepareMessage = (): number => {
        let p: MessagePromise = {} as any;
        p.promise = new Promise((res, rej) => {
            p.resolve = res;
            p.reject = rej
        })
        let reqCode = this.reqCode++;
        this.messages[reqCode] = p;
        return reqCode;
    }

    private waitMessage = (reqCode: number): Promise<any> => {
        return this.messages[reqCode].promise;
    }

    private onMessage = (e: any) => {
        try {
            let msg = JSON.parse(e.nativeEvent.data);
            if (msg.type === "success" && msg.reqCode !== undefined) {
                this.messages[msg.reqCode].resolve(msg.data);
            } else if (msg.reqCode) {
                this.messages[msg.reqCode].reject(msg.data);
            } else {
                console.warn("malformed message: " + e.nativeEvent.data);
            }
        } catch (err) {
            console.warn("can't handle message: " + e.nativeEvent.data, err);
        }
    }

    render() {
        return (
            <WebBrowser
                key="browser"
                source={{ uri: this.state.uri }}
                buttonStyles={buttonStyles}
                requestClose={() => this.props.router.back()}
                action1Icon="open-outline"
                action1Handler={this.openUrlDialog}
                action2Icon="attach-outline"
                action2Handler={this.openAddToRecipeDialog}
                onMessage={this.onMessage}
                injectedJavaScript={injectedJavascript}
                javaScriptEnabled={true}
                ScreenHeaderComponent={V.AppScreenHeader}
                />
        );
    }

    componentDidMount() {
        if (this.props.keepAwakeWhileBrowse) {
            KeepAwake.activate();
        }
    }

    componentWillUnmount() {
        KeepAwake.deactivate();
    }

    private openUrlDialog = () => {
        let url = "";
        V.ConfimationDialog.show({
            title: res.strings.webBrowserUrlDialogTitle(),
            content: <TextInput style={styles.values.dialogInput} onChangeText={text => { url = text }} />,
            onOk: () => this.setState({ uri: url })
        });
    }

    private openAddToRecipeDialog = (webview?: WebView, state?: NavState) => {
        V.ConfimationDialog.show({
            title: res.strings.webBrowserConfirmAddToRecipeDialogTitle(),
            message: res.strings.webBrowserConfirmAddToRecipeDialogMessage(),
            onOk: () => {
                let count = this.props.parseIngredientsSuccessCount;
                if (count > 10) {
                    this.openAddToRecipeProgress(webview, state)
                } else {
                    this.addToRecipe(webview, state).then(navigate => navigate());
                }
            },
        });
    }

    private openAddToRecipeProgress = async (webview?: WebView, state?: NavState) => {
        let banner = <Banner
            style={styles.values.progressBanner}
            unitId={admob.Ids.parseProgressBanner}
            size="MEDIUM_RECTANGLE" />;

        V.BannerProgressDialog.show({
            title: res.strings.webBrowserParseProgressDialogTitle(),
            content: banner,
            showIndicator: true,
        });

        await new Promise((res) => setTimeout(() => res(), 5000));
        let navigate = await this.addToRecipe(webview, state);

        V.BannerProgressDialog.show({
            title: "取得完了",
            content: banner,
            showIndicator: false,
            showOk: true,
            onOk: navigate,
        });
    }

    private addToRecipe = async (webview?: WebView, state?: NavState) => {
        if (webview && state) {

            let reqCode = this.prepareMessage();
            webview.injectJavaScript(addToRecipeJavascriptCode(reqCode));
            try {
                let data = await this.waitMessage(reqCode);
                return this.props.app.addRecipeFromWebPage(
                    state.title || "",
                    state.url || "",
                    data.photo,
                    data.html
                );
            } catch (e) {
                firebase.crashlytics().recordError(
                    ADD_RECIPES_FROM_PAGE_FAILED,
                    e.message || e.toString(),
                )
            }
        }
        return () => undefined;
    }
}

interface ImageElem { elem: HTMLElement, src: string };
const initWebview = () => {
    var originalPostMessage = window.postMessage;
    var patchedPostMessage = function(message: any, targetOrigin: any, transfer: any) {
        if (targetOrigin === "reactNative") {
            originalPostMessage(message, targetOrigin, transfer);
        }
    };
 
    patchedPostMessage.toString = () => {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    };
    window.postMessage = patchedPostMessage;

    var getAllImages = (): ImageElem[] => {
        const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i
        var backgroundImages: ImageElem[] = Array.from(
            Array.from(document.querySelectorAll('*'))
                .reduce((collection, node) => {
                    let prop = window.getComputedStyle(node, undefined)
                        .getPropertyValue('background-image')
                    // match `url(...)`
                    let match = srcChecker.exec(prop)
                    if (match) {
                        collection.add({ elem: node as HTMLElement, src: match[1] })
                    }
                    return collection
                }, new Set<{elem: HTMLElement, src: string}>())
        )

        var imageTags: ImageElem[] = Array.from(
            document.getElementsByTagName("img")
        ).map(i => ({ elem: i, src: i.getAttribute("src") || "" }));

        return imageTags.concat(backgroundImages);
    }

    var calcScore = (dim: { width: number, height: number, surface: number }, img: HTMLElement, renderScore = false): number => {
        var rect = img.getBoundingClientRect();
        var absTop = rect.top + window.pageYOffset;
        var absLeft = rect.left + window.pageXOffset;

        // too large image will be page background image
        if (rect.height >= dim.height * 0.5) {
            return -1;
        }
        // position at out of screen image is ignored
        if (absTop < 0 || absLeft < 0) {
            return -1;
        }

        var surface = Math.min(rect.width * rect.height / dim.surface * 5, 1);
        var top = Math.min((absTop / dim.height) * 3, 1);
        var left = (absLeft / dim.width) / 3;

        var score = surface - top - left;

        if (renderScore) {
            var e = document.createElement("div");
            e.innerHTML = score.toFixed(4);
            e.setAttribute("style", `position: absolute; left: ${absLeft}px; top: ${absTop}px; background-color: #00000030; color: #ffffff`);
            document.body.appendChild(e);
        }

        return score
    };

    var absUrl = (url: string) => {
        var a = document.createElement("a");
        a.href = url;
        return a.href;
    } 

    // avoid code mangling
    (window as any)["resolveLargestImage"] = () => {
        var bodyDim = {
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            surface: document.body.clientWidth * document.body.clientHeight
        };
        var images = getAllImages()
        var withScore = images.map(i => ({ elem: i, score: calcScore(bodyDim, i.elem) })).sort((a, b) => b.score - a.score);

        if (withScore.length === 0) {
            return undefined;
        } else {
            return absUrl(withScore[0].elem.src);
        }
    }
 };
const injectedJavascript = '(' + String(initWebview) + ')();';

const addToRecipe = (reqCode: number) => {
    try {
        var photo = (window as any)["resolveLargestImage"]();
        var html = document.body.innerHTML;
        if (photo || html) {
            var data = { photo, html };
            window.postMessage(JSON.stringify({ type: "success", data: data, reqCode: reqCode }), "reactNative");
        } else {
            window.postMessage(JSON.stringify({ type: "error", data: "no result", reqCode: reqCode }), "reactNative");
        }
    } catch (e) {
        window.postMessage(e.toString(), "reactNative");
    }
};
const addToRecipeJavascriptCode = (reqCode: number) => `(${String(addToRecipe)})(${reqCode});`

const styles = new V.Stylable({
    dialogInput: {
        margin: 8,
        backgroundColor: res.colors.lightGray,
        padding: 8,
    },
    progressBanner: {
        padding: 12,
    }
})

export default createContainer(WebBrowserScreen)((state, dispatch) => {
    return {
        router: new Router(dispatch),
        app: new AppDispatcher(dispatch),
        keepAwakeWhileBrowse: state.app.settings.keepAwakeWhileBrowse,
        parseIngredientsSuccessCount: state.app.settings.parseIngredientsSuccessCount,
    }
})