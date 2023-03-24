import { util } from "../common/util.js"
import { commomClass } from "../common/common.js"
import { TR } from "../common/translate.js"

class ss2022Class {
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
        this.defaultSharedStorage.serverMethod = "2022-blake3-aes-128-gcm"
        this.defaultSharedStorage.serverPassword = ""
        // UDP over TCP
        this.defaultSharedStorage.serverUoT = false

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

    _setShareLink() { }

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
                        "key": "serverMethod",
                        "icon": "ic_notification_enhanced_encryption",
                        "entries": {
                            "2022-blake3-aes-128-gcm": "2022-blake3-aes-128-gcm",
                            "2022-blake3-aes-256-gcm": "2022-blake3-aes-256-gcm",
                            "2022-blake3-chacha20-poly1305": "2022-blake3-chacha20-poly1305",
                        }
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "serverPassword",
                        "icon": "ic_baseline_person_24",
                        "summaryProvider": "PasswordSummaryProvider",
                    },
                    {
                        "type": "SwitchPreference",
                        "key": "serverUoT",
                        "icon": "baseline_wrap_text_24",
                        "summary": TR("serverUoT_summary")
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
    onPreferenceCreated() { }

    // 保存时调用（混合编辑后的值）
    sharedStorageFromProfileCache() {
        for (var k in this.defaultSharedStorage) {
            this.sharedStorage[k] = this.common.getKV(k)
        }
        this._onSharedStorageUpdated()
        return JSON.stringify(this.sharedStorage)
    }

    // Interface

    parseShareLink(b64Str) { }

    buildAllConfig(b64Str) {
        try {
            let args = util.decodeB64Str(b64Str)
            let ss = util.decodeB64Str(args.sharedStorage)

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
                        "protocol": "shadowsocks",
                        "settings": {

                            "servers": [
                                {
                                    "address": args.finalAddress,
                                    "port": args.finalPort,
                                    "method": ss.serverMethod,
                                    "password": ss.serverPassword,
                                    "uot": ss.serverUoT,
                                }
                            ]
                        }
                    }
                ]
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

export const ss2022 = new ss2022Class()
