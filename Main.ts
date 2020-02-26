import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Coupon from "./interface/Coupon";
import Activity from "./interface/Activity";
import Game from "./interface/Game";
import Goods from "./goods/goods";

import Utils, { _$ } from "./utils/utils";
import Config from "./config/config";

import BabelAwardCollection from "./coupons/newBabelAwardCollection";
import WhiteCoupon from "./coupons/whtieCoupon";
import Purchase from "./coupons/purchase";
import ReceiveDayCoupon from "./coupons/receiveDayCoupon";
import SecKillCoupon from "./coupons/secKillCoupon";
import Mfreecoupon from "./coupons/mfreecoupon";
import CoinPurchase from "./coupons/coinPurchase";
import GcConvert from "./coupons/gcConvert";
import ReceiveCoupons from "./coupons/receiveCoupons";
import ReceiveCoupon from "./coupons/receiveCoupon";
import GetCouponCenter from "./coupons/getCouponCenter";
import Exchange from "./coupons/exchange";

import MonsterNian from "./activitys/monsterNian";
import BrandCitySpring from "./activitys/brandCitySpring";
import Palace from "./activitys/palace";
import ReceiveBless from "./activitys/receiveBless";

import Cloudpig from "./game/cloudpig";
import JdJoy from "./game/jdjoy";

import { activityType } from "./enum/activityType";
import { couponType } from "./enum/couponType";
import { goodsType } from "./enum/goodsType";
import { gameType } from "./enum/gameType";
import CookieManager from "./cookie/CookieManager";
import { CookieHandler } from "./cookie/CookieHandler";

let coupon: Coupon,
    goods: Goods,
    game: Game,
    activity: Activity;

const container: HTMLDivElement = document.createElement("div"),
    title: HTMLDivElement = document.createElement("div"),
    timerTittleDiv: HTMLDivElement = document.createElement("div"),
    timerTextInput: HTMLInputElement = document.createElement("input"),
    receiveTextInput: HTMLInputElement = document.createElement("input"),
    receiveCountInput: HTMLInputElement = document.createElement("input"),
    spanTextInput: HTMLInputElement = document.createElement("input"),
    receiveTimerBtn: HTMLButtonElement = document.createElement("button"),
    outputTextArea: HTMLTextAreaElement = document.createElement("textarea"),
    loginMsgDiv: HTMLDivElement = document.createElement("div");

let getLoginMsg = function (res: any) {
    if (res.base.nickname) {
        loginMsgDiv.innerHTML = "当前登录京东帐号：" + res.base.nickname;
    }
}, krapnik = function (res: any) {
};


