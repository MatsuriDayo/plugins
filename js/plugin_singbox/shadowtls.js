import { util } from "../common/util.js";
import { commomClass } from "../common/common.js";
import { TR } from "../common/translate.js";

class shadowTlsClass {
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
    this.defaultSharedStorage.serverMethod = "2022-blake3-aes-128-gcm";
    this.defaultSharedStorage.serverPassword = "";
    this.defaultSharedStorage.shadowTlsServerName = "";
    this.defaultSharedStorage.shadowTlsServerPassword = "";
    this.defaultSharedStorage.shadowTlsVersion = "2";
    this.defaultSharedStorage.utlsEnabled = false;
    this.defaultSharedStorage.utlsFingerprint = "chrome";

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

  _setShareLink() { }

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
              3: "3"
            },
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
            },
          },
          {
            type: "EditTextPreference",
            key: "serverPassword",
            icon: "ic_settings_password",
            summaryProvider: "PasswordSummaryProvider",
          },
          {
            type: "SimpleMenuPreference",
            key: "utlsEnabled",
            icon: "ic_baseline_vpn_key_24",
            entries: {
              "true": "true",
              "false": "false",
            },
          },
          {
            type: "SimpleMenuPreference",
            key: "utlsFingerprint",
            icon: "ic_baseline_fiber_manual_record_24",
            entries: {
                "chrome": "chrome",
                "firefox": "firefox",
                "edge": "edge",
                "safari": "safari",
                "360": "360",
                "qq": "qq",
                "ios": "ios",
                "android": "android",
                "random": "random",
            }
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

    listenOnPreferenceChangedNow("utlsEnabled")
    listenOnPreferenceChangedNow("shadowTlsVersion")
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
    if (key == "utlsEnabled") {
      neko.setPreferenceVisibility("utlsFingerprint", false)
      if (newValue == "true") {
        neko.setPreferenceVisibility("utlsFingerprint", true)
      }
    } else if (key == "shadowTlsVersion") {
      neko.setPreferenceVisibility("shadowTlsServerPassword", true)
      if (newValue == "1") {
        neko.setPreferenceVisibility("shadowTlsServerPassword", false)
      }
    }
  }

  // Interface

  parseShareLink(b64Str) { }

  buildAllConfig(b64Str) {
    try {
      let args = util.decodeB64Str(b64Str);
      let ss = util.decodeB64Str(args.sharedStorage);

      // convert string to boolean
      if (ss.utlsEnabled === "true"){
        ss.utlsEnabled = true
      } else {
        ss.utlsEnabled = false
      }

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
        outbounds: [
          {
            type: "shadowsocks",
            method: ss.serverMethod,
            password: ss.serverPassword,
            detour: "shadowtls-out",
            multiplex: {
              enabled: true,
              max_connections: 4,
              min_streams: 4,
            },
          },
          {
            type: "shadowtls",
            tag: "shadowtls-out",
            server: args.finalAddress,
            server_port: args.finalPort,
            version: parseInt(ss.shadowTlsVersion, 10),
            password: ss.shadowTlsServerPassword,
            tls: {
              enabled: true,
              server_name: ss.shadowTlsServerName,
              utls: {
                enabled: ss.utlsEnabled,
                fingerprint: ss.utlsFingerprint
              }
            },
          },
        ],
      };

      // check shadowTlsVersion if = 1, remove password entity from config
      if (ss.shadowTlsVersion == 1) {
        delete t0.outbounds[1].password;
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

export const shadowTls = new shadowTlsClass();
