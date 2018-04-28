import * as React from "react";

import res from "@root/resources";
import { Router, createAnchor } from "@root/navigators";
import { WebBrowser } from "@root/views/components/common";
import { createContainer } from "@root/views/createContainer";

export interface WebBrowserScreenProperties {
    router: Router;
}

interface State {
}

interface Params {
    uri: string
}

const anchor = createAnchor<Params>("WebBrowser");

const buttonStyles = WebBrowser.defaultButtonStyles.applyVars({
    colorForeground: res.colors.accent
});

export class WebBrowserScreen extends React.Component<WebBrowserScreenProperties, State> {

    public static anchor = anchor;

    render() {
        let uri = anchor.getParam(this.props, "uri");
        return (
            <WebBrowser
                source={{ uri: uri }}
                buttonStyles={buttonStyles}
                requestClose={() => this.props.router.back()}
                 />
        );
    }
}

export default createContainer(WebBrowserScreen)((_state, dispatch) => {
    return {
        router: new Router(dispatch),
    }
})