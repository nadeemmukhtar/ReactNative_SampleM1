import DefaultPreference from 'react-native-default-preference';

export const PrefKeys = {
    USER_ID: 'user_id',
    ACCESS_TOKEN: 'access_token',
    USER_IMAGE: 'user_image',
    USER_NAME: 'user_name',
    USER_OBJ: 'user_obj',
    USER_LAT: 'user_lat',
    USER_LNG: 'user_lng',
    LOGIN_TYPE: 'login_type',
    USER_TYPE: 'user_type',
};


export function setPrefs(object) {
    DefaultPreference.setMultiple(object).then(function () {
    });
}

export function setPref(key, value) {
    DefaultPreference.set(key, value).then(function () {
        //console.log(key + ' saved');
    });
}

export function getPref(key, callback) {
    //console.log(key + ' getting');
    DefaultPreference.get(key).then(function (value) {
        callback(value)
    });
}

export function getUserData(callback) {
    getPref(PrefKeys.USER_ID, function (userId) {
        getPref(PrefKeys.ACCESS_TOKEN, function (accessToken) {
            callback(userId, accessToken);
        });
    });
}
export function clearPrefs(callback) {
    DefaultPreference.clearAll().then(function(){
        callback();
    });
}