export default class Config {
    static title: string = "京东小助手";
    static version: string = "v0.3.5";
    static author: string = "krapnik";
    static edit: string = "smiley";

    static timingFlag: boolean = false;
    static UAFlag: boolean = false;
    static locationHref: string = window.location.href;
    static localeTime: string = "";
    static intervalId: number = 0;
    static intervalSpan: number = 500;
    static timeoutSpan: number = 1500;

    static retryCount: number = 1;
    static residueCount: number = 1;
    static taskCount: number = 0;
    static taskProgress: number = 0;
    static autoEveryDay: boolean = false;

    static JDAppUA: string = "jdapp;android;8.4.2;8.0.0;;network/wifi;model/Mi Note 2;osVer/26;appBuild/71043;psn/|7;psq/1;uid/;adk/;ads/;pap/JA2015_311210|8.4.2|ANDROID 8.0.0;osv/8.0.0;pv/2.23;jdv/;ref/com.jingdong.app.mall.WebActivity;partner/huawei;apprpd/Home_Main;Mozilla/5.0 (Linux; Android 8.0.0; Mi Note 2 Build/OPR1.170623.032; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.99 Mobile Safari/537.36";
    static JDUserInfoURL: string = "https://wq.jd.com/user/info/QueryJDUserInfo?sceneid=11110&sceneval=2&g_login_type=1";
    static JDTimeInfoURL: string = "https://api.m.jd.com/client.action?functionId=babelActivityGetShareInfo&client=wh5";
}