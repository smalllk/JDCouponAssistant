import Config from "../config/config";
import { consoleEnum } from '../enum/commonType';

(window as any).jsonpBind = function (res: string) {
    Utils.jsonpBind(JSON.stringify(res));
}
export default class Utils {
    static obtainLocal(ck: string): string {
        return ck.replace(/(?:(?:^|.*;\s*)3AB9D23F7A4B3C9B\s*=\s*([^;]*).*$)|^.*$/, "$1");
    };

    static getCookie(): string {
        return document.cookie;
    }

    static formatDate(date: string): string {
        let dateObj = new Date(+date),
            year: string | number = dateObj.getFullYear(),
            month: string | number = dateObj.getMonth() + 1,
            day: string | number = dateObj.getDate(),
            hours: string | number = dateObj.getHours(),
            mins: string | number = dateObj.getMinutes(),
            secs: string | number = dateObj.getSeconds(),
            msecs: string | number = dateObj.getMilliseconds();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (mins < 10) {
            mins = "0" + mins;
        }
        if (secs < 10) {
            secs = "0" + secs;
        }
        if (msecs < 10) {
            msecs = "00" + msecs;
        } else if (msecs < 100 && msecs >= 10) {
            msecs = "0" + msecs;
        }
        return year + "" + month + "" + day + "" + hours + "" + mins + "" + secs + "" + msecs;
    }

    static formatDate2(date: string): string {
        let dateObj = new Date(+date),
            year: string | number = dateObj.getFullYear(),
            month: string | number = dateObj.getMonth() + 1,
            day: string | number = dateObj.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return year + "" + month + "" + day;
    }

    static formatDate3(date: string): string {
        let dateObj = new Date(+date),
            hours: string | number = dateObj.getHours(),
            mins: string | number = dateObj.getMinutes(),
            secs: string | number = dateObj.getSeconds(),
            msecs: string | number = dateObj.getMilliseconds();
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (mins < 10) {
            mins = "0" + mins;
        }
        if (secs < 10) {
            secs = "0" + secs;
        }
        if (msecs < 10) {
            msecs = "00" + msecs;
        } else if (msecs < 100 && msecs >= 10) {
            msecs = "0" + msecs;
        }
        return hours + "" + mins + "" + secs + "" + msecs;
    }

    static GetQueryString(name: string): string {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (!r) {
            let url = window.location.hash;
            r = url.substr(url.indexOf("?") + 1, url.length - url.indexOf("?")).match(reg);
        }
        if (r != null)
            return r[2];
        return "";
    }

    static getSearchString(str: string, key: string): any {
        str = str.substring(1, str.length);
        var arr = str.split("&");
        var obj: any = new Object();
        for (var i = 0; i < arr.length; i++) {
            var tmp_arr = arr[i].split("=");
            obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
        }
        return obj[key];
    }

