import { util } from "../common/util.js"
import { brook } from "./brook.js"
import { LANG } from "../common/translate.js"

// Init

export function nekoInit(b64Str) {
    let args = util.decodeB64Str(b64Str)

    //TODO
    console.log(args)

    LANG = args.lang

    let plgConfig = {
        "ok": true,
        "reason": "",
        "minVersion": 1,
        "protocols": [
            {
                "protocolId": "brook",
                "links": ["brook://"],
                "haveStandardLink": true,
                "canShare": true,
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
    if (protocolId == "brook") {
        return brook
    }
}

// export interface to browser
global_export("nekoInit", nekoInit)
global_export("nekoProtocol", nekoProtocol)
