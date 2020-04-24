package zhd.xy.crm;

import android.app.Application;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import android.content.Context;
import android.support.multidex.MultiDex;
import com.avos.avoscloud.AVOSCloud;
import com.avos.avoscloud.PushService;
import com.beefe.picker.PickerViewPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.zmxv.RNSound.RNSoundPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import org.lovebing.reactnative.baidumap.BaiduMapPackage;
import zhd.xy.crm.avpush.AVPushPackage;

import java.util.Arrays;
import java.util.List;

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
                    new ExtraDimensionsPackage(),
                    new PickerViewPackage(),
                    new BaiduMapPackage(getApplicationContext()),
                    new AVPushPackage(),
                    new SplashScreenReactPackage(),
                    new RNSoundPackage()
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
        PushService.setDefaultChannelId(getApplicationContext(), "zhdcrmchannel");
        AVOSCloud.initialize(this, "1gJuzwa4VUs9JxVUjQGTFNLw-gzGzoHsz", "H9q5UVpG79STJ2NvhXuV9QhG");
        SoLoader.init(this, /* native exopackage */ false);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }
}
