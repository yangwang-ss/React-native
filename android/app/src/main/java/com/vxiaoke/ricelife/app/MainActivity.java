package com.vxiaoke.ricelife.app;

import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;

import android.util.Log;
import cn.jpush.android.api.JPluginPlatformInterface;
import com.facebook.react.ReactActivity;
import com.tkporter.sendsms.SendSMSPackage;
import com.umeng.analytics.MobclickAgent;

import org.devio.rn.splashscreen.SplashScreen;

import cn.jpush.android.api.JPushInterface;

public class MainActivity extends ReactActivity {
    private JPluginPlatformInterface pHuaweiPushInterface;
    private PackageManager mPm;
    private ComponentName mDouble11;
    private ComponentName mDouble12;
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "vxk_mili_app";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, true);
        super.onCreate(savedInstanceState);
        JPushInterface.init(this);
        pHuaweiPushInterface = new JPluginPlatformInterface(this.getApplicationContext());
    }

    @Override
    public void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
        JPushInterface.onResume(this);
    }

    @Override
    public void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
        JPushInterface.onPause(this);
    }

    @Override
    public void onStart() {
        super.onStart();
        pHuaweiPushInterface.onStart(this);
    }

    @Override
    public void onStop() {
        super.onStop();
        pHuaweiPushInterface.onStop(this);
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        //probably some other stuff here
        SendSMSPackage.getInstance().onActivityResult(requestCode, resultCode, data);
        if(requestCode == JPluginPlatformInterface.JPLUGIN_REQUEST_CODE) {
            pHuaweiPushInterface.onActivityResult(this, requestCode, resultCode, data);
        }
    }
}
