import * as nsApp from "tns-core-modules/application";
import { isIOS } from "tns-core-modules/platform/platform";

export const keepAwake = () => {
    if(isIOS){
        return new Promise(function (resolve, reject) {
            try {
                var app = UIApplication.sharedApplication;
                if (!app.idleTimerDisabled) {
                    app.idleTimerDisabled = true;
                }
                resolve();
            } catch (ex) {
                console.log("Error in keepAlive.keepAwake: " + ex);
                reject(ex);
            }
        });
    } else{
        var keepScreenOn = function () {
            var activity = nsApp.android.foregroundActivity || nsApp.android.startActivity;
            var window = activity.getWindow();
            window.addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        };

        return new Promise(function (resolve, reject) {
            try {

                if (nsApp.android.foregroundActivity || nsApp.android.startActivity) {
                    keepScreenOn();
                    resolve();
                } else {
                    nsApp.android.on("activityStarted", function (args) {
                        keepScreenOn();
                        resolve();
                    });
                }

            } catch (ex) {
                console.log("Error in keepAlive.keepAwake: " + ex);
                reject(ex);
            }
        });
    }
}

export const allowSleepAgain = () => {
    if(isIOS){
        return new Promise(function (resolve, reject) {
            try {
                var app = UIApplication.sharedApplication;
                if (app.idleTimerDisabled) {
                    app.idleTimerDisabled = false;
                }
                resolve();
            } catch (ex) {
                console.log("Error in keepAlive.allowSleepAgain: " + ex);
                reject(ex);
            }
        });
    } else{
        return new Promise(function (resolve, reject) {
            try {
              var activity = nsApp.android.foregroundActivity || nsApp.android.startActivity;
              var window = activity.getWindow();
              window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
              resolve();
            } catch (ex) {
              console.log("Error in keepAlive.allowSleepAgain: " + ex);
              reject(ex);
            }
          });
    }
}