package zhd.xy.crm.avpush;

import android.app.Activity;
import android.content.Intent;
import com.avos.avoscloud.AVException;
import com.avos.avoscloud.AVInstallation;
import com.avos.avoscloud.PushService;
import com.avos.avoscloud.SaveCallback;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;
import java.util.HashMap;
import java.util.Map;

public class AVPushModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static AVPushModule singleton;
    private static String ON_RECEIVE = "leancloudPushOnReceive";
    private static String ON_ERROR = "leancloudPushOnError";
    private static String ON_CUSTOM_RECEIVE = "leancloudPushOnCustomReceive";

    public AVPushModule(ReactApplicationContext reactContext) {
        super(reactContext);
        singleton = this;
        PushService.setDefaultPushCallback(getReactApplicationContext(), AVPushHandlerActivity.class);
    }

    protected static boolean isActive() {
        return singleton != null;
    }

    protected static void onCustomReceive(Map<String, String> map) {
        if (singleton != null) {
            WritableMap pushNotification = getWritableMap(map);
            DeviceEventManagerModule.RCTDeviceEventEmitter emitter = singleton.getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
            emitter.emit(ON_CUSTOM_RECEIVE, pushNotification);
        }
    }

    private static WritableMap getWritableMap(Map<String, String> map) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString("action", map.get("action"));
        writableMap.putString("channel", map.get("channel"));
        writableMap.putString("data", map.get("data"));
        return writableMap;
    }

    protected static void onReceive(Map<String, String> map) {
        if (singleton != null) {
            WritableMap pushNotification = getWritableMap(map);
            DeviceEventManagerModule.RCTDeviceEventEmitter emitter = singleton.getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
            emitter.emit(ON_RECEIVE, pushNotification);
        }
    }

    protected static void onError(Exception e) {
        if (singleton != null) {
            WritableMap error = Arguments.createMap();
            error.putString("message", e.getLocalizedMessage());
            DeviceEventManagerModule.RCTDeviceEventEmitter emitter = singleton.getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
            emitter.emit(ON_ERROR, error);
        }
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("ON_RECEIVE", ON_RECEIVE);
        constants.put("ON_ERROR", ON_ERROR);
        constants.put("ON_CUSTOM_RECEIVE", ON_CUSTOM_RECEIVE);
        return constants;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    @Override
    public String getName() {
        return "avPushMoudle";
    }

    @ReactMethod
    public void saveInstallation(final Callback resultCallBack) {
        AVInstallation.getCurrentInstallation().saveInBackground(new SaveCallback() {
            @Override
            public void done(AVException e) {
                if (e == null) {
                    String installationId = AVInstallation.getCurrentInstallation().getInstallationId();
                    resultCallBack.invoke(installationId);
                    ;
                } else {
                    resultCallBack.invoke(null, e);
                }
            }
        });
    }
}
