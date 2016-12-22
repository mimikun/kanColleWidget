import {Model} from "chomex";

export default class Config extends Model {
    static isNotificationEnabled(purpose) {
        if (!this.find("notification-for-default").enabled) return false;
        let c = this.find(`notification-for-${purpose}`);
        if (c.time > 0) return true;
        return c.enabled;
    }
}
Config.default = {
    "download-folder": {value: "艦これ"},
    "download-file-name": {value: "yyyy-MM-dd-HHmmss"},
    "download-file-ext":  {value: "png"},
    "directly-download-on-capture": {value: false},
    "data-sync": {
        keys: []
    },
    "notification-for-default": {
        label:   "通知",
        enabled: true,
        icon:    null,
        sound:   null,
        volume:  80,
    },
    "notification-for-mission": {
        label:   "▸ 遠征タイマー",
        enabled: true,
        icon:    null,
        sound:   null,
    },
    "notification-for-recovery": {
        label:   "▸ 修復タイマー",
        enabled: true,
        icon:    null,
        sound:   null,
    },
    "notification-for-createship": {
        label:   "▸ 建造タイマー",
        enabled: true,
        icon:    null,
        sound:   null,
    },
    "notification-for-tiredness": {
        label:   "▸ 疲労タイマー",
        icon:    null,
        sound:   null,
        time:    15,
        description: "出撃からの固定時間通知です",
    },
    "schedule-display-mode": {
        value: "separated-ids", // separated-timeline, merged-timeline
    },
    "time-format": {
        value: "clock", // rest
    },
    "damageshapshot-window": {
        value: "disabled"
    },
    "debug": {
        value: false
    }
};
