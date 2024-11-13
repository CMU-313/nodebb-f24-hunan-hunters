'use strict';

require('request');

const translatorApi = module.exports;

translatorApi.translate = async function (postData) {
    const TRANSLATOR_API = 'https://translator-service-hunan-hunters.azurewebsites.net/';
    const response = await fetch(TRANSLATOR_API + '/?content=' + postData.content);
    const data = await response.json();
    return [data["is_english"], data["translated_content"]]
}