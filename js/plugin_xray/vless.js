import { util } from "../common/util.js"
import { commomClass } from "../common/common.js"
import { TR } from "../common/translate.js"
import { Base64 } from 'js-base64'

class vlessClass {
    constructor() {
        this.sharedStorage = {}
        this.defaultSharedStorage = {}
        this.common = new commomClass()
    }

    _initDefaultSharedStorage() {
        // start of default keys
        this.defaultSharedStorage.jsVersion = 1
        this.defaultSharedStorage.insecureHint = ""
        this.defaultSharedStorage.name = ""
        this.defaultSharedStorage.serverAddress = "127.0.0.1"
        this.defaultSharedStorage.serverPort = "1080"
        // end of default keys
        this.defaultSharedStorage.serverUserId = ""
        this.defaultSharedStorage.serverEncryption = "none"
        this.defaultSharedStorage.serverNetwork = "tcp"
        this.defaultSharedStorage.serverHeader = "none"
        this.defaultSharedStorage.serverQuicSecurity = "chacha20-poly1305"
        this.defaultSharedStorage.serverHost = ""
        this.defaultSharedStorage.serverPath = ""
        this.defaultSharedStorage.serverSecurity = "none"
        this.defaultSharedStorage.grpcMultiMode = false
        // tls
        this.defaultSharedStorage.utlsFingerprint = ""
        this.defaultSharedStorage.serverSNI = ""
        this.defaultSharedStorage.serverALPN = ""
        this.defaultSharedStorage.serverCertificates = ""
        this.defaultSharedStorage.serverFlow = "xtls-rprx-origin"
        this.defaultSharedStorage.serverFlowVision = ""
        this.defaultSharedStorage.serverAllowInsecure = false

        for (var k in this.defaultSharedStorage) {
            let v = this.defaultSharedStorage[k]
            this.common._setType(k, typeof v)

            if (!this.sharedStorage.hasOwnProperty(k)) {
                this.sharedStorage[k] = v
            }
        }

    }

    _onSharedStorageUpdated() {
        // not null
        for (var k in this.sharedStorage) {
            if (this.sharedStorage[k] == null) {
                this.sharedStorage[k] = ""
            }
        }
        this._setShareLink()
        this.sharedStorage.insecureHint = this._insecureHint()
    }

    _insecureHint() {
        if (this.sharedStorage.serverSecurity == "none") {
            return TR("insecure_cleartext")
        } else if (this.sharedStorage.serverSecurity == "xtls") {
            return TR("insecure_xtls")
        }
        return ""
    }

