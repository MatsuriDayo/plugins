import {util} from "../common/util.js";
import {commomClass} from "../common/common.js";
import {TR} from "../common/translate.js";

class hysteriaClass {
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
        // hysteria
        this.defaultSharedStorage.serverObfs = "";
        this.defaultSharedStorage.serverAuthType = "STRING";
        this.defaultSharedStorage.serverAuthPayload = "";
        this.defaultSharedStorage.serverSNI = "";
        this.defaultSharedStorage.serverALPN = "";
        this.defaultSharedStorage.serverCertificates = "";
        this.defaultSharedStorage.serverAllowInsecure = false;
        this.defaultSharedStorage.serverUploadSpeed = "10";
        this.defaultSharedStorage.serverDownloadSpeed = "50";
        this.defaultSharedStorage.serverStreamReceiveWindow = "";
        this.defaultSharedStorage.serverConnectionReceiveWindow = "";
        this.defaultSharedStorage.serverDisableMtuDiscovery = false;

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

    _setShareLink() {
    }

    // UI Interface

    requirePreferenceScreenConfig() {
        var sb = [
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
                    {
                        type: "EditTextPreference",
                        key: "serverObfs",
                        icon: "ic_baseline_texture_24",
                        summaryProvider: "PasswordSummaryProvider",
                    }, {
                        type: "SimpleMenuPreference",
                        key: "serverAuthType",
                        icon: "ic_baseline_compare_arrows_24",
                        entries: {
                            "": "已停用",
                            "STRING": "STRING",
                            "BASE64": "BASE64",
                        },
                    }, {
                        type: "EditTextPreference",
                        key: "serverAuthPayload",
                        icon: "ic_settings_password",
                        summaryProvider: "PasswordSummaryProvider",
                    }, {
                        type: "EditTextPreference",
                        key: "serverSNI",
                        icon: "ic_action_copyright",
                    },
                    {
                        type: "EditTextPreference",
                        key: "serverALPN",
                        icon: "ic_baseline_legend_toggle_24",
                    },
                    {
                        type: "EditTextPreference",
                        key: "serverCertificates",
                        icon: "ic_baseline_vpn_key_24",
                    },
                    {
                        "type": "SwitchPreference",
                        "key": "serverAllowInsecure",
                        "icon": "ic_baseline_warning_24",
                        "summary": TR("serverAllowInsecure_summary")
                    },
                    {
                        type: "EditTextPreference",
                        key: "serverUploadSpeed",
                        icon: "ic_file_file_upload",
                    },
                    {
                        type: "EditTextPreference",
                        key: "serverDownloadSpeed",
                        icon: "ic_baseline_download_24",
                    },
                    {
                        type: "EditTextPreference",
                        key: "serverStreamReceiveWindow",
                        icon: "ic_baseline_texture_24",
                    },
                    {
                        type: "EditTextPreference",
                        key: "serverConnectionReceiveWindow",
                        icon: "ic_baseline_transform_24",
                    },
                    {
                        type: "SwitchPreference",
                        key: "serverDisableMtuDiscovery",
                        icon: "ic_baseline_multiple_stop_24",
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

    // 设置界面创建后调用
    onPreferenceCreated() {
        let this2 = this

        function listenOnPreferenceChangedNow(key) {
            neko.listenOnPreferenceChanged(key)
            this2._onPreferenceChanged(key, this2.sharedStorage[key])
        }

        listenOnPreferenceChangedNow("serverAuthType")
    }

    onPreferenceChanged(b64Str) {
        let args = util.decodeB64Str(b64Str)
        this._onPreferenceChanged(args.key, args.newValue)
    }

    _onPreferenceChanged(key, newValue) {
        if (key === "serverAuthType") {
            if (newValue.isBlank()) {
                neko.setPreferenceVisibility("serverAuthPayload", false);
                this.defaultSharedStorage.serverAuthPayload = "";
                this.sharedStorage.serverAuthPayload = "";
            } else {
                neko.setPreferenceVisibility("serverAuthPayload", true);
            }
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

    // Interface

    parseShareLink(b64Str) {
    }

    buildAllConfig(b64Str) {
        try {
            let args = util.decodeB64Str(b64Str);
            let ss = util.decodeB64Str(args.sharedStorage);

            let t0 = {
                log: {
                    disabled: false,
                    level: "warn",
                    timestamp: true,
                },
                inbounds: [
                    {
                        type: "socks",
                        tag: "socks-in",
                        listen: "127.0.0.1",
                        listen_port: args.port,
                    },
                ],
                outbounds: [{
                    "type": "hysteria",
                    "tag": "hysteria-out",
                    "server": args.finalAddress,
                    "server_port": args.finalPort,
                    "up_mbps": parseInt(ss.serverUploadSpeed, 10),
                    "down_mbps": parseInt(ss.serverDownloadSpeed, 10),
                    "obfs": ss.serverObfs,
                    "auth": ss.serverAuthType === "BASE64" ? ss.serverAuthPayload : null,
                    "auth_str": ss.serverAuthType === "STRING" ? ss.serverAuthPayload : null,
                    "recv_window_conn": parseInt(ss.serverConnectionReceiveWindow, 10),
                    "recv_window": parseInt(ss.serverStreamReceiveWindow, 10),
                    "disable_mtu_discovery": ss.serverDisableMtuDiscovery,
                    "tls": {
                        "enabled": true,
                        "server_name": ss.serverSNI,
                        "alpn": [],
                        "disable_sni": ss.serverSNI.isBlank(),
                        "insecure": ss.serverAllowInsecure,
                        "certificate": ss.serverCertificates,
                    },
                }],
            };
            if (ss.serverALPN.isNotBlank()) {
                t0.outbounds.forEach(function (item) {
                    item.tls.alpn.push(ss.serverALPN)
                })
            }
            let v = {};
            v.nekoCommands = ["%exe%", "run", "--config", "config.json"];
            v.nekoRunConfigs = [{
                name: "config.json",
                content: JSON.stringify(t0),
            },];
            return JSON.stringify(v);
        } catch (error) {
            neko.logError(error.toString());
        }
    }
}

export const hysteria = new hysteriaClass();
