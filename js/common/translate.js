export var LANG = ""

export function LANG_TR() {
    if (LANG.startsWith("zh-")) return "zh_CN"
    return LANG
}

export function TR(key) {
    let transalte_item = translates[key]
    if (transalte_item == null) return key // key not exist

    let transalte_current_lang = transalte_item[LANG_TR()]
    if (transalte_current_lang == null) {
        let transalte_default_lang = transalte_item[""]
        if (transalte_default_lang == null) return key
        return transalte_default_lang
    } else {
        return transalte_current_lang
    }
}

Object.prototype.global_debug_setlang = function (lang) { LANG = lang }

// Translates

export var translates = {
    // v2ray common
    serverSettings: {
        "zh_CN": "服务器设置",
        "": "Server Settings",
    },
    serverAddress: {
        "zh_CN": "服务器",
        "": "Server Address",
    },
    serverPort: {
        "zh_CN": "服务器端口",
        "": "Server Port",
    },
    serverUserId: {
        "zh_CN": "用户 ID",
        "": "UUID",
    },
    serverEncryption: {
        "zh_CN": "加密",
        "": "Encryption",
    },
    serverMethod: {
        "zh_CN": "加密方式",
        "": "Encryption method",
    },
    serverPassword: {
        "zh_CN": "密码",
        "": "Password",
    },
    serverNetwork: {
        "zh_CN": "传输协议",
        "": "Network",
    },
    serverHeader: {
        "zh_CN": "伪装类型",
        "": "Header type",
    },
    serverSecurity: {
        "zh_CN": "传输层加密",
        "": "Transport layer encryption",
    },
    serverHost_ws: {
        "zh_CN": "WebSocket 主机",
        "": "WebSocket Host",
    },
    serverHost_http: {
        "zh_CN": "HTTP 主机",
        "": "HTTP Host",
    },
    serverPath: {
        "zh_CN": "路径",
        "": "Path",
    },
    serverPath_ws: {
        "zh_CN": "WebSocket 路径",
        "": "WebSocket Path",
    },
    serverPath_http: {
        "zh_CN": "HTTP 路径",
        "": "HTTP Path",
    },
    serverPath_mkcp: {
        "zh_CN": "mKCP 混淆密码",
        "": "mKCP Seed",
    },
    serverPath_quic: {
        "zh_CN": "QUIC 密钥",
        "": "QUIC Key",
    },
    serverPath_grpc: {
        "zh_CN": "gRPC 服务名称",
        "": "gRPC ServiceName",
    },
    serverQuicSecurity: {
        "zh_CN": "QUIC 加密方式",
        "": "QUIC Security",
    },
    grpcMultiMode: {
        "": "gRPC Multi Mode"
    },
    grpcMultiMode_summary: {
        "zh_CN": "这是一个 实验性 选项，可能不会被长期保留，也不保证跨版本兼容。此模式在 测试环境中 能够带来约 20% 的性能提升，实际效果因传输速率不同而不同。",
        "": "This is an experimental option",
    },

    // tls
    serverSecurityCategory: {
        "zh_CN": "安全设置",
        "": "Security Settings",
    },
    serverSNI: {
        "zh_CN": "服务器名称指示",
        "": "SNI",
    },
    utlsEnabled: {
        "zh_CN": "uTLS 开关",
        "": "uTLS Enabled",
    },
    utlsFingerprint: {
        "zh_CN": "uTLS 指纹",
        "": "uTLS Fingerprint",
    },
    serverALPN: {
        "zh_CN": "应用层协议协商",
        "": "ALPN",
    },
    serverCertificates: {
        "zh_CN": "证书（链）",
        "": "Certificate (chain)",
    },
    serverFlow: {
        "zh_CN": "流控",
        "": "Flow Control",
    },
    serverFlowVision: {
        "zh_CN": "流控",
        "": "Flow Control",
    },
    serverAllowInsecure: {
        "zh_CN": "允许不安全的连接",
        "": "Allow insecure",
    },
    serverAllowInsecure_summary: {
        "zh_CN": "禁用证书检查. 启用后该配置安全性相当于明文",
        "": "Disable certificate checking. When enabled, this configuration is as secure as plaintext.",
    },
    insecure_cleartext: {
        "zh_CN": "该配置 (不安全) 能够被检测识别，传输的内容对审查者完全可见，并且无法抵抗中间人篡改通讯内容.",
        "": "The configuration (insecure) can be detected and identified, the transmission is fully visible to the censor and is not resistant to man-in-the-middle tampering with the content of the communication.",
    },
    insecure_xtls: {
        "zh_CN": "该配置 (XTLS) 能够被检测识别.",
        "": "This configuration (XTLS) can be detected and identified.",
    },

    // Brook
    serverProtocol: {
        "": "Protocol",
        "zh_CN": "协议",
    },
    withoutBrookProtocol: {
        "": "Without Brook Protocol"
    },
    withoutBrookProtocol_summary: {
        "zh_CN": "不使用 Brook 协议",
        "": "Don't use Brook protocol",
    },
    udpovertcp: {
        "": "UDP over TCP",
    },

    // shadowTLS
    shadowTlsServerName: {
        "zh_CN": "ShadowTLS 伪装域名",
        "": "ShadowTLS Server Name",
    },
    shadowTlsVersion: {
        "zh_CN": "ShadowTLS 版本",
        "": "ShadowTLS Version",
    },
    shadowTlsServerPassword: {
        "zh_CN": "ShadowTLS 密码",
        "": "ShadowTLS Password",
    },

    // WireGurad
    wireguardLocalAddress: {
        "zh_CN": "本地地址",
        "": "Local Address",
    },
    wireguardPrivateKey: {
        "zh_CN": "私钥",
        "": "Private Key",
    },
    wireguardCertificates: {
        "zh_CN": "节点公钥",
        "": "Peer Public Key",
    },
    wireguardPeerPreSharedKey: {
        "zh_CN": "节点预共享密钥",
        "": "Peer Pre-Shared Key",
    },
    wireguardMTU: {
        "": "MTU",
    },
    
    // Juicity
    juicityCongestionControl: {
        "zh_CN": "拥塞控制",
        "": "Congestion Control",
    },
    juicitySNI: {
        "": "SNI",
    },
    juicityPinnedCertchainSha256: {
        "zh_CN": "固定证书链 SHA256 (可选)",
        "": "Pinned Certchain SHA256 (Optional)"
    },
}
