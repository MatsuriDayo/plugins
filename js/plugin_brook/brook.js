import { util } from "../common/util.js";
import { commomClass } from "../common/common.js"
import { TR } from "../common/translate.js"

class brookClass {
    constructor() {
        this.sharedStorage = {}
        this.defaultSharedStorage = {}
        this.common = new commomClass()
    }

    _initDefaultSharedStorage() {
        // start of default keys
        this.defaultSharedStorage.jsVersion = 1
        this.defaultSharedStorage.name = ""
        this.defaultSharedStorage.serverAddress = "127.0.0.1"
        this.defaultSharedStorage.serverPort = "1080"
        // end of default keys
        this.defaultSharedStorage.serverProtocol = "default"
        this.defaultSharedStorage.serverPassword = ""
        this.defaultSharedStorage.serverPath = ""
        this.defaultSharedStorage.serverAllowInsecure = false
        this.defaultSharedStorage.withoutBrookProtocol = false
        this.defaultSharedStorage.udpovertcp = false


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
    }

    _setShareLink() {
        var builder = util.newURL("brook")

        var serverString = util.wrapUri(this.sharedStorage.serverAddress, this.sharedStorage.serverPort)
        var wsPath = this.sharedStorage.serverPath

        if (this.sharedStorage.serverProtocol.startsWith("ws")) {
            if (wsPath.isNotBlank() && wsPath != "/") {
                if (!wsPath.startsWith("/")) wsPath = "/" + wsPath
                serverString += wsPath
            }
        }

        switch (this.sharedStorage.serverProtocol) {
            case "ws": {
                builder.host = "wsserver"
                builder.searchParams.set("wsserver", serverString)
                break
            }
            case "wss": {
                builder.host = "wssserver"
                builder.searchParams.set("wssserver", serverString)
                break
            }
            default: {
                builder.host = "server"
                builder.searchParams.set("server", serverString)
            }
        }

        if (this.sharedStorage.serverPassword.isNotBlank()) {
            builder.searchParams.set("password", this.sharedStorage.serverPassword)
        }
        if (this.sharedStorage.name.isNotBlank()) {
            builder.searchParams.set("remarks", this.sharedStorage.name)
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
                        "type": "SimpleMenuPreference",
                        "key": "serverProtocol",
                        "icon": "ic_baseline_compare_arrows_24",
                        "entries": {
                            "default": "DEFAULT",
                            "ws": "WS",
                            "wss": "WSS",
                        }
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "serverPassword",
                        "icon": "ic_settings_password",
                        "summaryProvider": "PasswordSummaryProvider",
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "serverPath",
                        "title": TR("serverPath_ws"),
                        "icon": "ic_baseline_format_align_left_24",
                    },
                    {
                        "type": "SwitchPreference",
                        "key": "serverAllowInsecure",
                        "icon": "ic_baseline_warning_24",
                        "summary": TR("serverAllowInsecure_summary")
                    },
                    {
                        "type": "SwitchPreference",
                        "key": "withoutBrookProtocol",
                        "icon": "baseline_public_24",
                        "summary": TR("withoutBrookProtocol_summary")
                    },
                    {
                        "type": "SwitchPreference",
                        "key": "udpovertcp",
                        "icon": "baseline_wrap_text_24",
                    },
                ]
            },
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

        listenOnPreferenceChangedNow("serverProtocol")
    }

    // 保存时调用（混合编辑后的值）
    sharedStorageFromProfileCache() {
        for (var k in this.defaultSharedStorage) {
            this.sharedStorage[k] = this.common.getKV(k)
        }
        this._onSharedStorageUpdated()
        return JSON.stringify(this.sharedStorage)
    }

    onPreferenceChanged(b64Str) {
        let args = util.decodeB64Str(b64Str)
        this._onPreferenceChanged(args.key, args.newValue)
    }

    _onPreferenceChanged(key, newValue) {
        if (key == "serverProtocol") {
            if (newValue == "wss") {
                neko.setPreferenceVisibility("serverAllowInsecure", true)
            } else {
                neko.setPreferenceVisibility("serverAllowInsecure", false)
            }
            if (newValue == "default") {
                neko.setPreferenceVisibility("serverPath", false)
                neko.setPreferenceVisibility("withoutBrookProtocol", false)
                neko.setPreferenceVisibility("udpovertcp", true)
            } else {
                neko.setPreferenceVisibility("serverPath", true)
                neko.setPreferenceVisibility("withoutBrookProtocol", true)
                neko.setPreferenceVisibility("udpovertcp", false)
            }
        }
    }

    // Interface

    parseShareLink(b64Str) {
        let args = util.decodeB64Str(b64Str)

        this.sharedStorage = {}
        this._initDefaultSharedStorage()

        var link = util.tryParseURL(args.shareLink)
        if (typeof link == "string") return link

        this.sharedStorage.name = link.searchParams.get("remarks")

        switch (link.host) {
            case "server": {
                this.sharedStorage.serverProtocol = "default"

                var server = link.searchParams.get("server")
                if (server == null) return "Invalid brook server url (Missing server parameter)"

                this.sharedStorage.serverAddress = server.substringBefore(":")
                this.sharedStorage.serverPort = server.substringAfter(":").toInt()
                var password = link.searchParams.get("password")
                if (password == null) ("Invalid brook server url (Missing password parameter)")

                this.sharedStorage.serverPassword = password
                break
            }
            case "wsserver": {
                this.sharedStorage.serverProtocol = "ws"

                var wsserver = link.searchParams.get("wsserver")
                if (wsserver == null) return "Invalid brook wsserver url (Missing wsserver parameter)"

                wsserver = wsserver.substringAfter("://")

                if (wsserver.contains("/")) {
                    this.sharedStorage.serverPath = "/" + wsserver.substringAfter("/")
                    wsserver = wsserver.substringBefore("/")
                }

                this.sharedStorage.serverAddress = wsserver.substringBefore(":")
                this.sharedStorage.serverPort = wsserver.substringAfter(":").toInt()

                var password = link.searchParams.get("password")
                if (password == null) ("Invalid brook wsserver url (Missing password parameter)")

                this.sharedStorage.serverPassword = password
                break
            }
            case "wssserver": {
                this.sharedStorage.serverProtocol = "wss"

                var wsserver = link.searchParams.get("wssserver")
                if (wsserver == null) return "Invalid brook wssserver url (Missing wssserver parameter)"

                wsserver = wsserver.substringAfter("://")

                if (wsserver.contains("/")) {
                    this.sharedStorage.serverPath = "/" + wsserver.substringAfter("/")
                    wsserver = wsserver.substringBefore("/")
                }

                this.sharedStorage.serverAddress = wsserver.substringBefore(":")
                this.sharedStorage.serverPort = wsserver.substringAfter(":").toInt()

                var password = link.searchParams.get("password")
                if (password == null) ("Invalid brook wssserver url (Missing password parameter)")

                this.sharedStorage.serverPassword = password
                break
            }
        }

        this._onSharedStorageUpdated()
        return JSON.stringify(this.sharedStorage)
    }

    buildAllConfig(b64Str) {
        try {
            let args = util.decodeB64Str(b64Str)
            let cs = util.decodeB64Str(args.sharedStorage)

            console.log(args, cs)

            let v = {}
            v.nekoCommands = ["%exe%"]

            switch (cs.serverProtocol) {
                case "ws": {
                    v.nekoCommands.push("wsclient")
                    v.nekoCommands.push("--wsserver")
                    break
                }
                case "wss": {
                    v.nekoCommands.push("wssclient")
                    v.nekoCommands.push("--wssserver")
                    break
                }
                default: {
                    v.nekoCommands.push("client")
                    v.nekoCommands.push("--server")
                }
            }

            let internalUri = util.wrapUri(args.finalAddress, args.finalPort)

            switch (cs.serverProtocol) {
                case "ws": {
                    internalUri = "ws://" + util.wrapUri(cs.serverAddress, args.finalPort)
                    break
                }
                case "wss": {
                    internalUri = "wss://" + util.wrapUri(cs.serverAddress, args.finalPort)
                    break
                }
            }

            if (cs.serverPath.isNotBlank()) {
                if (!cs.serverPath.startsWith("/")) {
                    internalUri += "/"
                }
                internalUri += cs.serverPath
            }

            v.nekoCommands.push(internalUri)

            if (cs.serverProtocol.startsWith("ws")) {
                if (cs.withoutBrookProtocol) {
                    v.nekoCommands.push("--withoutBrookProtocol")
                }
                if (cs.serverProtocol == "wss" && cs.serverAllowInsecure) {
                    v.nekoCommands.push("--insecure")
                }
                // Mapping
                v.nekoCommands.push("--address")
                v.nekoCommands.push(util.wrapUri(args.finalAddress, args.finalPort))
            } else {
                if (cs.udpovertcp) {
                    v.nekoCommands.push("--udpovertcp")
                }
            }

            if (cs.serverPassword.isNotBlank()) {
                v.nekoCommands.push("--password")
                v.nekoCommands.push(cs.serverPassword)
            }

            v.nekoCommands.push("--socks5")
            v.nekoCommands.push("127.0.0.1:" + args.port)

            return JSON.stringify(v)
        } catch (error) {
            neko.logError(error.toString())
        }
    }
}

export const brook = new brookClass()
