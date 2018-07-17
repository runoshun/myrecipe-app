import { ViewProperties } from "react-native";

import { createContainer } from "../createContainer";
import BannerView from "../components/BannerView";

export default createContainer(BannerView)((state, _, ownProps: ViewProperties) => ({
    ...ownProps,
    hide: state.app.settings.accountType !== "free",
}))