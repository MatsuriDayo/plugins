import { vless } from "./vless.js"
import { ss2022 } from "./ss2022.js"
import { util } from "../common/util.js"
import { LANG } from "./translate.js"

// Init

export function nekoInit(b64Str) {
    let args = util.decodeB64Str(b64Str)

    LANG = args.lang

    let plgConfig = {
        "ok": true,
        "reason": "",
        "minVersion": 1,
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

// export interface to browser
try {
    window.nekoInit = nekoInit
    window.nekoProtocol = nekoProtocol
} catch (error) {

}
