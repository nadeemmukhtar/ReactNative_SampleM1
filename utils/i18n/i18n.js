import I18n from 'react-native-i18n';
import en from './locales/en';
import et from './locales/et';
import he from './locales/he';
import ru from './locales/ru';
import fi from "./locales/fi";
import Preference from 'react-native-preference';
import DeviceInfo from 'react-native-device-info';
import {I18nManager} from "react-native";

var deviceLocale = DeviceInfo.getDeviceLocale();
if (deviceLocale.includes("-")) {
    var devLanguage = deviceLocale.split("-");
    deviceLocale = devLanguage[0];
    console.log("SelectedLanguage1--deviceLocale2--" + deviceLocale);
}

I18n.fallbacks = true;

I18n.translations = {
    en,
    et,
    he,
    ru,
    fi
};


console.log("ScreenDrawer--i18n--" + Preference.get("screenDrawer"));


//I18n.locale = "en";
export default I18n;