    static getQueryStringByName(url: string) {
        url = url.replace(/#.*/, ''); //removes hash (to avoid getting hash query)
        var queryString = /\?[a-zA-Z0-9\=\&\%\$\-\_\.\+\!\*\'\(\)\,]+/.exec(url); //valid chars according to: http://www.ietf.org/rfc/rfc1738.txt
        return (queryString) ? decodeURIComponent(queryString[0]) : '';
    }

    static formateTime(time: string): number {
        return Math.trunc(+(time.replace(/\s+/ig, "").replace(/[:|：]+/ig, "").replace(/[-|——]+/ig, "")));
    }

    static createJsonp(url: string, bind: boolean = false) {
        var jsonpScript = document.createElement('script');
        document.getElementsByTagName('head')[0].appendChild(jsonpScript);
        if (bind) {
            url += "jsonpBind";
        }
        jsonpScript.setAttribute('src', url);

        jsonpScript.onload = () => {
            document.getElementsByTagName('head')[0].removeChild(jsonpScript);
        }
    }

    static jsonpBind(res: string) {
        postMessage(res, '*');
    }

    static outPutLog(output: HTMLTextAreaElement, log: string, timeFlag: boolean = true): void {
        if (output.style.display == 'none') {
            output.style.display = 'block';
        }
        if (timeFlag) {
            if (output.value) {
                output.value = `${log}\n${new Date().toLocaleString()} ${output.value}`;
            } else {
                output.value = `${log}\n${new Date().toLocaleString()}`;
            }
        } else {
            output.value = `${log}\n${output.value}`;
        }

    }

    static random(n: number, m: number): number {
        return Math.floor(Math.random() * (m - n + 1) + n);
    }

    static copyText(text: string) {
        if (text === "") {
            alert("好像没有需要复制的内容哦！");
            return;
        }
        var oInput: HTMLInputElement | null = document.querySelector('.oInput');
        if (!oInput) {
            oInput = document.createElement('input');
            oInput.className = 'oInput';
            document.body.appendChild(oInput);
        }
        oInput.value = text;
        oInput.select();
        document.execCommand("Copy");
        oInput.style.display = 'none';
        alert('内容已经复制到黏贴板啦');
    }

    static importFile(ext: string): Promise<string | ArrayBuffer | null> {
        return new Promise((resolve, reject) => {
            let fInput: HTMLInputElement = document.createElement('input');
            fInput.className = 'fInput';
            fInput.type = "file";
            document.body.appendChild(fInput);
            fInput.onchange = function (e: any) {

                const file = e.target.files[0], reader = new FileReader();
                if (file && file.type.includes(ext)) {
                    reader.readAsText(file)
                } else {
                    alert("不支持的文件格式!");
                    return;
                }
                reader.onabort = function () {
                    //读取中断
                    document.body.removeChild(fInput);
                };
                reader.onerror = function () {
                    //读取发生错误
                    document.body.removeChild(fInput);
                };
                reader.onload = function () {
                    if (reader.readyState == 2) {
                        const result = reader.result;
                        resolve(result);
                        document.body.removeChild(fInput);
                    }
                }
            }
            fInput.click();
            fInput.style.display = "none";
        })
    }

    static loadiFrame(url: string): Promise<HTMLIFrameElement> {
        return new Promise(resolve => {
            var iframe: HTMLIFrameElement = document.createElement('iframe');
            document.body.appendChild(iframe);
            iframe.width = "1";
            iframe.height = "1";
            iframe!.onload = () => {
                resolve(iframe);
            }
            iframe!.src = url;
            iframe!.style.display = 'none';
        })
    }

    static loadCss(url: string) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    static stringify(params: any): string {
        return Object.keys(params).map((key) => {
            console.log();
            return `${key}=${this.isObject(params[key]) ? JSON.stringify(params[key]) : encodeURIComponent(params[key])}`;
        }).join("&");
    }

    static isObject(value: any) {
        let type = typeof value;
        return value != null && (type == 'object' || type == 'function');
    }

    static isNumber(obj: any) {
        return typeof obj === 'number' && !isNaN(obj);
    }

    static debugInfo(type: consoleEnum, message?: any, ...optionalParams: any[]) {
        switch (type) {
            case consoleEnum.log:
                if (Config.debug) console.log(message, optionalParams);
                break;
            case consoleEnum.info:
                if (Config.debug) console.info(message, optionalParams);
                break;
            case consoleEnum.warn:
                if (Config.debug) console.warn(message, optionalParams);
                break;
            case consoleEnum.error:
                if (Config.debug) console.error(message, optionalParams);
                break;
        }
    }

    static deleteEmptyProperty(obj: any) {
        var object = obj;

        for (var i in object) {
            var value = object[i];
            if (typeof value === 'object') {
                if (Array.isArray(value)) {
                    if (value.length == 0) {
                        delete object[i];
                        continue;
                    }
                }
                else {
                    if (value === '' || value === null || value === undefined) {
                        delete object[i];
                    }
                }

                this.deleteEmptyProperty(value);
            } else {
                if (value === '' || value === null || value === undefined) {
                    delete object[i];
                }
            }
        }

        return object;
    }

    // static HTMLfactory(type: string, attributes: any, parent: HTMLElement): HTMLElement {
    //     let ele: any = document.createElement(type);
    //     for (let k in attributes) {
    //         ele[k] = attributes[k];
    //     }
    //     parent.append(ele);
    //     return ele;

    // }
    static querySelector(dom: string): HTMLElement {
        return <HTMLElement>document.querySelector(dom);
    }
}

export const _$ = Utils.querySelector;