    _setShareLink() {
        var builder = util.newURL("vless")

        if (this.sharedStorage.name.isNotBlank()) builder.hash = "#" + encodeURIComponent(this.sharedStorage.name)
        builder.username = this.sharedStorage.serverUserId
        builder.host = util.wrapUri(this.sharedStorage.serverAddress, this.sharedStorage.serverPort)
        builder.searchParams.set("encryption", this.sharedStorage.serverEncryption)

        var type = this.sharedStorage.serverNetwork
        if (type == "h2") type = "http"
        builder.searchParams.set("type", type)

        if (type == "tcp") {
            if (this.sharedStorage.serverHeader == "http") {
                builder.searchParams.set("headerType", this.sharedStorage.serverHeader)
                if (this.sharedStorage.serverHost.isNotBlank()) {
                    builder.searchParams.set("host", this.sharedStorage.serverHost)
                }
                if (this.sharedStorage.serverPath.isNotBlank()) {
                    builder.searchParams.set("path", this.sharedStorage.serverPath)
                }
            }
        } else if (type == "kcp") {
            if (this.sharedStorage.serverHeader.isNotBlank() && this.sharedStorage.serverHeader != "none") {
                builder.searchParams.set("headerType", this.sharedStorage.serverHeader)
            }
            if (this.sharedStorage.serverPath.isNotBlank()) {
                builder.searchParams.set("seed", this.sharedStorage.serverPath)
            }
        } else if (type == "ws" || type == "http") {
            if (this.sharedStorage.serverHost.isNotBlank()) {
                builder.searchParams.set("host", this.sharedStorage.serverHost)
            }
            if (this.sharedStorage.serverPath.isNotBlank()) {
                builder.searchParams.set("path", this.sharedStorage.serverPath)
            }
        } else if (type == "quic") {
            if (this.sharedStorage.serverHeader.isNotBlank() && this.sharedStorage.serverHeader != "none") {
                builder.searchParams.set("headerType", this.sharedStorage.serverHeader)
            }
            if (this.sharedStorage.serverQuicSecurity.isNotBlank() && this.sharedStorage.serverQuicSecurity != "none") {
                builder.searchParams.set("key", this.sharedStorage.serverPath)
                builder.searchParams.set("serverQuicSecurity", this.sharedStorage.serverQuicSecurity)
            }
        } else if (type == "grpc") {
            if (this.sharedStorage.serverPath.isNotBlank()) {
                builder.searchParams.set("serviceName", this.sharedStorage.serverPath)
            }
            if (this.sharedStorage.grpcMultiMode == true) {
                builder.searchParams.set("mode", "multi")
            }
        }

        if (this.sharedStorage.serverSecurity.isNotBlank() && this.sharedStorage.serverSecurity != "none") {
            builder.searchParams.set("security", this.sharedStorage.serverSecurity)
            switch (this.sharedStorage.serverSecurity) {
                case "tls": {
                    if (this.sharedStorage.serverSNI.isNotBlank()) {
                        builder.searchParams.set("sni", this.sharedStorage.serverSNI)
                    }
                    if (this.sharedStorage.serverALPN.isNotBlank()) {
                        builder.searchParams.set("alpn", this.sharedStorage.serverALPN)
                    }
                    if (this.sharedStorage.serverCertificates.isNotBlank()) {
                        builder.searchParams.set("cert", this.sharedStorage.serverCertificates)
                    }
                    if (this.sharedStorage.serverFlowVision.isNotBlank()) {
                        builder.searchParams.set("flow", this.sharedStorage.serverFlowVision)
                    }
                    break
                }
                case "xtls": {
                    if (this.sharedStorage.serverSNI.isNotBlank()) {
                        builder.searchParams.set("sni", this.sharedStorage.serverSNI)
                    }
                    if (this.sharedStorage.serverALPN.isNotBlank()) {
                        builder.searchParams.set("alpn", this.sharedStorage.serverALPN)
                    }
                    if (this.sharedStorage.serverFlow.isNotBlank()) {
                        builder.searchParams.set("flow", this.sharedStorage.serverFlow)
                    }
                    break
                }
            }
        }

        this.sharedStorage.shareLink = builder.toString()
    }

    // UI Interface

