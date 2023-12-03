import * as React from "react";
import firebase, { FBAAdRequest, FBABannerProps, FBAInterstitial } from "react-native-firebase";
import { Ids } from "./admob-consts";
/*
export const Ids = {
  app: Platform.select({
    ios:     "xxxx",
    android: "xxxx"
  }),
  mainBanner: Platform.select({
    ios:     "xxxx",
    android: "xxxx"
  }),
  parseProgressBanner: Platform.select({
    ios:     "xxxx",
    android: "xxxx"
  })
};
*/


export type Interstitial = FBAInterstitial;

const admob = firebase.admob();

export const defaultAdRequest = new firebase.admob.AdRequest()
  .addTestDevice("0e938a4f4c5d8a7c832592d1eedba5b9")
  .build();

export const initialize = () => admob.initialize(Ids.app);
export const loadInterstitial = (id: string, request: FBAAdRequest = defaultAdRequest) => {
  let ad = admob.interstitial(id);
  ad.loadAd(request);
  return ad;
};

export const Banner = (props: FBABannerProps) =>  {
    return <firebase.admob.Banner request={defaultAdRequest} {...props} />
}

export default {
  initialize,
  loadInterstitial,
  Ids,
  defaultAdRequest,
  Banner,
};
