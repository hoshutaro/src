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
    console.log(log('run addSearchForm'));
    
    if(HEADER != null){
        
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
        
        HEADER.appendChild(df);

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
kintone.events.on('app.record.index.show', async (event) => {
    console.log(log('run app.record.index.show'));
    
    const HEADER = await kintone.app.getHeaderMenuSpaceElement();
    
    // ヘッダースペース修正
    await editHeaderSpace(HEADER);
    // 検索フォーム生成
    await addSearchForm(HEADER);

    return event;
});