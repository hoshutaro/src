'use strict';

/**
 * 固定値
 */
const CONF_ID_KEY    = 'confkey'; // Kintone保存用ID
const CONF_ID_SEARCH = 'search';  // 検索機能ID

/**
 * 共有変数
 */


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

/***********************************************************************************************************************
 *
 * ヘッダースペース関連
 * 
 * ********************************************************************************************************************/
 const editHeaderSpace = async (HEADER) => {
    console.log(log('run editHeaderSpace()'));
    
    // 任意のCSSを適用したいのでクラスを追加
    HEADER.classList.add('header-row');
    
    return;
 }

/***********************************************************************************************************************
 *
 * 検索機能関連
 * 
 * ********************************************************************************************************************/
// 簡易検索フォームの追加
const addSearchForm = (HEADER) => {
    console.log(log('run addSearchForm()'));
    
    if(HEADER != null){
        
        let cont = document.createElement('div');
        cont.innerHTML = `<div class="kintoneplugin-input-outer">
                              <input class="kintoneplugin-input-text" type="text" placeholder="検索文字を入力" id="${CONF_ID_SEARCH}">
                          </div>
                          <button class="kintoneplugin-button-dialog-ok" onClick="doSearch()" style="min-width: 60px;">検索</button>`;
        
        
//        let text = new kintoneUIComponent.Text();
//        let btn = new kintoneUIComponent.IconButton({type: 'right', color: 'blue'})
//        
//        let df = document.createDocumentFragment();
//        df.appendChild(text.render());
//        df.appendChild(btn.render());
//        
//        // 検索機能
//        btn.on('click', () => {
//            console.log(log(`search: ${text.getValue()}`));
//            if(text.getValue() != undefined){
//                let keyword = text.getValue();
//                let query = `?query=msbox like "${keyword}"`;
//                
//                document.location = `${location.origin}${location.pathname}${encodeURI(query)}`;
//            }
//            return;
//        });
//        
//        HEADER.appendChild(df);
        
        HEADER.appendChild(cont);
    }
    return;
}

// 検索実行
const doSearch = async () => {
    console.log(log('run doSearch()'));
    
    let txt = document.getElementById(CONF_ID_SEARCH).value;
    if(txt != ''){
        const search_target = await getConfig()[CONF_ID_SEARCH];
        let query = '?query=';
        
        for(let i=0; search_target.length; i++){
            if(i>0){query += ' or ';}
            query += `${search_target[i]} like "${txt}"`;
        }
        document.location = `${location.origin}${location.pathname}${encodeURI(query)}`;
    }
    
    return;
}

/***********************************************************************************************************************
 *
 * メイン処理
 * 
 * ********************************************************************************************************************/
console.log(log('run main.js'));




// レコード一覧画面
kintone.events.on('app.record.index.show', (event) => {
    console.log(log('run app.record.index.show'));
    
    // 非同期処理を制御
    appRecordIndexShow();

    return event;
});
const appRecordIndexShow = async () => {
    const HEADER = await kintone.app.getHeaderMenuSpaceElement();

    // ヘッダースペース修正
    await editHeaderSpace(HEADER);
    // 検索フォーム生成
    await addSearchForm(HEADER);
    
    return;
}