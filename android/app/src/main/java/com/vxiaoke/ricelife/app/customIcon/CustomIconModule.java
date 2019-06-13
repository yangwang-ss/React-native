package com.vxiaoke.ricelife.app.customIcon;

import android.content.ComponentName;
import android.content.pm.PackageManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class CustomIconModule extends ReactContextBaseJavaModule {
    private PackageManager mPm;
    private ComponentName mDouble11;
    private ComponentName mDouble12;

    public CustomIconModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @Override
    public String getName(){
        return "CustomIconModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    @ReactMethod
    public void cutIcon(String userId, Boolean enable){
        mDouble11 = new ComponentName(
                getReactApplicationContext(),
                "com.vxiaoke.ricelife.app.MainActivity");
        mDouble12 = new ComponentName(
                getReactApplicationContext(),
                "com.vxiaoke.ricelife.app.MainActivity"+userId);
        mPm = getReactApplicationContext().getPackageManager();
        if(enable) {
            enableComponent(mDouble12);
            disableComponent(mDouble11);
        } else {
            enableComponent(mDouble11);
            disableComponent(mDouble12);
        }

    }

    private void enableComponent(ComponentName componentName) {
        mPm.setComponentEnabledSetting(componentName,
                PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                PackageManager.DONT_KILL_APP);
    }

    private void disableComponent(ComponentName componentName) {
        mPm.setComponentEnabledSetting(componentName,
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP);
    }
}
