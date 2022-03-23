export var LANG = ""

export const TR_AUTO = "TR_AUTO"

export function TR(key, old) {
    if (old != TR_AUTO && old != null) return old

    var lang = LANG
    if (LANG.startsWith("zh-")) lang = "zh_CN"

    let a = translates[key]
    if (a == null) return "" // key not exist

    let b = a[lang]
    if (b == null) {
        // transalte not exist
        let c = a[""]
        if (c == null) return key // defulat transalte not exist
        return c // default transalte 
    } else {
        return b
    }
}

export var translates = {
    "serverSettings": {
        "": "Server setting",
        "zh_CN": "服务器设置",
    },
    "serverAddress": {
        "": "Address",
        "zh_CN": "服务器",
    },
    "serverPort": {
        "": "Port",
        "zh_CN": "服务器端口",
    },
    "serverProtocol": {
        "": "Protocol",
        "zh_CN": "协议",
    },
    "serverPassword": {
        "": "Password",
        "zh_CN": "密码",
    },
    "serverPath": {
        "": "WebSocket Path",
        "zh_CN": "WebSocket 路径",
    },
    "withoutBrookProtocol": {
        "": "Without Brook Protocol"
    },
    "withoutBrookProtocol_summary": {
        "zh_CN": "不使用 Brook 协议",
        "": "Don't use Brook protocol",
    },
    "serverAllowInsecure": {
        "zh_CN": "允许不安全的连接",
        "": "Allow insecure",
    },
    "serverAllowInsecure_summary": {
        "zh_CN": "禁用证书检查. 启用后该配置安全性相当于明文",
        "": "Disable certificate checking. When enabled, this configuration is as secure as plaintext.",
    },
    "udpovertcp": {
        "": "UDP over TCP",
    },
}