    requirePreferenceScreenConfig() {
        let sb = [
            {
                "title": TR("serverSettings"),
                "preferences": [
                    {
                        "type": "EditTextPreference",
                        "key": "serverAddress",
                        "icon": "ic_hardware_router",
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "serverPort",
                        "icon": "ic_maps_directions_boat",
                        "EditTextPreferenceModifiers": "Port",
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "serverUserId",
                        "icon": "ic_baseline_person_24",
                        "summaryProvider": "PasswordSummaryProvider",
                    },
                    {
                        "type": "SimpleMenuPreference",
                        "key": "serverEncryption",
                        "icon": "ic_notification_enhanced_encryption",
                        "entries": {
                            "none": "none",
                        }
                    },
                    {
                        "type": "SimpleMenuPreference",
                        "key": "serverNetwork",
                        "icon": "ic_baseline_compare_arrows_24",
                        "entries": {
                            "tcp": "tcp",
                            "kcp": "kcp",
                            "ws": "ws",
                            "h2": "h2",
                            "quic": "quic",
                            "grpc": "grpc",
                        }
                    },
                    {
                        "type": "SimpleMenuPreference",
                        "key": "serverHeader",
                        "icon": "ic_baseline_texture_24",
                    },
                    {
                        "type": "SimpleMenuPreference",
                        "key": "serverQuicSecurity",
                        "icon": "ic_baseline_security_24",
                        "entries": {
                            "chacha20-poly1305": "chacha20-poly1305",
                            "aes-128-gcm": "aes-128-gcm",
                            "none": "none",
                        }
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "serverHost",
                        "icon": "ic_baseline_airplanemode_active_24"
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "serverPath",
                        "icon": "ic_baseline_format_align_left_24"
                    },
                    {
                        "type": "SimpleMenuPreference",
                        "key": "serverSecurity",
                        "icon": "ic_baseline_layers_24",
                        "entries": {
                            "none": "none",
                            "tls": "tls",
                            "xtls": "xtls",
                        }
                    },
                    {
                        "type": "SwitchPreference",
                        "key": "grpcMultiMode",
                        "summary": TR("grpcMultiMode_summary")
                    },
                ]
            },
            {
                "key": "serverSecurityCategory",
                "preferences": [
                    {
                        "type": "SimpleMenuPreference",
                        "key": "utlsFingerprint",
                        "entries": {
                            "": "",
                            "chrome": "chrome",
                            "firefox": "firefox",
                            "safari": "safari",
                            "ios": "ios",
                            "android": "android",
                            "edge": "edge",
                            "360": "360",
                            "qq": "qq",
                            "random": "random",
                            "randomized": "randomized",
                        }
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "serverSNI",
                        "icon": "ic_action_copyright"
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "serverALPN",
                        "icon": "ic_baseline_legend_toggle_24"
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "serverCertificates",
                        "icon": "ic_baseline_vpn_key_24"
                    },
                    {
                        "type": "SimpleMenuPreference",
                        "key": "serverFlow",
                        "icon": "ic_baseline_stream_24",
                        "entries": {
                            "xtls-rprx-origin": "xtls-rprx-origin",
                            "xtls-rprx-origin-udp443": "xtls-rprx-origin-udp443",
                            "xtls-rprx-direct": "xtls-rprx-direct",
                            "xtls-rprx-direct-udp443": "xtls-rprx-direct-udp443",
                            "xtls-rprx-splice": "xtls-rprx-splice",
                            "xtls-rprx-splice-udp443": "xtls-rprx-splice-udp443",
                        }
                    },
                    {
                        "type": "SimpleMenuPreference",
                        "key": "serverFlowVision",
                        "icon": "ic_baseline_stream_24",
                        "entries": {
                            "none": "",
                            "xtls-rprx-vision": "xtls-rprx-vision",
                            "xtls-rprx-vision-udp443": "xtls-rprx-vision-udp443"
                        }
                    },
                    {
                        "type": "SwitchPreference",
                        "key": "serverAllowInsecure",
                        "icon": "ic_notification_enhanced_encryption",
                        "summary": TR("serverAllowInsecure_summary")
                    },
                ]

            }
        ]
        this.common._applyTranslateToPreferenceScreenConfig(sb, TR)
        return JSON.stringify(sb)
    }

    // 开启设置界面时调用
    setSharedStorage(b64Str) {
        this.sharedStorage = util.decodeB64Str(b64Str)
        this._initDefaultSharedStorage()
    }

    // 开启设置界面时调用
    requireSetProfileCache() {
        for (var k in this.defaultSharedStorage) {
            this.common.setKV(k, this.sharedStorage[k])
        }
    }

    // 设置界面创建后调用
    onPreferenceCreated() {
        let this2 = this

        function listenOnPreferenceChangedNow(key) {
            neko.listenOnPreferenceChanged(key)
            this2._onPreferenceChanged(key, this2.sharedStorage[key])
        }

        listenOnPreferenceChangedNow("serverNetwork")
        listenOnPreferenceChangedNow("serverSecurity")
    }

    // 保存时调用（混合编辑后的值）
    sharedStorageFromProfileCache() {
        for (var k in this.defaultSharedStorage) {
            this.sharedStorage[k] = this.common.getKV(k)
        }
        this._onSharedStorageUpdated()
        return JSON.stringify(this.sharedStorage)
    }

    // 用户修改 preference 时调用
    onPreferenceChanged(b64Str) {
        let args = util.decodeB64Str(b64Str)
        this._onPreferenceChanged(args.key, args.newValue)
    }