function buildOperate() {
    const operateAreaDiv: HTMLDivElement = document.createElement("div");
    if (coupon) {
        const receiveDiv: HTMLDivElement = document.createElement("div"),
            receiveAreaDiv: HTMLDivElement = document.createElement("div"),
            receiveTipsDiv: HTMLDivElement = document.createElement("div"),
            receiveAllBtn: HTMLButtonElement = document.createElement("button"),
            timerResetBtn: HTMLButtonElement = document.createElement("button"),
            //spanResetBtn: HTMLButtonElement = document.createElement("button"),
            timerDiv: HTMLDivElement = document.createElement("div");
        operateAreaDiv.setAttribute("style", "border: 1px solid #000;");
        operateAreaDiv.innerHTML = "<h3 style='border-bottom: 1px solid #2196F3;display: inline-block;margin: 5px;padding: 0 37.5vw 5px;'>操作区</h3>";
        timerTextInput.type = "text";
        timerTextInput.placeholder = "请输入获取时间的刷新频率【毫秒】";
        timerTextInput.setAttribute("style", "width:80vw;height: 25px;border: solid 1px #000;border-radius: 5px;margin: 10px auto;display: block;");
        timerResetBtn.innerHTML = "重置刷新频率";
        timerResetBtn.setAttribute("style", "width: 120px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;");
        timerResetBtn.addEventListener("click", () => {
            const span = Math.trunc(+timerTextInput.value);
            if (!span) {
                alert("请检查输入的刷新频率是否有误！(只能为大于0的数字)");
                return false;
            }
            Config.intervalSpan = span;
            window.clearInterval(Config.intervalId);
            Config.intervalId = window.setInterval(getTime, Config.intervalSpan);
        });
        receiveTipsDiv.innerHTML = `<h3>定时时间使用年月日+24小时制</h3><p style="color:red">零点领券设置参考<br>刷新频率:500 | 定时时间：2020-01-01 23:59:59:490<br>tips:部分券其实是提前发放的</p>`;
        receiveTextInput.type = "text";
        receiveTextInput.placeholder = "定时领券时间【格式:2020-01-01 09:59:59:950】";
        receiveTextInput.setAttribute("style", "width:80vw;height: 25px;border: solid 1px #000;border-radius: 5px;margin: 10px;");
        receiveCountInput.type = "text";
        receiveCountInput.placeholder = "领券提交次数【默认：1次】";
        receiveCountInput.setAttribute("style", "width:80vw;height: 25px;border: solid 1px #000;border-radius: 5px;margin: 10px;");
        spanTextInput.type = "text";
        spanTextInput.placeholder = "请输入重复领券的提交频率【默认：500毫秒】";
        spanTextInput.setAttribute("style", "width:80vw;height: 25px;border: solid 1px #000;border-radius: 5px;margin: 10px auto;display: block;");
        receiveTimerBtn.innerHTML = "定时指定领取";
        receiveTimerBtn.addEventListener("click", () => {
            const span = Math.trunc(+spanTextInput.value);
            if (!span) {
                alert("请检查输入的提交频率是否有误！(只能为大于0的数字)");
                return false;
            }
            const reg = /^[1-9]\d*$/;
            const time = Utils.formateTime(receiveTextInput.value);
            switch (true) {
                case !time || time < 0:
                    alert("请检查定时领券时间的格式是否有误！");
                    return false;
                case !receiveCountInput.value || !reg.test(receiveCountInput.value):
                    alert("请检查重试次数是否为正整数！");
                    return false;
                default:
                    Config.postSpan = span;
                    Config.postCount = parseInt(receiveCountInput.value) > 0 ? parseInt(receiveCountInput.value) : 1;
                    Config.timingFlag = !Config.timingFlag;
                    Config.startTime = time;
                    outputTextArea.style.display = "block";
                    timerTextInput.disabled = Config.timingFlag;
                    receiveTextInput.disabled = Config.timingFlag;
                    receiveCountInput.disabled = Config.timingFlag;
                    spanTextInput.disabled = Config.timingFlag;
                    if (Config.timingFlag) {
                        receiveTimerBtn.innerHTML = "取消定时领取";
                        Utils.outPutLog(outputTextArea, `已开启定时领取！定时领取时间：${receiveTextInput.value}`);
                    } else {
                        receiveTimerBtn.innerHTML = "定时指定领取";
                        Utils.outPutLog(outputTextArea, `已关闭定时领取`);
                    }
                    break;
            }
        });
        receiveAllBtn.addEventListener("click", () => {
            if (coupon) {
                coupon.send(outputTextArea);
            }
        });
        receiveTimerBtn.setAttribute("style", "width: 120px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px;");
        receiveAllBtn.innerHTML = "一键指定领取";
        receiveAllBtn.setAttribute("style", "width: 120px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px;");
        outputTextArea.setAttribute("style", "width: 90vw;height: 40vw;border: 1px solid #868686;border-radius: 10px;overflow-y: scroll;margin:5px auto;display:none;font-size: 13px;");
        outputTextArea.setAttribute("disabled", "disabled");
        operateAreaDiv.append(timerDiv);
        timerDiv.append(timerTittleDiv);
        timerDiv.append(timerTextInput);
        timerDiv.append(timerResetBtn);
        timerDiv.append(spanTextInput);
        //timerDiv.append(spanResetBtn);
        operateAreaDiv.append(receiveDiv);
        receiveDiv.append(receiveTipsDiv);
        receiveDiv.append(receiveTextInput);
        receiveDiv.append(receiveCountInput);
        receiveDiv.append(spanTextInput);
        receiveDiv.append(receiveAreaDiv);
        receiveAreaDiv.append(receiveAllBtn);
        receiveAreaDiv.append(receiveTimerBtn);
    } else {
        outputTextArea.setAttribute("style", "width: 90vw;height: 40vw;border: 1px solid #868686;border-radius: 10px;overflow-y: scroll;margin:5px auto;font-size: 13px;");
        outputTextArea.setAttribute("disabled", "disabled");
    }
    loginMsgDiv.innerHTML = "当前京东帐号：<a href='https://plogin.m.jd.com/login/login' target='_blank'>点击登录</a>";
    operateAreaDiv.append(loginMsgDiv);
    container.append(operateAreaDiv);
    operateAreaDiv.append(outputTextArea);
}

