import { shadowTls } from "./shadowtls.js";
import { util } from "../common/util.js";
import { LANG } from "./translate.js";
import { wireguard } from "./wireguard.js";

// Init

export function nekoInit(b64Str) {
  let args = util.decodeB64Str(b64Str);

  LANG = args.lang;

  let plgConfig = {
    ok: true,
    reason: "",
    minVersion: 1,
    protocols: [
      {
        protocolId: "ShadowTLS",
        haveStandardLink: false,
        canShare: true,
        canMux: false,
        canMapping: true,
        canTCPing: true,
        canICMPing: true,
        needBypassRootUid: false,
      },
      {
        protocolId: "WireGuard",
        haveStandardLink: false,
        canShare: true,
        canMux: false,
        canMapping: true,
        canTCPing: true,
        canICMPing: true,
        needBypassRootUid: false,
      },
    ],
  };
  return JSON.stringify(plgConfig);
}

export function nekoProtocol(protocolId) {
  if (protocolId == "ShadowTLS") {
    return shadowTls;
  } else if (protocolId == "WireGuard") {
    return wireguard;
  }
}

// export interface to browser
try {
  window.nekoInit = nekoInit;
  window.nekoProtocol = nekoProtocol;
} catch (error) {}
