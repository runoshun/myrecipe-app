import { ViewProperties } from "react-native";

import { FBABannerSizes } from "react-native-firebase";
import { createContainer } from "../createContainer";
import BannerView from "../components/BannerView";
import { StoreState } from "@root/store";
import { BannerProgressDialog } from "@root/views/components/Themed";

export interface BannerProperties extends ViewProperties {
    unitId: string,
    size?: FBABannerSizes,
}

const isBannerHidden = (state: StoreState) => {
    if (state.app.settings.accountType !== "free") {
        return true;
    }

    if (BannerProgressDialog.isVisible()) {
        return false;
    }

    let currentRoute = state.rootStackState.routes[state.rootStackState.index];
    if (currentRoute.routeName === "WebBrowser") {
        return true;
    }

    return false;
}

export default createContainer(BannerView)((state, _, ownProps: BannerProperties) => ({
    ...ownProps,
    hide: isBannerHidden(state),
}))