function buildTips() {
    const tips = document.createElement('h4');
    tips.innerHTML = '<h4>页面地址暂未被扩展或者有误！</h4><p>本插件只能在指定活动地址或领券地址使用！</p><p>如果这是个活动地址或领券地址，<a href="tencent://message/?uin=708873725Menu=yes" target="_blank" title="发起QQ聊天">联系作者</a>扩展~</p><a style="color:red" href="https://gitee.com/krapnik/res/raw/master/tutorial.mp4" target="_blank">点击下载教程视频</a>'
    title.append(tips);
}

function buildTitle() {
    const html: HTMLElement = _$('html') as HTMLElement;
    html.style.fontSize = "18px";
    document.body.innerHTML = "";
    document.body.style.overflow = "scroll";
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.textAlign = "center";
    document.body.style.maxWidth = "100vw";
    container.setAttribute("style", "border: 1px solid #000;padding: 5px;margin: 5px;");
    title.innerHTML = `<h1 style="font-weight:700">${Config.title} ${Config.version}</h1>
                        <h3>author:${Config.author}</h3>
                        <h3>edit:${Config.edit}</h3>
                        <div style="display: flex;flex-direction: row;justify-content: center;">
                        <iframe src="https://ghbtns.com/github-btn.html?user=krapnikkk&repo=JDCouponAssistant&type=star&count=true" frameborder="0" scrolling="0" width="90px" height="21px"></iframe>
                        <a href="tencent://message/?uin=708873725Menu=yes" target="_blank" title="发起QQ聊天"><img src="http://bizapp.qq.com/webimg/01_online.gif" alt="QQ" style="margin:0px;"></a>
                        </div>
                        <button style="font-size:18px;font-weight:bold;color:#000;position:relative;width: 200px;height:6.8vh;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;display:block">
                            把按钮拖动到书签栏
                            <a style="font-size:0px;width:200px;height:30px;display:inline-block;position:absolute;left:0;top:0;" href="javascript: (function(a, b, c, d) { if(!a[c]){ d = b.createElement('script'), d.id = 'krapnik', d.setAttribute('charset', 'utf-8'), d.src = 'https://gitee.com/SmileyFace/codes/2dqko35bml7xhcsjf1wv646/raw?blob_name=gistfile1.txt', b.body.appendChild(d) } } )(window, document, 'krapnik');">
                                京东领券助手
                            </a>
                        </button>`;
    container.append(title);
    document.body.append(container);
}

function buildActivity() {
    //const activityArea: HTMLDivElement = document.createElement("div");
    //activityArea.setAttribute("style", "border: 1px solid #000;margin:10px");
    //activityArea.innerHTML = `<h3 style='border-bottom: 1px solid #2196F3;display: inline-block;margin: 5px;'>活动推荐</h3>
    //<p style="color:red;font-weight:bold;"><a style="color:red" href="https://bunearth.m.jd.com/babelDiy/Zeus/4PWgqmrFHunn8C38mJA712fufguU/index.html#/wxhome" target="_blank">全民炸年兽</a></p>
    //<p style="color:red;font-weight:bold;"><a style="color:red" href="https://bunearth.m.jd.com/babelDiy/Zeus/w6y8PYbzhgHJc8Lu1weihPReR2T/index.html#/home" target="_blank">十二生肖来送福</a></p>
    //<p style="color:red;font-weight:bold;"><a style="color:red" href="https://jdjoy.jd.com/pet/index/" target="_blank">宠汪汪</a></p>`;
    ////<p style="color:red;font-weight:bold;"> <a style="color:red" href = "https://palace.m.jd.com/" target = "_blank" > 逛超市集瑞兽 </a></p>
    //container.append(activityArea);
}

