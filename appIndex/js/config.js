'use strict';

/**
 * 共有変数
 */
const APPID = kintone.app.getId();
const PLUGIN_ID = 'bojikainnoigicndgjiadfanijcldabf';
let config = {};
let config_saved = kintone.plugin.app.getConfig('bojikainnoigicndgjiadfanijcldabf');

/**
 *  ログ表示
 */
const log = (str) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const mSecond = now.getMilliseconds();
    
    return `${year}/${month}/${day} ${hour}:${minute}:${second}.${mSecond} ${str}`;
}

/**
 * フォームフィールド一覧取得
 */
const getFormFields = async () => {
    console.log(log('run getFormFields'));
    
    let body = {
        'app': APPID
    };
    
    let result = await kintone.api('/k/v1/app/form/fields', 'GET', body);
    console.log(result);
    
    return result;
}


/**
 * 検索対象フィールド生成
 */
const addSearchTargetFields = (FIELDS) => {
    console.log(log('run addSearchTargetFields'));
    
    let prop = FIELDS.properties;
    let sp1 = document.getElementById('sp1');
    
    for(let n in prop) {
        //console.log(`code: ${prop[n].code} type: ${prop[n].type}`);
        
        let arr = ['SINGLE_LINE_TEXT', 'MULTI_LINE_TEXT'];
        if(arr.includes(prop[n].type)) {
            // 要素生成
            let elm = document.createElement('p');
            let elmid = `search-${prop[n].code}`;
            elm.innerHTML = `<div class="kintoneplugin-input-checkbox">
                                 <span class="kintoneplugin-input-checkbox-item">
                                     <input type="checkbox" name="checkbox" value="0" id="${elmid}" checked="">
                                     <label for="${elmid}">${prop[n].label}</label>
                                 </span>
                             </div>`;
            sp1.appendChild(elm);
            config[`search-${prop[n].code}`] = '';
            
            // 初期値設定
            console.log(`config: ${config_saved[elmid]}`);
            
        }

    }
    return;
}

/**
 * Config保存
 */
const saveConfig = () => {
    console.log(log('run saveConfig'));
    for(let n in config){
        console.log(document.getElementById(n));
        if(document.getElementById(n).type === 'checkbox'){
            config[n] = document.getElementById(n).checked.toString();
        }
    }
    
    kintone.plugin.app.setConfig(config);
    
    return;
}

/**
 * 非同期処理
 */
const asyncfunctions = async () => {
    console.log(log('run asyncfunctions'));
    
    let FIELDS = await getFormFields();
    
    addSearchTargetFields(FIELDS);
    
    return;
}


/**
 *  メイン処理
 */
console.log(log('run config.js'));

asyncfunctions();
