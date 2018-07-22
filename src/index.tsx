import * as React from "react";
import { Provider } from "react-redux";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { PersistGate } from "redux-persist/integration/react";
import {
  View,
  ActivityIndicator,
  StatusBar,
  YellowBox,
  StyleSheet
} from "react-native";

import store from "./store";
import navigators from "@root/navigators";
import PopupRegistry from "@root/views/components/common/PopupRegistry";
import rn from "@root/utils/rn";
import Banner from "@root/views/containers/Banner";
import BackgroundTasks from "@root/views/containers/BackgroundTasks";
import admob from "@root/admob";

YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader"
]);

export default class App extends React.Component {
  private store: any;
  private persistor: any;

  componentWillMount() {
    admob.initialize();

    const { store: _store, persistor } = store.configure();
    this.store = _store;
    this.persistor = persistor;
  }

  render() {
    return (
      <Provider store={this.store}>
        <PersistGate persistor={this.persistor} loading={<ActivityIndicator />}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <PopupRegistry>
                <navigators.Main />
                <Banner unitId={admob.Ids.mainBanner} style={styles.banner} />
              </PopupRegistry>
            </View>
            <BackgroundTasks />
            {rn.os() === "ios" && <KeyboardSpacer />}
            {rn.os() === "ios" && <StatusBar barStyle="light-content" />}
          </View>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  banner: { paddingTop: 8, paddingBottom: 4, backgroundColor: "#999" }
});
