import { util } from "../common/util.js"
import { LANG, LANG_TR } from "../common/translate.js"

import { vless } from "./vless.js"
import { ss2022 } from "./ss2022.js"

// Init

export function nekoInit(b64Str) {
    let args = util.decodeB64Str(b64Str)

    LANG = args.lang

    let plgConfig = {
        "ok": true,
        "reason": "",
        "minVersion": 2,
        "protocols": [
            {
                "protocolId": "VLESS",
                "links": ["vless://"],
                "haveStandardLink": true,
                "canShare": true,
                "canMux": true,
                "canMapping": true,
                "canTCPing": true,
                "canICMPing": true,
                "needBypassRootUid": false,
            },
            {
                "protocolId": "Shadowsocks-2022",
                "haveStandardLink": false,
                "canShare": false,
                "canMux": false,
                "canMapping": true,
                "canTCPing": true,
                "canICMPing": true,
                "needBypassRootUid": false,
            }
        ]
    }
    return JSON.stringify(plgConfig)
}

export function nekoProtocol(protocolId) {
    if (protocolId == "VLESS") {
        return vless
    }
    if (protocolId == "Shadowsocks-2022") {
        return ss2022
    }
}

export function nekoAbout() {
    switch (LANG_TR()) {
        case "zh_CN":
            return "这个插件是实验性的。如果在使用过程中遇到任何问题，请自行解决。"
        default:
            return "This plugin is experimental. If you have any problems during use, please solve them yourself."
    }
}

// export interface to browser
global_export("nekoInit", nekoInit)
global_export("nekoProtocol", nekoProtocol)
global_export("nekoAbout", nekoAbout)
