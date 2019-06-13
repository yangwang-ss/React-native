package com.vxiaoke.ricelife.app;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.github.traviskn.rnuuidgenerator.RNUUIDGeneratorPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.levelasquez.androidopensettings.AndroidOpenSettingsPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.bridge.ReadableNativeMap;
import com.theweflex.react.WeChatPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.example.umenganaticlys.UmengAnalyticsPackage ;
import com.horcrux.svg.SvgPackage;
import com.vxiaoke.ricelife.app.customIcon.CustomIconPackage;
import com.vxiaoke.ricelife.app.qiniu.QiniuPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.tkporter.sendsms.SendSMSPackage;
import com.BV.LinearGradient.LinearGradientPackage;

import cn.jpush.reactnativejpush.JPushPackage;
import cn.reactnative.httpcache.HttpCachePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.rnfs.RNFSPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import com.daiyan.RNAlibcSdkPackage;
import com.reactlibrary.AlipayPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.umeng.analytics.MobclickAgent;
import com.umeng.commonsdk.UMConfigure;
import com.vxiaoke.ricelife.app.upgrade.UpgradePackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNUUIDGeneratorPackage(),
            new PickerPackage(),
            new AndroidOpenSettingsPackage(),
            new NetInfoPackage(),
            new RNFetchBlobPackage(),
            new WeChatPackage(),
            new RNCWebViewPackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new UmengAnalyticsPackage (),
            new SvgPackage(),
            new SplashScreenReactPackage(),
            SendSMSPackage.getInstance(),
            new LinearGradientPackage(),
            new HttpCachePackage(),
            new RNGestureHandlerPackage(),
            new RNFSPackage(),
            new FastImageViewPackage(),
            new RNDeviceInfo(),
            new JPushPackage(!BuildConfig.DEBUG, !BuildConfig.DEBUG),
            new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG, "http://116.62.112.198:3000"),
            new MPAndroidChartPackage(),
            new RNAlibcSdkPackage(),
            new AlipayPackage(),
            new UpgradePackage(),
              new CustomIconPackage(),
              new QiniuPackage()
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
    SoLoader.init(this, /* native exopackage */ false);
    UMConfigure.init(this, "5c1b7224f1f5568222000460", "Umeng", UMConfigure.DEVICE_TYPE_PHONE,
            "");
    MobclickAgent.openActivityDurationTrack(false);
    ReadableNativeArray.setUseNativeAccessor(true);
    ReadableNativeMap.setUseNativeAccessor(true);
  }
}