function buildGame() {
    const activityArea: HTMLDivElement = document.createElement("div");
    activityArea.setAttribute("style", "border: 1px solid #000;margin:10px");
    activityArea.innerHTML = `<h3 style='border-bottom: 1px solid #2196F3;display: inline-block;margin: 5px;'>游戏推荐</h3>
    <p style="color:red;font-weight:bold;"><a style="color:red" href="https://jdjoy.jd.com/pet/index" target="_blank">宠汪汪</a></p>
    <p style="color:red;font-weight:bold;" > <a style="color:red" href ="https://u1.jr.jd.com/uc-fe-wxgrowing/cloudpig/index" target="_blank">养猪猪</a></p>`;
    container.append(activityArea);
}

function buildRecommend() {
    const recommandArea: HTMLDivElement = document.createElement("div");
    recommandArea.setAttribute("style", "border: 1px solid #000;margin:10px");
    recommandArea.innerHTML = `<h3 style='border-bottom: 1px solid #2196F3;display: inline-block;margin: 5px;'>好券推荐</h3>
    <p style="color:red;font-weight:bold;">
    <a style="color:red" href="https://m.jr.jd.com/member/9GcConvert/?channel=01-shouye-191214" target="_blank">9金币抢兑</a>
    <br><a style="color:red" href="https://m.jr.jd.com/member/rightsCenter/#/white" target="_blank">12期免息券</a>
    </p>`;
    container.append(recommandArea);
}

function buildPromotion() {
    const promotionArea: HTMLDivElement = document.createElement("div");
    promotionArea.setAttribute("style", "border: 1px solid #000;margin:10px");
    promotionArea.innerHTML = `<h3 style='border-bottom: 1px solid #2196F3;display: inline-block;margin: 5px;'>推广区</h3>
    <p style="color:red;font-weight:bold;"><a style="color:red" href="http://krapnik.cn/project/jd/dayTask.html" target="_blank">每日京东红包汇总</a></p>`;
    container.append(promotionArea);
}

function buildUAarea() {
    let UATipsDiv: HTMLDivElement = document.createElement("div");
    UATipsDiv.innerHTML = `<div style="border: 1px solid #000;margin:10px;font-weight:bold"><h2>该活动需要设置user-Agent为京东APP</h2><p><a style="color:red" href="https://gitee.com/krapnik/res/raw/master/tutorial.mp4" target="_blank">点击下载教程视频</a></p><p>部分浏览器插件会覆盖UA设置，请自行排查并关闭</p><p>【比如：京价保】</p><button style="width: 200px;height:30px;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;display:block" onclick=Utils.copyText(Config.JDAppUA)>点击一键复制User-Agent</button></div>`;
    container.append(UATipsDiv);
}

function buildSensorArea() {
    let sensorArea: HTMLDivElement = document.createElement("div");
    sensorArea.innerHTML = `<div style="border: 1px solid #000;margin:10px;font-weight:bold"><h3 style='border-bottom: 1px solid #2196F3;display: inline-block;margin: 5px;'>高级操作区</h3><p>ck格式：备注----ck</p>
    <button style="width: 120px;height:6.8vh;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;display:block;font-size:16px" onclick="Utils.copyText(document.cookie)">复制Cookie</button>
    <button  id="import" style="width: 120px;height:6.8vh;background-color: #2196F3;border-radius: 5px;border: 0;color:#fff;margin:5px auto;display:block;font-size:16px">配置多帐号</button></div>`;
    container.append(sensorArea);
    _$("#import").addEventListener('click', () => {
        Utils.importFile("text/plain").then(async (ck) => {
            Config.multiFlag = false;
            Config.importFlag = false;
            CookieManager.parseCK(<string>ck);
            if (Config.importFlag) {
                CookieManager.outPutLog(outputTextArea);
                Promise.all(
                    CookieManager.cookieArr.map((item) => {
                        return CookieManager.checkLogin(outputTextArea, item);
                    })
                ).then((data) => {
                    if (data.every((res) => {
                        return res;
                    })) {
                        Utils.outPutLog(outputTextArea, "所有ck校验成功，开启多账号模式成功!");
                        Config.multiFlag = true;
                    } else {
                        CookieHandler.clearAllCookie();
                        Utils.outPutLog(outputTextArea, "部分ck校验失败,开启多账号模式失败!请检查ck有效性!");
                    }

                })
            }

        });
    })
}

