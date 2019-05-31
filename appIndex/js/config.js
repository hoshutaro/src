'use strict';

/**
 * 固定値
 */
const APP_ID    = kintone.app.getId();
const PLUGIN_ID = 'bojikainnoigicndgjiadfanijcldabf';
const BODY_ID   = 'main'; // 描画対象div

const CONF_ID_KEY    = 'confkey'; // Kintone保存用ID
const CONF_ID_SEARCH = 'search';  // 検索機能ID

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

/***********************************************************************************************************************
 *
 * 既存パラメータ取得関連
 * 
 * ********************************************************************************************************************/
// コンフィグ取得
const getConfig = async () => {
    console.log(log('run getConfig()'));
    
    let config = {};
    
    let val = kintone.plugin.app.getConfig('bojikainnoigicndgjiadfanijcldabf')[CONF_ID_KEY];
    if(val != undefined){
        config = JSON.parse(val);
    }
    
    return config;
}
 
// フォームフィールド一覧取得
const getFormFields = async () => {
    console.log(log('run getFormFields()'));
    
    let body = {
        'app': APP_ID
    };
    
    let result = await kintone.api('/k/v1/app/form/fields', 'GET', body);
    console.log(result);
    
    return result;
}

/***********************************************************************************************************************
 *
 * 検索機能関連
 * 
 * ********************************************************************************************************************/
// 検索コンフィグ追加
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
                                     <input type="checkbox" name="${CONF_ID_SEARCH}" value="0" id="${prop[n].code}">
                                     <label for="${prop[n].code}">${prop[n].label} (${prop[n].code})</label>
                                 </span>
                             </div>`;
            cont.appendChild(elm);
        }
    }

    body.appendChild(cont);
    
    return;
}

/***********************************************************************************************************************
 *
 * カラー変更機能関連
 * 
 * ********************************************************************************************************************/
// カラー変更コンフィグ追加
const addChangeColorConfig = () => {
    console.log(log('run addChangeColor()'));
    
    let body = document.getElementById(BODY_ID);
    let cont = document.createElement('div');
    
    cont.innerHTML = `<div class="kintoneplugin-label">カラー変更機能</div>
                      <div class="kintoneplugin-title">条件式</div>`;
    
    body.appendChild(cont);
    
    return;
}

/***********************************************************************************************************************
 *
 * プラグインコンフィグ関連
 * 
 * ********************************************************************************************************************/
// 既定値設定
const setSavedConfig = (SAVEDCONFIG) => {
    console.log(log('run setSavedConfig()'));
    console.log(SAVEDCONFIG);
    
    // 検索機能
    let valSearch = SAVEDCONFIG[CONF_ID_SEARCH];
    for(let i=0; i<valSearch.length; i++){
        document.getElementById(valSearch[i]).checked = true;
    }
    
    return;
}
 
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
    
    let config = {[CONF_ID_SEARCH] : []};
    
    // 検索対象フィールド
    let nodes = document.getElementsByName(CONF_ID_SEARCH);
    for(let i=0; i<nodes.length; i++){
        if(nodes[i].checked){
            config[CONF_ID_SEARCH].push(nodes[i].id);
        }
    }
    
    console.log(config);
    
    kintone.plugin.app.setConfig({[CONF_ID_KEY] : JSON.stringify(config, null, 4)});
        
    return;
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
    const SAVEDCONFIG = await getConfig();
    const FIELDS = await getFormFields();
    
    // 検索機能コンフィグ設置
    await addSearchConfig(FIELDS);

    // カラー変更機能コンフィグ設置
    await addChangeColorConfig();
    
    // 既定値入力
    await setSavedConfig(SAVEDCONFIG);
    
    // 保存ボタン設置
    await addSaveButton();
    
    return;
}

// メイン
console.log(log('run config.js'));
asyncfunctions();
