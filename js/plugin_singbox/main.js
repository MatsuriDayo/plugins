import {util} from "../common/util.js";
import {LANG, LANG_TR} from "../common/translate.js";

import {wireguard} from "./wireguard.js";
import {shadowsocks, shadowTls} from "./shadowsocks.js";
import {hysteria} from "./hysteria";

// Init

export function nekoInit(b64Str) {
    let args = util.decodeB64Str(b64Str);

    LANG = args.lang;

    let plgConfig = {
        ok: true,
        reason: "",
        minVersion: 2,
        protocols: [
            {
                protocolId: "Shadowsocks",
                haveStandardLink: false,
                canShare: false,
                canMux: false,
                canMapping: true,
                canTCPing: true,
                canICMPing: true,
                needBypassRootUid: false,
            },
            {
                protocolId: "ShadowTLS",
                haveStandardLink: false,
                canShare: false,
                canMux: false,
                canMapping: true,
                canTCPing: true,
                canICMPing: true,
                needBypassRootUid: false,
            },
            {
                protocolId: "WireGuard",
                haveStandardLink: false,
                canShare: false,
                canMux: false,
                canMapping: true,
                canTCPing: false,
                canICMPing: true,
                needBypassRootUid: false,
            }, {
                protocolId: "Hysteria",
                haveStandardLink: false,
                canShare: false,
                canMux: false,
                canMapping: true,
                canTCPing: false,
                canICMPing: true,
                needBypassRootUid: false,
            },
        ],
    };
    return JSON.stringify(plgConfig);
}

export function nekoProtocol(protocolId) {
    if (protocolId === "Shadowsocks") {
        return shadowsocks;
    } else if (protocolId === "ShadowTLS") {
        return shadowTls;
    } else if (protocolId === "WireGuard") {
        return wireguard;
    } else if (protocolId === "Hysteria") {
        return hysteria;
    }
}

export function nekoAbout() {
    switch (LANG_TR()) {
        case "zh_CN":
            return "作者：杰洛特\n" +
                "GitHub: https://github.com/mliyuanbiao\n" +
                "这个插件是实验性的。如果在使用过程中遇到任何问题，请自行解决。"
        default:
            return "Author: 杰洛特\n" +
                "GitHub: https://github.com/mliyuanbiao\n" +
                "This plugin is experimental. If you have any problems during use, please solve them yourself."
    }
}

// export interface to browser
global_export("nekoInit", nekoInit)
global_export("nekoProtocol", nekoProtocol)
global_export("nekoAbout", nekoAbout)