    _onPreferenceChanged(key, newValue) {
        if (key == "serverNetwork") {
            neko.setPreferenceVisibility("serverQuicSecurity", false)
            // neko.setPreferenceVisibility("serverWsCategory", false)
            neko.setPreferenceVisibility("grpcMultiMode", false)
            neko.setMenu("serverHeader", JSON.stringify({
                "none": "none",
                "srtp": "srtp",
                "utp": "utp",
                "wechat-video": "wechat-video",
                "dtls": "dtls",
                "wireguard": "wireguard",
            }))

            if (newValue == "tcp") {
                neko.setPreferenceVisibility("serverHeader", true)
                neko.setPreferenceVisibility("serverHost", false)
                neko.setPreferenceVisibility("serverPath", false)
                neko.setMenu("serverHeader", JSON.stringify({
                    "none": "none",
                    "http": "http",
                }))
            } else if (newValue == "mkcp") {
                neko.setPreferenceVisibility("serverHeader", true)
                neko.setPreferenceVisibility("serverHost", false)
                neko.setPreferenceVisibility("serverPath", true)
                neko.setPreferenceTitle("serverPath", TR("serverPath_mkcp"))
            } else if (newValue == "ws") {
                neko.setPreferenceVisibility("serverHeader", false)
                neko.setPreferenceVisibility("serverHost", true)
                neko.setPreferenceVisibility("serverPath", true)
                neko.setPreferenceTitle("serverHost", TR("serverHost_ws"))
                neko.setPreferenceTitle("serverPath", TR("serverPath_ws"))
            } else if (newValue == "h2") {
                neko.setPreferenceVisibility("serverHeader", false)
                neko.setPreferenceVisibility("serverHost", true)
                neko.setPreferenceVisibility("serverPath", true)
                neko.setPreferenceVisibility("serverWsCategory", true) // TODO 暂时不支持浏览器转发
                neko.setPreferenceTitle("serverHost", TR("serverHost_http"))
                neko.setPreferenceTitle("serverPath", TR("serverPath_http"))
            } else if (newValue == "quic") {
                neko.setPreferenceVisibility("serverHeader", true)
                neko.setPreferenceVisibility("serverQuicSecurity", true)
                neko.setPreferenceVisibility("serverHost", false)
                neko.setPreferenceVisibility("serverPath", true)
                neko.setPreferenceTitle("serverPath", TR("serverPath_quic"))
            } else if (newValue == "grpc") {
                neko.setPreferenceVisibility("serverHeader", false)
                neko.setPreferenceVisibility("serverHost", false)
                neko.setPreferenceVisibility("serverPath", true)
                neko.setPreferenceVisibility("grpcMultiMode", true)
                neko.setPreferenceTitle("serverPath", TR("serverPath_grpc"))
            }
        } else if (key == "serverSecurity") {
            if (newValue == "none") {
                neko.setPreferenceVisibility("serverSecurityCategory", false)
            } else {
                neko.setPreferenceVisibility("serverSecurityCategory", true)
                let isXTLS = (newValue == "xtls")
                neko.setPreferenceVisibility("serverFlow", isXTLS)
                neko.setPreferenceVisibility("serverFlowVision", !isXTLS)
                neko.setPreferenceVisibility("utlsFingerprint", !isXTLS)
            }
        }
    }

    // Interface

