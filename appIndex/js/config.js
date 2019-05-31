'use strict';

/**
 * 固定値
 */
const APP_ID    = kintone.app.getId();
const PLUGIN_ID = 'bojikainnoigicndgjiadfanijcldabf';
const BODY_ID   = 'main'; // 描画対象div

const CONF_ID_SEARCH = 'search'; // 検索機能ID


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
 * フォームフィールド一覧取得
 */
const getFormFields = async () => {
    console.log(log('run getFormFields()'));
    
    let body = {
        'app': APP_ID
    };
    
    let result = await kintone.api('/k/v1/app/form/fields', 'GET', body);
    console.log(result);
    
    return result;
}


/**
 * 検索機能コンフィグ生成
 */
const addSearchConfig = (FIELDS) => {
    console.log(log('run addSearchConfig()'));
    
    let body = document.getElementById(BODY_ID);
    let cont = document.createElement('div');
    
    cont.innerHTML = `<div class="kintoneplugin-label">検索機能</div>
                      <div class="kintoneplugin-title">検索対象フィールド</div>`;
    
    let prop = FIELDS.properties;
    
    for(let n in prop) {
        // Kintone仕様で検索対象にできるフィールドタイプ
        let arr = ['SINGLE_LINE_TEXT', 'MULTI_LINE_TEXT'];
        if(arr.includes(prop[n].type)) {
            // 要素生成
            let elm = document.createElement('p');
            let elmid = `search-${prop[n].code}`;
            elm.innerHTML = `<div class="kintoneplugin-input-checkbox">
                                 <span class="kintoneplugin-input-checkbox-item">
                                     <input type="checkbox" name="${CONF_ID_SEARCH}" value="0" id="${elmid}" checked="">
                                     <label for="${elmid}">${prop[n].label} (${prop[n].code})</label>
                                 </span>
                             </div>`;
            cont.appendChild(elm);
            //config[`search-${prop[n].code}`] = '';
            
            // 初期値設定
            
        }
    }
    
    body.appendChild(cont);
    
    return;
}

/***********************************************************************************************************************
 *
 * プラグインコンフィグ関連
 * 
 * ********************************************************************************************************************/
// 保存・キャンセルボタン設置
const addSaveButton = () => {
    console.log(log('run addSaveButton()'));
    
    let body = document.getElementById(BODY_ID);
    let cont = document.createElement('div');
    
    cont.innerHTML = `<button class="kintoneplugin-button-dialog-ok" onClick="saveConfig()">Save</button>
                      <button class="kintoneplugin-button-dialog-cancel">Cancel</button>`;
    
    body.appendChild(cont);
    
    return;
}

// コンフィグ保存
const saveConfig = () => {
    console.log(log('run saveConfig()'));
    
    let config = {};
    
    // 検索対象フィールド
    
}

/***********************************************************************************************************************
 *
 * メイン処理
 * 
 * ********************************************************************************************************************/
// 非同期処理
const asyncfunctions = async () => {
    console.log(log('run asyncfunctions()'));
    
    // アプリ設定値取得
    let FIELDS = await getFormFields();
    
    // 検索機能コンフィグ
    await addSearchConfig(FIELDS);
    
    // 保存ボタン設置
    await addSaveButton();
    
    return;
}

// メイン
console.log(log('run config.js'));
asyncfunctions();
