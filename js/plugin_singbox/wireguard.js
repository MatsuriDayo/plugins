import { util } from "../common/util.js";
import { commomClass } from "../common/common.js";
import { TR } from "./translate.js";
import { Base64 } from "js-base64";

class wireguardClass {
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
    this.defaultSharedStorage.serverLocalAddress = "";
    this.defaultSharedStorage.serverPrivateKey = "";
    this.defaultSharedStorage.serverCertificates = "";
    this.defaultSharedStorage.serverPeerPreSharedKey = "";
    this.defaultSharedStorage.serverMTU = "1420";

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

  _setShareLink() {}

  // UI Interface

  requirePreferenceScreenConfig() {
    let sb = [
      {
        title: TR("serverSettings"),
        preferences: [
          {
            type: "EditTextPreference",
            key: "serverLocalAddress",
            icon: "ic_baseline_domain_24",
          },
          {
            type: "EditTextPreference",
            key: "serverPrivateKey",
            icon: "ic_baseline_vpn_key_24",
          },
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
            key: "serverCertificates",
            icon: "ic_action_copyright",
          },
          {
            type: "EditTextPreference",
            key: "serverPeerPreSharedKey",
            icon: "ic_settings_password",
            summaryProvider: "PasswordSummaryProvider",
          },
          {
            type: "EditTextPreference",
            key: "serverMTU",
            icon: "baseline_public_24",
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
  onPreferenceCreated() {}

  // 保存时调用（混合编辑后的值）
  sharedStorageFromProfileCache() {
    for (var k in this.defaultSharedStorage) {
      this.sharedStorage[k] = this.common.getKV(k);
    }
    this._onSharedStorageUpdated();
    return JSON.stringify(this.sharedStorage);
  }

  // Interface

  parseShareLink(b64Str) {}

  buildAllConfig(b64Str) {
    try {
      let args = util.decodeB64Str(b64Str);
      let wg = util.decodeB64Str(args.sharedStorage);

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
            type: "wireguard",
            tag: "wireguard-out",
            server: args.finalAddress,
            server_port: args.finalPort,
            system_interface: false,
            interface_name: "wg0",
            local_address: wg.serverLocalAddress
              .split("\n")
              .map((item) => item.trim())
              .filter((item) => item.length > 0),
            private_key: wg.serverPrivateKey,
            peer_public_key: wg.serverCertificates,
            pre_shared_key: wg.serverPeerPreSharedKey,
            mtu: parseInt(wg.serverMTU),
          },
        ],
      };

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

export const wireguard = new wireguardClass();
