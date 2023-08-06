import { util } from "../common/util.js";
import { commomClass } from "../common/common.js";
import { TR } from "../common/translate.js";

class juicityClass {
    constructor() {
        this.sharedStorage = {};
        this.defaultSharedStorage = {};
        this.common = new commomClass();
    }

    _initDefaultSharedStorage() {
        // start of default keys
        this.defaultSharedStorage.jsVersion = 1;
        this.defaultSharedStorage.name = "";
        this.defaultSharedStorage.serverAddress = "127.0.0.1";
        this.defaultSharedStorage.serverPort = "1080";
        // end of default keys
        this.defaultSharedStorage.uuid = "00000000-0000-0000-0000-000000000000";
        this.defaultSharedStorage.password = "";
        this.defaultSharedStorage.sni = "";
        this.defaultSharedStorage.allowInsecure = false;
        this.defaultSharedStorage.congestionControl = "bbr";

        for (var k in this.defaultSharedStorage) {
            let v = this.defaultSharedStorage[k];
            this.common._setType(k, typeof v);

            if (!this.sharedStorage.hasOwnProperty(k)) {
                this.sharedStorage[k] = v;
            }
        }
    }

    _onSharedStorageUpdated() {
        // not null
        for (var k in this.sharedStorage) {
            if (this.sharedStorage[k] == null) {
                this.sharedStorage[k] = "";
            }
        }
        this._setShareLink();
    }

    // 生成并存储 share link
    _setShareLink() {
        var builder = util.newURL("juicity")
        if (this.sharedStorage.name.isNotBlank()) builder.hash = "#" + encodeURIComponent(this.sharedStorage.name)
        builder.host = util.wrapUri(this.sharedStorage.serverAddress, this.sharedStorage.serverPort)
        builder.username = this.sharedStorage.uuid
        builder.password = this.sharedStorage.password
        if (this.sharedStorage.congestionControl.isNotBlank()) {
            builder.searchParams.set("congestion_control", this.sharedStorage.congestionControl)
        }
        if (this.sharedStorage.sni.isNotBlank()) {
            builder.searchParams.set("sni", this.sharedStorage.sni)
        }
        if (this.sharedStorage.allowInsecure) {
            builder.searchParams.set("allow_insecure", "1")
        }
        this.sharedStorage.shareLink = builder.toString()
    }

    // UI Interface

    requirePreferenceScreenConfig() {
        let sb = [
            {
                title: TR("serverSettings"),
                preferences: [
                    {
                        type: "EditTextPreference",
                        key: "serverAddress",
                        icon: "ic_hardware_router",
                    },
                    {
                        type: "EditTextPreference",
                        key: "serverPort",
                        icon: "ic_maps_directions_boat",
                        EditTextPreferenceModifiers: "Port",
                    },
                    //
                    {
                        "type": "EditTextPreference",
                        "key": "uuid",
                        "icon": "ic_baseline_person_24",
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "password",
                        "icon": "ic_settings_password",
                        "summaryProvider": "PasswordSummaryProvider",
                    },
                    //
                    {
                        "type": "EditTextPreference",
                        "key": "sni",
                        "icon": "ic_action_copyright"
                    },
                    {
                        "type": "SwitchPreference",
                        "key": "allowInsecure",
                        "icon": "ic_notification_enhanced_encryption",
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "congestionControl",
                        "icon": "ic_baseline_stream_24",
                    },
                ],
            },
        ];
        this.common._applyTranslateToPreferenceScreenConfig(sb, TR);
        return JSON.stringify(sb);
    }

    // 开启设置界面时调用
    setSharedStorage(b64Str) {
        this.sharedStorage = util.decodeB64Str(b64Str);
        this._initDefaultSharedStorage();
    }

    // 开启设置界面时调用
    requireSetProfileCache() {
        for (var k in this.defaultSharedStorage) {
            this.common.setKV(k, this.sharedStorage[k]);
        }
    }
    // 开启设置界面时调用

    // 设置界面创建后调用
    onPreferenceCreated() {
        let this2 = this

        function listenOnPreferenceChangedNow(key) {
            neko.listenOnPreferenceChanged(key)
            this2._onPreferenceChanged(key, this2.sharedStorage[key])
        }
    }

    // 保存时调用（混合编辑后的值）
    sharedStorageFromProfileCache() {
        for (var k in this.defaultSharedStorage) {
            this.sharedStorage[k] = this.common.getKV(k);
        }
        this._onSharedStorageUpdated();
        return JSON.stringify(this.sharedStorage);
    }

    // 用户修改 preference 时调用
    onPreferenceChanged(b64Str) {
        let args = util.decodeB64Str(b64Str)
        this._onPreferenceChanged(args.key, args.newValue)
    }

    _onPreferenceChanged(key, newValue) {
    }

    // Interface

    parseShareLink(b64Str) {
        let args = util.decodeB64Str(b64Str)

        this.sharedStorage = {}
        this._initDefaultSharedStorage()

        var url = util.tryParseURL(args.shareLink)
        if (typeof url == "string") return url // error string

        var serverAddress = util.unwrapIpv6(url.hostname)
        this.sharedStorage.serverAddress = serverAddress
        this.sharedStorage.serverPort = url.host.replace(serverAddress, "").substringAfter(":")
        this.sharedStorage.uuid = url.username
        this.sharedStorage.password = url.password
        this.sharedStorage.name = decodeURIComponent(url.hash.substringAfter("#"))

        util.ifNotNull(url.searchParams.get("congestion_control"), (it) => {
            this.sharedStorage.congestionControl = it
        })
        util.ifNotNull(url.searchParams.get("sni"), (it) => {
            this.sharedStorage.sni = it
        })
        util.ifNotNull(url.searchParams.get("allow_insecure"), (it) => {
            if (it == "1" || it == "true") this.sharedStorage.allowInsecure = it
        })

        this._onSharedStorageUpdated()
        return JSON.stringify(this.sharedStorage)
    }

    buildAllConfig(b64Str) {
        try {
            let args = util.decodeB64Str(b64Str);
            let ss = util.decodeB64Str(args.sharedStorage);

            let configObject = {
                "listen": "127.0.0.1:" + args.port,
                "server": util.wrapUri(ss.serverAddress, ss.serverPort),
                "uuid": ss.uuid,
                "password": ss.password,
                "sni": ss.sni,
                "allow_insecure": ss.allowInsecure,
                "congestion_control": ss.congestionControl,
                "log_level": "info",
                "protect_path": "protect_path"
            };

            let v = {};
            v.nekoCommands = ["%exe%", "run", "-c", "config.json"];
            v.nekoRunConfigs = [
                {
                    name: "config.json",
                    content: JSON.stringify(configObject),
                },
            ];
            return JSON.stringify(v);
        } catch (error) {
            neko.logError(error.toString());
        }
    }
}

export const juicity = new juicityClass();