function buildTimeoutArea() {
    let timeoutDiv: HTMLDivElement = document.createElement("div"),
        timeoutInput: HTMLInputElement = document.createElement("input");
    timeoutInput.setAttribute("style", "width:80vw;height: 25px;font-size:14px;border: solid 1px #000;border-radius: 5px;margin: 10px auto;display: block;");
    timeoutInput.placeholder = `请输入任务的提交间隔时间【默认:${Config.timeoutSpan}毫秒】`;
    timeoutDiv.innerHTML = `<p style="font-size:14px;">任务提交时间将会在设置提交间隔时间的基础上随机增加300~500毫秒</p>`;
    timeoutDiv.append(timeoutInput);
    timeoutInput.onchange = () => {
        if (Utils.isNumber(+timeoutInput!.value)) {
            Config.timeoutSpan = +timeoutInput!.value || 1500;
        }
    }
    container.append(timeoutDiv);
}

function getEntryType(): couponType | activityType | goodsType | gameType {
    let type: couponType | activityType | goodsType | gameType = couponType.none;
    if (!window.location.host.includes("jd.com")) {
        return type;
    }

    if (Config.locationHref.includes("item.jd.com/") || Config.locationHref.includes("item.m.jd.com/product/")) {
        type = goodsType.goods;
    }

    if ((window as any).__react_data__) {
        type = couponType.newBabelAwardCollection;
    } else if ((window as any).Queries) {
        type = couponType.whiteCoupon;
    } else if (Config.locationHref.includes('gcmall/index.html#/details?pid=')) {
        type = couponType.purchase;
    } else if (Config.locationHref.includes('member/gcmall/index.html#/details?gid')) {
        type = couponType.coinPurchase;
    } else if (Config.locationHref.includes("plus.m.jd.com/coupon/")) {
        type = couponType.receiveDayCoupon
    } else if (Config.locationHref.includes("9GcConvert")) {
        type = couponType.GcConvert
    } else if ((/babelDiy\/(\S*)\/index/).test(Config.locationHref)) {
        type = couponType.secKillCoupon
    } else if (/coupons\/show.action\?key=(\S*)&roleId=(\S*)/.test(Config.locationHref)) {
        type = couponType.mfreecoupon
    } else if (Config.locationHref.includes("4PN6NLSX1vyp8xibC5sk7WZEFF5U")) {
        type = couponType.secKillCoupon
    } else if (Config.locationHref.includes("m.jr.jd.com/member/rightsCenter/#/white")) {
        type = couponType.ReceiveCoupons
    } else if (Config.locationHref.includes("m.jr.jd.com/consumer/baitiaom/index.html")) {
        type = couponType.ReceiveCoupon
    } else if (Config.locationHref.includes("coupon.m.jd.com/center/getCouponCenter.action")) {
        type = couponType.getCouponCenter
    } else if (Config.locationHref.includes("vip.m.jd.com/index.html?appName=fuli&id=")) {
        type = couponType.exchange
    }

    if (Config.locationHref.includes("bunearth.m.jd.com")) {
        if (Config.locationHref.includes("4PWgqmrFHunn8C38mJA712fufguU")) {
            type = activityType.monsterNian;
        } else if (Config.locationHref.includes("w6y8PYbzhgHJc8Lu1weihPReR2T")) {
            type = activityType.brandCitySpring;
        } else if (Config.locationHref.includes("21tFbS6Xm4tpon3oJnwzbnCJBo1Z")) {
            type = activityType.receiveBless;
        }
    }
    if (Config.locationHref.includes("palace")) {
        type = activityType.palace;
    }

    if (Config.locationHref.includes("uc-fe-wxgrowing")) {
        if (Config.locationHref.includes("moneytree")) {
            // type = gameType.moneytree;
        } else if (Config.locationHref.includes("cloudpig")) {
            type = gameType.cloudpig;
        }
    }

    if (Config.locationHref.includes("jdjoy")) {
        type = gameType.jdjoy;
    }
    return type;
}

