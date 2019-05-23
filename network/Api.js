import ApiUtils from './ApiUtils';
import {constants} from "../config/constants";
import I18n from '../utils/i18n'

const API_LOGIN = "/home/login";
const API_FORGOT_PASS = "/home/forgot_password";
const API_USER_GUIDES = "/client/pdf_guide";
const API_PHASES = '/phase/get_phases';
const API_ADD_WEIGHT_DIARY = '/client/add_weight_diary';
const API_WEIGHT_DIARY_TABLE = '/client/weight_change_table';
const API_DELETE_WEIGHT_DIARY = '/client/delete_diary_day';
const API_WEIGHT_GRAPH = '/client/weight_graph';

const API_DIET_DAYS = '/client/diet_day';
const API_ALLOWED_FOODS = '/client/allowed_foods';
const API_FOOD_DIARY_TABLE = '/client/food_diary_table';
const API_ADD_FOOD_DIARY = '/client/add_daily_food';
const API_DELETE_FOOD_DIARY = '/client/delete_food_diary';
const API_ADD_FOOD_NOTE = '/client/add_diary_day_note';

const API_RESOURCES = '/client/pdf_resources';

const API_CONTACT_SUPPORT = '/client/contact_support';

function createRequestData(method, body) {
    //   console.log('BODY', JSON.stringify(body));
    return {
        method: method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': I18n.locale
        },
        body: JSON.stringify(body)
    };
}

function createRequestDataWithToken(method, token, body) {
    //  console.log("TOKEN", token);
    //console.log('BODY', JSON.stringify(body));
    return {
        method: method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': I18n.locale,
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
    };
}

function createGETRequestDataWithToken(token) {
    return {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': I18n.locale,
            'Authorization': 'Bearer ' + token
        }
    };
}

const Api = {
    login: function (body) {
        const requestData = createRequestData('POST', body);
        return fetch(constants.kBaseUrl + API_LOGIN, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    forgotPass: function (body) {
        const requestData = createRequestData('POST', body);
        return fetch(constants.kBaseUrl + API_FORGOT_PASS, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    getUserGuides: function (token, body) {
        const requestData = createRequestDataWithToken('POST', token, body);
        return fetch(constants.kBaseUrl + API_USER_GUIDES, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    getPhases: function (userId, token) {
        const requestData = createGETRequestDataWithToken(token);
        return fetch(constants.kBaseUrl + API_PHASES, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    addWeightDiary: function (token, body) {
        const requestData = createRequestDataWithToken('POST', token, body);
        console.log('BODY', JSON.stringify(requestData));
        const url = constants.kBaseUrl + API_ADD_WEIGHT_DIARY;
        console.log('URL', url);
        return fetch(url, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    getWeightDiaryTable: function (token, body) {
        const requestData = createRequestDataWithToken('POST', token, body);
        return fetch(constants.kBaseUrl + API_WEIGHT_DIARY_TABLE, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    deleteWeightDiary: function (token, body) {
        const requestData = createRequestDataWithToken('POST', token, body);
        return fetch(constants.kBaseUrl + API_DELETE_WEIGHT_DIARY, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    getWeightGraph: function (token, body) {
        const requestData = createRequestDataWithToken('POST', token, body);
        return fetch(constants.kBaseUrl + API_WEIGHT_GRAPH, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    getDietDays: function (token, body) {
        const requestData = createRequestDataWithToken('POST', token, body);
        return fetch(constants.kBaseUrl + API_DIET_DAYS, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    getAllowedFoods: function (token, body) {
        const requestData = createRequestDataWithToken('POST', token, body);
        return fetch(constants.kBaseUrl + API_ALLOWED_FOODS, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    getFoodDiaryTable: function (token, body) {
        const requestData = createRequestDataWithToken('POST', token, body);
        return fetch(constants.kBaseUrl + API_FOOD_DIARY_TABLE, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    addFoodDiary: function (token, body) {
        const requestData = createRequestDataWithToken('POST', token, body);
        return fetch(constants.kBaseUrl + API_ADD_FOOD_DIARY, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    deleteFoodDiary: function (token, body) {
        const requestData = createRequestDataWithToken('POST', token, body);
        return fetch(constants.kBaseUrl + API_DELETE_FOOD_DIARY, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    addFoodDiaryNote: function (token, body) {
        const requestData = createRequestDataWithToken('POST', token, body);
        return fetch(constants.kBaseUrl + API_ADD_FOOD_NOTE, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    getResources: function (token, body) {
        const requestData = createRequestDataWithToken('POST', token, body);
        return fetch(constants.kBaseUrl + API_RESOURCES, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    },
    sendMessage: function (token, body) {
        const requestData = createRequestDataWithToken('POST', token, body);
        return fetch(constants.kBaseUrl + API_CONTACT_SUPPORT, requestData)
            .then(ApiUtils.checkStatus)
            .then(ApiUtils.readResponse)
    }
};

export default Api;