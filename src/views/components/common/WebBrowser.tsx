import * as React from "react";
import { View, WebViewProperties, Text, WebView, NavState, ActivityIndicator } from "react-native";

import { Screen } from "./Screen";
import ScreenHeader from "./ScreenHeader";
import { HBox } from "./Layouts";
import Button from "./Button";
import Stylable from "@root/views/components/common/stylable";

export interface WebBrowserProperties extends WebViewProperties {
    requestClose: () => void
    buttonStyles?: typeof Button.defaultStyles,
    styles?: typeof defaultStyles,
    action1Icon?: string,
    action1Handler?: (webView?: WebView, state?: NavState) => void,
    action2Icon?: string,
    action2Handler?: (webView?: WebView, state?: NavState) => void,
}

interface State {
    canGoBack?: boolean,
    canGoForword?: boolean,
    title?: string,
    url?: string,
}

const defaultButtonStyles = Button.defaultStyles.applyVars({
    iconSize: 28,
    colorForeground: "#000",
    colorBackground: "transparent",
    marginUnit: 8,
})

const defaultStyles = new Stylable({
    TUI_WebBrowser_Title: {
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 48,
    },
    TUI_WebBrowser_WebView: {
        marginBottom: 40,
    },
    TUI_WebBrowser_ControlBar: {
        zIndex: 1000,
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#f7f7f7",
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
    TUI_WebBrowser_LoadingIndicator: {
        position: "absolute",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        alignSelf: "center"
    }
})

export default class WebBrowser extends React.Component<WebBrowserProperties, State> {

    public static defaultStyles = defaultStyles;
    public static defaultButtonStyles = defaultButtonStyles;

    private webView?: WebView = undefined;
    private bindWebView = (webView: any) => this.webView = webView;

    constructor(props: WebBrowserProperties) {
        super(props);
        this.state = { 
        }
    }

    render() {
        let { requestClose, buttonStyles: _b, children,
            action1Icon, action1Handler, action2Icon, action2Handler,
             ...rest } = this.props;
        let buttonStyles = _b || defaultButtonStyles;
        let styles = this.props.styles || defaultStyles;

        let action1Button, action2Button;
        if (action1Icon) {
            action1Button = <Button styles={buttonStyles} icon={action1Icon} onPress={this.handleCustomAction(action1Handler)} />
        } else {
            action1Button = <View />
        }

        if (action2Icon) {
            action2Button = <Button styles={buttonStyles} icon={action2Icon} onPress={this.handleCustomAction(action2Handler)} />
        } else {
            action2Button = <View />
        }

        return (
            <Screen>
                <ScreenHeader
                    renderLeft={() => <Button icon="close" onPress={requestClose} styles={buttonStyles}/>}
                    renderCenter={() => 
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.values.TUI_WebBrowser_Title}>
                            {this.state.title}
                        </Text>
                    }
                    renderRight={() => <Button icon="refresh" onPress={this.handleRefresh} styles={buttonStyles} />}/>
                <WebView
                    style={styles.values.TUI_WebBrowser_WebView}
                    ref={this.bindWebView}
                    {...rest}
                    onNavigationStateChange={this.handleNavigationStateChange}
                    renderLoading={() => <ActivityIndicator style={styles.values.TUI_WebBrowser_LoadingIndicator} />}
                    startInLoadingState
                    />
                <HBox style={styles.values.TUI_WebBrowser_ControlBar} justifyContent="space-around" >
                    <Button styles={buttonStyles} icon="arrow-back" disabled={!this.canGoBack} onPress={this.handleGoBack} />
                    <Button styles={buttonStyles} icon="arrow-forward" disabled={!this.canGoForword} onPress={this.handleGoForword} />
                    {action1Button}
                    {action2Button}
                </HBox>
            </Screen>
        );
    }

    private get canGoBack(): boolean {
        return (this.state.canGoBack === true);
    }

    private get canGoForword(): boolean {
        return (this.state.canGoForword === true);
    }

    private handleNavigationStateChange = (event: NavState) => {
        if (this.state.canGoBack !== event.canGoBack ||
            this.state.canGoForword != event.canGoForward ||
            this.state.title !== event.title ||
            this.state.url !== event.url) 
        {
            this.setState({ canGoBack: event.canGoBack, canGoForword: event.canGoForward, title: event.title, url: event.url })
        }
        if (this.props.onNavigationStateChange) {
            this.props.onNavigationStateChange(event);
        }
    }

    private handleGoBack = () => {
        this.webView && this.canGoBack && this.webView.goBack();
    }

    private handleGoForword = () => {
        this.webView && this.canGoForword && this.webView.goForward();
    }

    private handleRefresh = () => {
        this.webView && this.webView.reload()
    }

    private handleCustomAction = (handler?: (webView?: WebView, state?: NavState) => void) => {
        return handler && (() => handler(this.webView, this.state as any))
    }

}