function getEntryDesc(type: couponType | activityType | goodsType | gameType) {
    buildTitle();
    buildPromotion();
    buildGame();
    switch (type) {
        case goodsType.goods:
            const goodsId = Config.locationHref.match(/jd.com\/(\S*).html/)![1];
            goods = new Goods(container, outputTextArea, goodsId);
            break;
        case couponType.newBabelAwardCollection:
            const activityId = Config.locationHref.match(/active\/(\S*)\/index/)![1];
            coupon = new BabelAwardCollection({ "activityId": activityId }, container, outputTextArea);
            break;
        case couponType.whiteCoupon:
            const couponBusinessId = Utils.GetQueryString("couponBusinessId");
            coupon = new WhiteCoupon({ "couponBusinessId": couponBusinessId }, container, outputTextArea);
            break;
        case couponType.purchase:
            const pid = Utils.GetQueryString("pid");
            coupon = new Purchase({ "pid": pid }, container, outputTextArea);
            break;
        case couponType.coinPurchase:
            const gid = Utils.GetQueryString("gid");
            coupon = new CoinPurchase({ "pid": gid }, container, outputTextArea);
            break;
        case couponType.receiveDayCoupon:
            coupon = new ReceiveDayCoupon(null, container, outputTextArea);
            break;
        case couponType.secKillCoupon:
            coupon = new SecKillCoupon(null, container, outputTextArea);
            break;
        case couponType.GcConvert:
            coupon = new GcConvert(null, container, outputTextArea);
            break;
        case couponType.mfreecoupon:
            const roleId = Utils.GetQueryString("roleId"),
                key = Utils.GetQueryString("key");
            coupon = new Mfreecoupon({ "roleId": roleId, "key": key }, container, outputTextArea);
            break;
        case couponType.ReceiveCoupons:
            coupon = new ReceiveCoupons(null, container, outputTextArea);
            break;
        case couponType.ReceiveCoupon:
            coupon = new ReceiveCoupon(null, container, outputTextArea);
            break;
        case couponType.getCouponCenter:
            coupon = new GetCouponCenter(null, container, outputTextArea);
            break;
        case couponType.exchange:
            const itemId = Utils.GetQueryString("id");
            coupon = new Exchange({ "itemId": itemId }, container, outputTextArea);
            break;
        case activityType.monsterNian:
            activity = new MonsterNian(null, container, outputTextArea);
            Config.UAFlag = true;
            break;
        case activityType.brandCitySpring:
            activity = new BrandCitySpring(null, container, outputTextArea);
            break;
        case activityType.palace:
            activity = new Palace(null, container, outputTextArea);
            break;
        case activityType.receiveBless:
            activity = new ReceiveBless(null, container, outputTextArea);
            Config.UAFlag = true;
            break;
        case gameType.cloudpig:
            game = new Cloudpig(null, container, outputTextArea);
            break;
        case gameType.jdjoy:
            game = new JdJoy(null, container, outputTextArea);
            break;
        default:
            break;
    }
    if (Config.UAFlag) {
        buildUAarea();
    }
    buildRecommend();
    buildActivity();
    if (coupon) {
        Config.intervalId = window.setInterval(getTime, Config.intervalSpan);
        // buildSensorArea();
        buildOperate();
        coupon.get();
    } else if (activity) {
        // buildSensorArea();
        // buildActivity();
        buildOperate();
        buildTimeoutArea();
        activity.get();
    } else if (goods) {
        goods.get();
    } else if (game) {
        buildSensorArea();
        buildOperate();
        if (type != gameType.jdjoy) {
            buildTimeoutArea();
        }
        game.get();
    } else {
        Utils.loadCss("https://meyerweb.com/eric/tools/css/reset/reset200802.css");
        buildTips();
    }
    Utils.createJsonp(`${Config.JDUserInfoURL}&callback=getLoginMsg`);

}

