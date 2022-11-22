export class commomClass {
    constructor() {
        this.typeMap = {}
    }

    getKV(key) {
        let jsonStr = neko.getKV(this.typeMap[key], key)
        let v = JSON.parse(jsonStr)
        return v.v
    }
    setKV(key, obj) {
        let v = { "v": obj }
        let jsonStr = JSON.stringify(v)
        neko.setKV(this.typeMap[key], key, jsonStr)
    }

    _setType(k, type) {
        if (type == 'string') {
            this.typeMap[k] = 4
        } else if (type == 'boolean') {
            this.typeMap[k] = 0
        } else if (type == 'number') { //TODO int
            this.typeMap[k] = 2
            // 但是preference大多是不用int的
        }
    }

    _applyTranslateToPreferenceScreenConfig(sb, TR) {
        sb.forEach((category) => {
            if (category["title"] == null) {
                category["title"] = TR(category["key"])
            }
            category.preferences.forEach((preference) => {
                if (preference["title"] == null) {
                    preference["title"] = TR(preference["key"])
                }
            })
        })
    }
}
