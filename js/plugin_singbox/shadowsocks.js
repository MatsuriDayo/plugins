import {util} from "../common/util.js";
import {commomClass} from "../common/common.js";
import {TR} from "../common/translate.js";

class ssClass {

    constructor(isShadowTls) {
        this.sharedStorage = {};
        this.defaultSharedStorage = {};
        this.common = new commomClass();
        this.isShadowTls = isShadowTls
    }

    _initDefaultSharedStorage() {
        // start of default keys
        this.defaultSharedStorage.jsVersion = 1;
        this.defaultSharedStorage.name = "";
        this.defaultSharedStorage.serverAddress = "127.0.0.1";
        this.defaultSharedStorage.serverPort = "1080";
        // end of default keys
        this.defaultSharedStorage.serverMethod = "2022-blake3-aes-128-gcm";
        this.defaultSharedStorage.serverPassword = "";
        this.defaultSharedStorage.serverPlugin = "";
        this.defaultSharedStorage.serverPluginConfigure = "";
        this.defaultSharedStorage.serverUdpOverTcp = false;
        // shadow-tls
        this.defaultSharedStorage.shadowTlsServerName = "";
        this.defaultSharedStorage.shadowTlsServerPassword = "";
        this.defaultSharedStorage.shadowTlsVersion = "2";
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
                        type: "SimpleMenuPreference",
                        key: "serverMethod",
                        icon: "ic_notification_enhanced_encryption",
                        entries: {
                            "2022-blake3-aes-128-gcm": "2022-blake3-aes-128-gcm",
                            "2022-blake3-aes-256-gcm": "2022-blake3-aes-256-gcm",
                            "2022-blake3-chacha20-poly1305": "2022-blake3-chacha20-poly1305",
                            "aes-128-gcm": "aes-128-gcm",
                            "aes-192-gcm": "aes-192-gcm",
                            "aes-256-gcm": "aes-256-gcm",
                            "chacha20-ietf-poly1305": "chacha20-ietf-poly1305",
                            "xchacha20-ietf-poly1305": "xchacha20-ietf-poly1305",
                            none: "none",
                        },
                    },
                    {
                        type: "EditTextPreference",
                        key: "serverPassword",
                        icon: "ic_settings_password",
                        summaryProvider: "PasswordSummaryProvider",
                    },
                    {
                        "type": "SwitchPreference",
                        "key": "serverUdpOverTcp",
                        "icon": "baseline_wrap_text_24",
                        "summary": TR("serverUdpOverTcp_summary")
                    },
                ],
            },
            {
                title: TR("serverPlugin"),
                preferences: [
                    {
                        type: "SimpleMenuPreference",
                        key: "serverPlugin",
                        icon: "ic_baseline_legend_toggle_24",
                        entries: {
                            "": "",
                            "obfs-local": "obfs-local",
                            "v2ray-plugin": "v2ray-plugin",
                        },
                    },
                    {
                        type: "EditTextPreference",
                        key: "serverPluginConfigure",
                        icon: "ic_action_settings",
                    },
                ],
            },
        ];
        if (this.isShadowTls) {
            sb.push({
                title: TR("serverShadowTls"),
                preferences: [
                    {
                        type: "EditTextPreference",
                        key: "shadowTlsServerName",
                        icon: "ic_action_copyright",
                    },
                    {
                        type: "EditTextPreference",
                        key: "shadowTlsServerPassword",
                        icon: "ic_settings_password",
                        summaryProvider: "PasswordSummaryProvider",
                    },
                    {
                        type: "SimpleMenuPreference",
                        key: "shadowTlsVersion",
                        icon: "ic_baseline_layers_24",
                        entries: {
                            1: "1",
                            2: "2",
                        },
                    },
                ],
            })
        }
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
                outbounds: [],
            };
            if (this.isShadowTls) {
                t0.outbounds.push({
                    type: "shadowsocks",
                    method: ss.serverMethod,
                    password: ss.serverPassword,
                    plugin: ss.serverPlugin,
                    plugin_opts: ss.serverPluginConfigure,
                    udp_over_tcp: ss.serverUdpOverTcp,
                    detour: "shadowtls-out",
                }, {
                    type: "shadowtls",
                    tag: "shadowtls-out",
                    server: args.finalAddress,
                    server_port: args.finalPort,
                    version: parseInt(ss.shadowTlsVersion, 10),
                    password: ss.shadowTlsServerPassword,
                    tls: {
                        enabled: true,
                        server_name: ss.shadowTlsServerName,
                    },
                },)
            } else {
                t0.outbounds.push({
                    type: "shadowsocks",
                    server: args.finalAddress,
                    server_port: args.finalPort,
                    method: ss.serverMethod,
                    password: ss.serverPassword,
                    plugin: ss.serverPlugin,
                    plugin_opts: ss.serverPluginConfigure,
                    udp_over_tcp: ss.serverUdpOverTcp,
                },)
            }
            let v = {};
            v.nekoCommands = ["%exe%", "run", "--config", "config.json"];
            v.nekoRunConfigs = [
                {
                    name: "config.json",
                    content: JSON.stringify(t0),
                },
            ];

            return JSON.stringify(v);
        } catch (error) {
            neko.logError(error.toString());
        }
    }
}

export const shadowsocks = new ssClass(false);
export const shadowTls = new ssClass(true);