    parseShareLink(b64Str) {
        let args = util.decodeB64Str(b64Str)

        this.sharedStorage = {}
        this._initDefaultSharedStorage()

        var url = util.tryParseURL(args.shareLink)
        if (typeof url == "string") return url

        if (Base64.isValid(url.hostname)) return "不支持的格式"

        var serverAddress = util.unwrapIpv6(url.hostname)
        this.sharedStorage.serverAddress = serverAddress
        this.sharedStorage.serverPort = url.host.replace(serverAddress, "").substringAfter(":")
        this.sharedStorage.serverUserId = url.username
        this.sharedStorage.name = decodeURIComponent(url.hash.substringAfter("#"))

        util.ifNotNull(url.searchParams.get("path"), (it) => {
            this.sharedStorage.serverPath = it
        })

        var protocol = url.searchParams.get("type")
        if (protocol == null) protocol = "tcp"
        if (protocol == "http") protocol = "h2"
        this.sharedStorage.serverNetwork = protocol

        switch (url.searchParams.get("security")) {
            case "tls": {
                this.sharedStorage.serverSecurity = "tls"
                util.ifNotNull(url.searchParams.get("sni"), (it) => {
                    this.sharedStorage.serverSNI = it
                })
                util.ifNotNull(url.searchParams.get("alpn"), (it) => {
                    this.sharedStorage.serverALPN = it
                })
                util.ifNotNull(url.searchParams.get("cert"), (it) => {
                    this.sharedStorage.serverCertificates = it
                })
                util.ifNotNull(url.searchParams.get("flow"), (it) => {
                    this.sharedStorage.serverFlowVision = it
                })
                break
            }
            case "xtls": {
                this.sharedStorage.serverSecurity = "xtls"
                util.ifNotNull(url.searchParams.get("sni"), (it) => {
                    this.sharedStorage.serverSNI = it
                })
                util.ifNotNull(url.searchParams.get("alpn"), (it) => {
                    this.sharedStorage.serverALPN = it
                })
                util.ifNotNull(url.searchParams.get("flow"), (it) => {
                    this.sharedStorage.serverFlow = it
                })
                break
            }
        }

        switch (protocol) {
            case "tcp": {
                util.ifNotNull(url.searchParams.get("headerType"), (headerType) => {
                    if (headerType == "http") {
                        this.sharedStorage.serverHeader = headerType
                        util.ifNotNull(url.searchParams.get("host"), (it) => {
                            this.sharedStorage.serverHost = it
                        })
                    }
                })
                break
            }
            case "kcp": {
                util.ifNotNull(url.searchParams.get("headerType"), (it) => {
                    this.sharedStorage.serverHeader = it
                })
                util.ifNotNull(url.searchParams.get("seed"), (it) => {
                    this.sharedStorage.serverPath = it
                })
                break
            }
            case "h2": {
                util.ifNotNull(url.searchParams.get("host"), (it) => {
                    this.sharedStorage.serverHost = it
                })
                break
            }
            case "ws": {
                util.ifNotNull(url.searchParams.get("host"), (it) => {
                    this.sharedStorage.serverHost = it
                })
                break
            }
            case "quic": {
                util.ifNotNull(url.searchParams.get("headerType"), (it) => {
                    this.sharedStorage.serverHeader = it
                })
                util.ifNotNull(url.searchParams.get("quicSecurity"), (quicSecurity) => {
                    this.sharedStorage.serverQuicSecurity = quicSecurity
                    util.ifNotNull(url.searchParams.get("key"), (it) => {
                        this.sharedStorage.serverPath = it
                    })
                })
                break
            }
            case "grpc": {
                util.ifNotNull(url.searchParams.get("serviceName"), (it) => {
                    this.sharedStorage.serverPath = it
                })
                if (url.searchParams.get("serviceName") == "multi") this.sharedStorage.grpcMultiMode = true
                break
            }
        }

        this._onSharedStorageUpdated()
        return JSON.stringify(this.sharedStorage)
    }

