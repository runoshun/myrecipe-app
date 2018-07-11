import * as React from "react";
import { View, ViewProperties } from "react-native";

import firebase from "react-native-firebase";
const Banner = (firebase as any).admob.Banner;
const AdRequest = (firebase as any).admob.AdRequest;
const req = new AdRequest()
  .addTestDevice("0e938a4f4c5d8a7c832592d1eedba5b9")
  .build();

export interface BannerViewProperties extends ViewProperties {
  hide?: boolean;
}

export const BannerView: React.StatelessComponent<BannerViewProperties> = props => {
  let { hide, children, ...viewProps } = props;
  if (hide) {
      return null;
  }

  return (
    <View {...viewProps}>
      <Banner unitId="ca-app-pub-5911972503110852/6352403557" request={req} />
    </View>
  );
};

export default BannerView;
