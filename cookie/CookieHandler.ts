export interface CookieType {
    ck: string
    mark: string
    flag?: boolean
    index: number
}
export class CookieHandler {
    static getCookie(): string {
        return document.cookie;
    }

    static getCookieObj(str: string): any {
        if (!str) {
            alert('ck内容格式有误！');
            return;
        }
        var obj: any = {};
        var ca = str.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            var idx = c.indexOf("="),
                key = c.substring(0, idx),
                value = c.substring(idx + 1, c.length);
            obj[key] = value;
        }
        return obj;
    }

    static setCookie(cname: string, cvalue: string, domain: string = ".jd.com", path: string = "/"): void {
        var d = new Date();
        d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = `${cname}=${cvalue};${expires};domain=${domain};path=${path}`;
    }

    static clearAllCookie(domain: string = ".jd.com", path: string = "/"): void {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;)
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() + `;domain=${domain};path=${path}`;
        }
    }

    static coverCookie(item: CookieType): void {
        this.clearAllCookie();
        let ckObj = this.getCookieObj(item.ck);
        for (let key in ckObj) {
            let cname = key,
                cvalue = ckObj[key];
            this.setCookie(cname, cvalue);
        }
    }
}