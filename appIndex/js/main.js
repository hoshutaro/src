'use strict';

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
 *  ヘッダースペース修正
 */
 const editHeaderSpace = () => {
    console.log(log('run editHeaderSpace'));
    let elm_header = kintone.app.getHeaderMenuSpaceElement();
    
    elm_header.classList.add('header-row');
    
    return;
 }

/**
 *  簡易検索フォームの追加
 */
const addSearchForm = () => {
    console.log(log('run addSearchForm'));
    let elm_header = kintone.app.getHeaderMenuSpaceElement();
    
    if(elm_header != null){
        
        let text = new kintoneUIComponent.Text();
        let btn = new kintoneUIComponent.IconButton({type: 'right', color: 'blue'})
        
        let df = document.createDocumentFragment();
        df.appendChild(text.render());
        df.appendChild(btn.render());
        
        // 検索機能
        btn.on('click', () => {
            console.log(log(`search: ${text.getValue()}`));
            if(text.getValue() != undefined){
                let keyword = text.getValue();
                let query = `?query=msbox like "${keyword}"`;
                
                document.location = `${location.origin}${location.pathname}${encodeURI(query)}`;
            }
            return;
        });
        
        elm_header.appendChild(df);

    }
    return;
}

/**
 *  メイン処理
 */
console.log(log('run main.js'));

// レコード一覧画面
kintone.events.on('app.record.index.show', (event) => {
    editHeaderSpace();
    addSearchForm();

    return event;
});