    buildAllConfig(b64Str) {
        try {
            let args = util.decodeB64Str(b64Str)
            let ss = util.decodeB64Str(args.sharedStorage)

            let canMux = false
            if (ss.serverNetwork == "tcp" || ss.serverNetwork == "ws" || ss.serverNetwork == "h2") {
                canMux = true
            }
            if (ss.serverSecurity == "xtls") {
                canMux = false
            }

            let t0 = {
                "log": {
                    "loglevel": "debug"
                },
                "inbounds": [
                    {
                        "port": args.port,
                        "listen": "127.0.0.1",
                        "protocol": "socks",
                        "settings": {
                            "udp": true
                        }
                    }
                ],
                "outbounds": [
                    {
                        "mux": {
                            "enabled": args.muxEnabled && canMux,
                            "concurrency": args.muxConcurrency
                        },
                        "protocol": "vless",
                        "settings": {
                            "vnext": [
                                {
                                    "address": args.finalAddress, // 换成你的域名或服务器 IP（发起请求时无需解析域名了）
                                    "port": args.finalPort,
                                    "users": [
                                        {
                                            "id": ss.serverUserId, // 填写你的 UUID
                                            "encryption": ss.serverEncryption,
                                            "level": 0,
                                        }
                                    ]
                                }
                            ]
                        },
                        "streamSettings": {
                            "network": ss.serverNetwork,
                            "security": ss.serverSecurity,
                        }
                    }
                ]
            }

            // fill http host & SNI
            if (ss.serverHost.isBlank()) {
                ss.serverHost = ss.serverAddress
            }
            if (ss.serverSNI.isBlank()) {
                ss.serverSNI = ss.serverAddress
            }

            switch (ss.serverNetwork) {
                case "tcp": {
                    let t1 = {
                        "header": {
                            "type": ss.serverHeader
                        },
                    }
                    t0.outbounds[0].streamSettings["tcpSettings"] = t1
                    break
                }
                case "ws": {
                    let t1 = {
                        "path": util.addSplash(ss.serverPath),
                    }
                    t1["headers"] = { "Host": ss.serverHost.firstLine() }
                    t0.outbounds[0].streamSettings["wsSettings"] = t1
                    break
                }
                case "kcp": {
                    let t1 = {
                        "header": {
                            "type": ss.serverHeader
                        },
                        "seed": ss.serverPath,
                    }
                    t0.outbounds[0].streamSettings["kcpSettings"] = t1
                    break
                }
                case "h2": {
                    let t1 = {
                        "host": ss.serverHost.lines(),
                        "path": util.addSplash(ss.serverPath),
                    }
                    t0.outbounds[0].streamSettings["httpSettings"] = t1
                    break
                }
                case "quic": {
                    let t1 = {
                        "security": ss.serverQuicSecurity,
                        "key": ss.serverPath,
                        "header": {
                            "type": ss.serverHeader
                        },
                    }
                    t0.outbounds[0].streamSettings["quicSettings"] = t1
                    break
                }
                case "grpc": {
                    let t1 = {
                        "serviceName": ss.serverPath,
                        "multiMode": ss.grpcMultiMode,
                    }
                    t0.outbounds[0].streamSettings["grpcSettings"] = t1
                    break
                }
            }

            switch (ss.serverSecurity) {
                case "tls": {
                    let t2 = {
                        "serverName": ss.serverSNI,
                        "allowInsecure": ss.serverAllowInsecure,
                    }
                    if (ss.utlsFingerprint.isNotBlank()) t2["fingerprint"] = ss.utlsFingerprint
                    if (ss.serverALPN.isNotBlank()) t2["alpn"] = ss.serverALPN.lines()
                    if (ss.serverCertificates.isNotBlank()) t2["certificates"] = { "certificate": ss.serverCertificates.lines() }
                    t0.outbounds[0].streamSettings["tlsSettings"] = t2
                    t0.outbounds[0].settings.vnext[0].users[0]["flow"] = ss.serverFlowVision
                    break
                }
                case "xtls": {
                    let t2 = {
                        "serverName": ss.serverSNI,
                        "allowInsecure": ss.serverAllowInsecure,
                    }
                    if (ss.serverCertificates.isNotBlank()) t2["certificates"] = { "certificate": ss.serverCertificates.lines() }
                    t0.outbounds[0].streamSettings["xtlsSettings"] = t2
                    t0.outbounds[0].settings.vnext[0].users[0]["flow"] = ss.serverFlow
                    break
                }
            }

            let v = {}
            v.nekoCommands = ["%exe%", "-config", "config.json"]

            v.nekoRunConfigs = [
                {
                    "name": "config.json",
                    "content": JSON.stringify(t0)
                }
            ]

            return JSON.stringify(v)
        } catch (error) {
            neko.logError(error.toString())
        }
    }
}

export const vless = new vlessClass()
