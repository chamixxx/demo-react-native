package com.gohidoc.cara;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.rnziparchive.RNZipArchivePackage;
import com.rnfs.RNFSPackage;
import com.horcrux.svg.SvgPackage;
import com.robinpowered.react.Intercom.IntercomPackage;
import com.zyu.ReactNativeWheelPickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.reactnative.camera.RNCameraPackage;
import com.kevinejohn.RNMixpanel.RNMixpanel;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import io.sentry.RNSentryPackage;
import io.realm.react.RealmReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import io.intercom.android.sdk.Intercom;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNZipArchivePackage(),
            new RNFSPackage(),
            new SvgPackage(),
            new IntercomPackage(),
            new ReactNativeWheelPickerPackage(),
            new RNFetchBlobPackage(),
            new RNCameraPackage(),
            new RNMixpanel(),
            new RNDeviceInfo(),
            new RNSentryPackage(MainApplication.this),
            new RealmReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    Intercom.initialize(this, "android_sdk-f0b57a861a5a8c9794108c1f39d0c8ce3f8a43ec", "quxcfcv5");
    Intercom.client().registerUnidentifiedUser(); // needed this early in order to pre-fetch custom colours for the messenger

    SoLoader.init(this, /* native exopackage */ false);
  }
}
