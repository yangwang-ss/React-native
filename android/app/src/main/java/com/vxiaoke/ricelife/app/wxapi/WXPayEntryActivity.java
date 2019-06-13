package com.vxiaoke.ricelife.app.wxapi;           // 这里改为你的包名

import android.app.Activity;
import android.os.Bundle;

import com.theweflex.react.WeChatModule;

public class WXPayEntryActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WeChatModule.handleIntent(getIntent());
        finish();
    }
}
