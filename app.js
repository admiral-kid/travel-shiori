'use strict';

(() => {
  const STORE_NAME='documents', DB_NAME='travel-shiori-private-viewer', CURRENT='current';
  const fileInput=document.getElementById('shiori-file');
  const welcome=document.getElementById('welcome');
  const workspace=document.getElementById('workspace');
  const reader=document.getElementById('reader');
  const status=document.getElementById('status');
  let database,activeURL='',revision=0,noticeTimer;

  function notice(message,persistent=false){
    clearTimeout(noticeTimer);status.textContent=message;status.hidden=false;
    if(!persistent)noticeTimer=setTimeout(()=>{status.hidden=true},6500);
  }

  function validateHTML(source){
    if(typeof source!=='string'||source.length>100*1024*1024)throw Error('100MB以内のしおりHTMLを選んでください。');
    const parsed=new DOMParser().parseFromString(source,'text/html');
    const dataNode=parsed.querySelector('script#travel-data[type="application/json"]');
    let data;try{data=JSON.parse(dataNode?.textContent||'null')}catch{}
    if(!data||!Array.isArray(data.days)||!Array.isArray(data.nights)||!Array.isArray(data.booking_checklist?.items))throw Error('この旅行のしおりから保存したHTMLを選んでください。JSONバックアップは、しおり内の「記録を読み込む」から復元できます。');
    if(!parsed.querySelector('#screen')||!parsed.querySelector('#record-data'))throw Error('操作画面を含む「記録付きしおり」または元のHTMLを選んでください。');
    return source;
  }

  function openDatabase(){
    if(database)return database;
    database=new Promise((resolve,reject)=>{
      if(typeof indexedDB==='undefined'){reject(Error('端末保存を利用できません。'));return}
      const request=indexedDB.open(DB_NAME,1);
      request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE_NAME))db.createObjectStore(STORE_NAME)};
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error||Error('端末保存を利用できません。'));
      request.onblocked=()=>reject(Error('別のタブを閉じて、もう一度お試しください。'));
    });
    return database;
  }

  async function readSaved(){
    const db=await openDatabase();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE_NAME,'readonly'),request=tx.objectStore(STORE_NAME).get(CURRENT);
      request.onsuccess=()=>resolve(request.result||null);
      request.onerror=()=>reject(request.error);
      tx.onabort=()=>reject(tx.error);
    });
  }

  async function saveHTML(record){
    const db=await openDatabase();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE_NAME,'readwrite');tx.objectStore(STORE_NAME).put(record,CURRENT);
      tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
    });
  }

  function display(source){
    const previous=activeURL;
    activeURL=URL.createObjectURL(new Blob([source],{type:'text/html;charset=utf-8'}));
    reader.onload=()=>{if(previous)URL.revokeObjectURL(previous)};
    reader.src=activeURL;welcome.hidden=true;workspace.hidden=false;
  }

  async function importFile(file){
    if(!file)return;
    const currentRevision=++revision;
    try{
      if(file.size>100*1024*1024)throw Error('100MB以内のしおりHTMLを選んでください。');
      const source=validateHTML(await file.text());
      if(currentRevision!==revision)return;
      display(source);
      try{await saveHTML({html:source,name:file.name,savedAt:new Date().toISOString()});notice('この端末にしおりを保存しました。次回から自動で開きます。')}
      catch{notice('しおりは開けました。この環境では自動再表示用の保存ができないため、次回もHTMLを選んでください。',true)}
    }catch(error){notice(error.message||'しおりを読み込めませんでした。',true)}
  }

  fileInput.addEventListener('change',()=>{const file=fileInput.files?.[0];fileInput.value='';void importFile(file)});
  (async()=>{
    const atStart=revision;
    try{const saved=await readSaved();if(saved&&atStart===revision)display(validateHTML(saved.html))}
    catch{if(atStart===revision)notice('本人用のHTMLを選ぶと、しおりを開けます。端末保存が使えない場合も、その回の閲覧はできます。')}
  })();
})();
