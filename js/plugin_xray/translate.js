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
        "zh_CN": "服务器设置",
        "": "Server Settings",
    },
    "serverAddress": {
        "zh_CN": "服务器",
        "": "Server Address",
    },
    "serverPort": {
        "zh_CN": "服务器端口",
        "": "Server Port",
    },
    "serverUserId": {
        "zh_CN": "用户 ID",
        "": "UUID",
    },
    "serverEncryption": {
        "zh_CN": "加密",
        "": "Encryption",
    },
    "serverMethod": {
        "zh_CN": "加密方式",
        "": "Encryption method",
    },
    "serverPassword": {
        "zh_CN": "密码",
        "": "Password",
    },
    "serverNetwork": {
        "zh_CN": "传输协议",
        "": "Network",
    },
    "serverHeader": {
        "zh_CN": "伪装类型",
        "": "Header type",
    },
    "serverSecurity": {
        "zh_CN": "传输层加密",
        "": "Transport layer encryption",
    },
    "serverHost_ws": {
        "zh_CN": "WebSocket 主机",
        "": "WebSocket Host",
    },
    "serverHost_http": {
        "zh_CN": "HTTP 主机",
        "": "HTTP Host",
    },
    "serverPath_ws": {
        "zh_CN": "WebSocket 路径",
        "": "WebSocket Path",
    },
    "serverPath_http": {
        "zh_CN": "HTTP 路径",
        "": "HTTP Path",
    },
    "serverPath_mkcp": {
        "zh_CN": "mKCP 混淆密码",
        "": "mKCP Seed",
    },
    "serverPath_quic": {
        "zh_CN": "QUIC 密钥",
        "": "QUIC Key",
    },
    "serverPath_grpc": {
        "zh_CN": "gRPC 服务名称",
        "": "gRPC ServiceName",
    },
    "serverQuicSecurity": {
        "zh_CN": "QUIC 加密方式",
        "": "QUIC Security",
    },
    // tls
    "serverSecurityCategory": {
        "zh_CN": "安全设置",
        "": "Security Settings",
    },
    "serverSNI": {
        "zh_CN": "服务器名称指示",
        "": "SNI",
    },
    "serverALPN": {
        "zh_CN": "应用层协议协商",
        "": "ALPN",
    },
    "serverCertificates": {
        "zh_CN": "证书（链）",
        "": "Certificate (chain)",
    },
    "serverFlow": {
        "zh_CN": "流控",
        "": "Flow Control",
    },
    "serverAllowInsecure": {
        "zh_CN": "允许不安全的连接",
        "": "Allow insecure",
    },
    "serverAllowInsecure_summary": {
        "zh_CN": "禁用证书检查. 启用后该配置安全性相当于明文",
        "": "Disable certificate checking. When enabled, this configuration is as secure as plaintext.",
    },
    "grpcMultiMode": {
        "": "gRPC Multi Mode"
    },
    "grpcMultiMode_summary": {
        "zh_CN": "这是一个实验性选项",
        "": "This is an experimental option",
    },
    // insecure
    "insecure_cleartext": {
        "zh_CN": "该配置 (不安全) 能够被检测识别，传输的内容对审查者完全可见，并且无法抵抗中间人篡改通讯内容.",
        "": "The configuration (insecure) can be detected and identified, the transmission is fully visible to the censor and is not resistant to man-in-the-middle tampering with the content of the communication.",
    },
    "insecure_xtls": {
        "zh_CN": "该配置 (XTLS) 能够被检测识别.",
        "": "This configuration (XTLS) can be detected and identified.",
    },
}
