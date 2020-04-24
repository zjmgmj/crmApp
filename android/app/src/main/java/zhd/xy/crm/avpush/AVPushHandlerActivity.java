package zhd.xy.crm.avpush;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.annotation.Nullable;

import java.util.HashMap;
import java.util.Map;

public class AVPushHandlerActivity extends Activity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        processPush();
        finish();
        if (!AVPushModule.isActive()) relaunchActivity();
    }

    private void processPush() {
        try {
            Intent intent = getIntent();
            String action = intent.getAction();
            String channel = intent.getExtras().getString("com.avos.avoscloud.Channel");
            String data = intent.getExtras().getString("com.avos.avoscloud.Data");
            Map<String, String> map = new HashMap<String, String>();
            map.put("action", action);
            map.put("channel", channel);
            map.put("data", data);
            AVPushModule.onReceive(map); //todo：处理通知
        } catch (Exception e) {
            AVPushModule.onError(e); // todo：处理错误
        }
    }
    private void relaunchActivity() {
        PackageManager pm = getPackageManager();
        Intent launchIntent = pm.getLaunchIntentForPackage(getApplicationContext().getPackageName());
        startActivity(launchIntent);
    }
}