function getTime() {
    fetch(Config.JDTimeInfoURL)
        .then(function (response) { return response.json() })
        .then(function (res) {
            Config.serverTime = Utils.formatDate(res.time);
            Config.localeTime = new Date(+res.time).toLocaleString() + ":" + Config.serverTime.substr(-3, 3);
            timerTittleDiv.innerHTML = `京东时间：${Config.localeTime}<br/>当前获取时间的间隔频率：${Config.intervalSpan}毫秒`;
            if (Config.timingFlag) {
                if (Config.startTime <= +Config.serverTime) {
                    Utils.outPutLog(outputTextArea, `定时领取开始！`);
                    Utils.outPutLog(outputTextArea, `当前京东服务器时间：${Config.localeTime}`);
                    Config.timingFlag = !Config.timingFlag;
                    if (coupon) {
                        for (let i = 0; i < Config.postCount; i++) {
                            (function (index) {
                                setTimeout(() => {
                                    Utils.outPutLog(outputTextArea, `第${index + 1}次提交！`);
                                    coupon.send(outputTextArea);
                                }, index * Config.postSpan)
                            })(i)
                        }
                    }
                    timerTextInput.disabled = Config.timingFlag;
                    receiveTextInput.disabled = Config.timingFlag;
                    receiveCountInput.disabled = Config.timingFlag;
                    spanTextInput.disabled = Config.timingFlag;
                    receiveTimerBtn.innerHTML = "定时指定领取";
                    Utils.outPutLog(outputTextArea, `定时领取已结束！`);
                }
            }
        });
}

function copyRights() {
    console.clear();
    if (window.console) {
        console.group('%c京东领券助手', 'color:#009a61; font-size: 36px; font-weight: 400');
        console.log('%c本插件仅供学习交流使用\n作者:krapnik \ngithub:https://github.com/krapnikkk/JDCouponAssistant', 'color:#009a61');
        console.log('%c近三次更新内容：', 'color:#009a61');
        console.log('%c【0.4.2】：新增宠汪汪聚宝盆终极大奖功能；戳泡泡功能性测试', 'color:#009a61');
        console.log('%c【0.4.1】：合并原作者更新内容', 'color:#009a61');
        console.log('%c【0.4.0】：新增宠汪汪自动串门功能；修复部分BUG', 'color:#009a61');
        //console.log('%c【0.3.9】：修复宠汪汪自动任务定时以及执行顺序异常', 'color:#009a61');
        //console.log('%c【0.3.8】：新增宠汪汪自动任务功能（除每日签到及邀请用户）；新增宠汪汪自动活动功能（逛年货）', 'color:#009a61');
        //console.log('%c【0.3.7】：新增宠汪汪自动喂养功能', 'color:#009a61');
        //console.log('%c【0.3.6】：合并原作者更新内容', 'color:#009a61');
        //console.log('%c【0.3.5】：新增每日自动完成活动任务；修复部分Bug', 'color:#009a61');
        //console.log('%c【0.3.4】：合并原作者更新内容；修改部分提示信息；修复按钮释放时机错误；新增为作者战队助力', 'color:#009a61');
        //console.log('%c【0.3.3】：合并原作者更新内容；优化提示信息；优化页面逻辑；修复活动部分错误并修改运行逻辑', 'color:#009a61');
        //console.log('%c【0.3.2】：合并原作者更新内容', 'color:#009a61');
        //console.log('%c【0.3.1】：小白信用领券结果细化；优化页面操作逻辑；规范请求及返回信息显示顺序', 'color:#009a61');
        //console.log('%c【0.3.0】：新增重复次数（重复频率同刷新频率）；修复定时领取点击后无法取消；更改部分文案', 'color:#009a61');
        console.log('%c本版本非原版，请支持原作者:krapnik', 'color:#ef5035; font-size:16px;');
        console.groupEnd();
    }
}

var _hmt: any = _hmt || [];

function statistical() {
    (function () {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?d86d4ff3f6d089df2b41eb0735194c0d";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode!.insertBefore(hm, s);
    })();
}

copyRights();
getEntryDesc(getEntryType());
//statistical();

Object.assign(window, { "getLoginMsg": getLoginMsg, "krapnik": krapnik, "Utils": Utils, "Config": Config });








