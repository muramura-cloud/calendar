'use strict';

//自作カレンダー
//多分だけどその月の日数によってカレンダーのセルを生成できるようにする必要がある。
//つまりfor文だけでなくwhile文も使う必要がある。
//システムを後ずけで考えすぎた。そのためコードが長くなってしまった。もう少し考えてからコードを書こう。特にカレンダーweek関数とか。
//最初の週のスペースはmonthBoxに格納するのではなくて、new Date();で取得した値の関連ずければ良いと思った。
//リセットボタンとかも作ろうかな
{
  const table=document.getElementById('tbody');
  //月ごとにおける日数についての配列の中にオブジェクトを入れた。これをもっと早くやっておけばよかった。
  const monthBox=[
    //mはカレンダーの月、dはその月の最後の日数、sはその月の最初の週の空きスペース、そしてこのやり方は頭悪い笑。
    {m:1,d:31,s:3},
    {m:2,d:29,s:6},
    {m:3,d:31,s:0},
    {m:4,d:30,s:3},
    {m:5,d:31,s:5},
    {m:6,d:30,s:1},
    {m:7,d:31,s:3},
    {m:8,d:31,s:6},
    {m:9,d:30,s:2},
    {m:10,d:31,s:4},
    {m:11,d:30,s:0},
    {m:12,d:31,s:2},
  ];
  
  //月選びボタンの設定。
  let monthForDays;
  let daysOfMonth;
  const selectMonth=document.getElementById('selectMonth');
  const selectBtn=document.getElementById('selectBtn');
  selectBtn.addEventListener('click',()=>{
    monthForDays=parseInt(getSelectValue('selectMonth'));
    daysOfMonth=monthBox[monthForDays-1].d;
    while(table.firstChild) {
      table.removeChild(table.firstChild);
    }
    setWeekHead();
    setWeek(daysOfMonth,monthForDays);
    setMonthLabel(monthForDays);
    addClassToThumbnail();
  });
  function getSelectValue(name) {
    const result=[];
    const opts=document.getElementById(name).options;
    for(let i=0;i<opts.length;i++) {
      const opt=opts.item(i);
      if(opt.selected) {
        result.push(opt.value);
      }
    }
    return result;
  }
  
  //現在日時を生成する
  const now=document.getElementById('now');
  const dayOfTheWeeks=['日','月','火','水','木','金','土'];
  let month;
  let date;
  let day;
  let timeoutId;
  function timer() {
    const d=new Date();
    const year=d.getFullYear();
    month=d.getMonth()+1;
    date=d.getDate();
    day=d.getDay();
    const h=d.getHours();
    const m=d.getMinutes();
    const s=d.getSeconds();
    now.textContent=`${year}年 ${month}月 ${date}日(${dayOfTheWeeks[day]}) ${h}時:${m}分${s}秒`
    timeoutId=setTimeout(()=>{
      timer();
    },1000);
  }
  timer();
  
  //最初に現在の月をカレンダーに反映させる関数
  function setDaysOfMonth() {
    monthForDays=month;
    daysOfMonth=monthBox[monthForDays-1].d;
  }
  setDaysOfMonth();
  
  //monthLabelの設定
  const monthLabel=document.getElementById('monthLabel');
  function setMonthLabel(monthForDays) {
    monthLabel.textContent=`${monthForDays}月`;
  }
  setMonthLabel(monthForDays);
  
  
  //カレンダーの曜日セルを生成する
  function setWeekHead() {
    const weekHead=document.createElement('tr');
    weekHead.classList.add('week-head');
    for(let i=0;i<7;i++) {
      const dayOfTheWeek=document.createElement('th');
      dayOfTheWeek.classList.add('day-of-the-week');
      dayOfTheWeek.textContent=dayOfTheWeeks[i];
      weekHead.appendChild(dayOfTheWeek);
    }
    table.appendChild(weekHead);
  }
  setWeekHead();
  
  //ストレージにオブジェクトを保存し取得するクラス
  var MyStorage=function(app) {
    this.app=app;
    this.storage=localStorage;
    //storageのvalue（オブジェクト）を取得
    this.data=JSON.parse(this.storage[this.app]||'{}');
  }
  MyStorage.prototype={
    getItem: function(key) {
      return this.data[key];
    },
    setItem: function(key,value) {
      return this.data[key]=value;
    },
    deleteItem: function(key) {
      delete this.data[key];
    },
    save: function() {
      this.storage[this.app]=JSON.stringify(this.data);
    }
  };
  
  class Form {
    constructor(name) {
      let placeholder;
      if(name==='labor') {
        placeholder='シフト人数を入力'
      }else if(name==='normal') {
        placeholder='一般予約人数を入力';
      }else if(name==='banquet') {
        placeholder='宴会予約人数を入力';
      }
      this.input=document.createElement('input');
      this.input.type='text';
      this.input.name=name;
      this.input.placeholder=placeholder;
      this.input.addEventListener('click',(e)=>{
        e.stopPropagation();
      });
    }
    getInput() {
      return this.input;
    }
  }
  
  //カレンダーの日にちセルを生成するここをもっとシンプルにできないかな泣
  function setWeek(daysOfMonth,monthForDays) {
    let storage=localStorage;//全消去のための宣言
    let weekCount=1;
    let makeSpace=false;
    let weekSpan=7;
    if(makeSpace===false) {
      weekSpan=7-monthBox[monthForDays-1].s;
    }
    while (daysOfMonth>weekCount) {
      const week=document.createElement('tr');
      week.classList.add('week');
      for(let i=0;i<weekSpan;i++) {
        if(daysOfMonth<weekCount) {
          break;
        }
        if(makeSpace===false) {
          for(let i=0;i<monthBox[monthForDays-1].s;i++) {
            const td=document.createElement('td');
            week.appendChild(td);
            makeSpace=true;
          }
        }
        const td=document.createElement('td');
        td.textContent=weekCount;
        td.addEventListener('click',()=>{
          const tdChild=td.children;
          const nowdate=parseInt(td.textContent);
          if(tdChild.length>0) {
            for(let i=0;i<tdChild.length;i++) {
              tdChild.item(i).parentNode.removeChild(tdChild.item(i));
            }
          }
          if(td.classList.contains('today')) {
            td.classList.remove('today');
          }
          const div=document.createElement('div');
          div.classList.add('wrapper');
          const tdData=document.createElement('form');
          
          //formを生成。ただオブジェクトの形であってNodeではないからappend注意
          const forms=[
            new Form('normal'),
            new Form('banquet'),
            new Form('labor'),
          ];
          
          //予約結果を生成
          const result=document.createElement('ul');
          result.textContent='予約状況';
          var nowMonthAndDay=monthForDays+'/'+nowdate;
          var data=JSON.parse(storage.getItem(nowMonthAndDay));
          const normalReservationResult=document.createElement('li');
          if(data===null) {
            normalReservationResult.textContent='一般予約人数 : ? 人';
          }else {
            normalReservationResult.textContent='一般予約人数 : '+data.normal+'人';
          }
          const banquetReservationResult=document.createElement('li');
          if(data===null) {
            banquetReservationResult.textContent='一般予約人数 : ? 人';
          }else {
            banquetReservationResult.textContent='宴会予約人数 : '+data.banquet+'人';
          }
          const laborResult=document.createElement('li');
          if(data===null) {
            laborResult.textContent='一般予約人数 : ? 人';
          }else {
            laborResult.textContent='シフト人数 : '+data.labor+'人';
          }
          
          //確定ボタン
          const btn=document.createElement('div');
          btn.classList.add('check');
          btn.textContent="確定";
          btn.addEventListener('click',(e)=>{
            e.stopPropagation();//これをしないとただtdがクリックされただけの状態になってしまう。
            const inputs=btn.parentNode.querySelectorAll('input');
            const inputValues=[];
            var storage=new MyStorage(monthForDays+'/'+nowdate);
            for(let i=0;i<inputs.length;i++) {
              inputValues.push(inputs.item(i).value);
              storage.setItem(inputs.item(i).name,inputValues[i]);
            }
            storage.save();
            normalReservationResult.textContent='一般予約人数 : '+storage.getItem("normal")+'人';
            banquetReservationResult.textContent='宴会予約人数 : '+storage.getItem("banquet")+'人';
            laborResult.textContent='シフト人数 : '+storage.getItem("labor")+'人';
          });
          //閉じるボタン
          const close=document.createElement('div');
          close.classList.add('closeBtn');
          close.textContent='閉じる';
          close.addEventListener('click',(e)=>{
            if(nowdate===date) {
              td.classList.add('today');
            }
            e.stopPropagation();
            div.classList.add('close');
            // storage.clear();
          });
          for (let i=0;i<forms.length;i++) {
            tdData.appendChild(forms[i].getInput());
          }
          tdData.appendChild(btn);
          tdData.appendChild(close);
          div.appendChild(tdData);
          //ここら辺をどうにかしい！
          result.appendChild(normalReservationResult);
          result.appendChild(banquetReservationResult);
          result.appendChild(laborResult);
          div.appendChild(result);
          td.appendChild(div);
        });
        if(weekCount===date&&month===monthForDays) {
          td.classList.add('today');
        }
        weekCount++;
        week.appendChild(td);
      }
      table.appendChild(week);
      if(makeSpace===true) {
        weekSpan=7;
      }
    }
  }
  setWeek(daysOfMonth,monthForDays);
  
  //サムネイルボタンの生成
  const thumbnails=document.getElementById('thumbnails');
  for(let i=1;i<13;i++) {
    const li=document.createElement('li');
    li.textContent=i+'月';
    li.value=i;
    li.addEventListener('click',()=>{
      const targetParent=li.parentNode;
      const target=targetParent.children;
      for(let i=0;i<12;i++) {
        if(target.item(i).classList.contains('selected')) {
          target.item(i).classList.remove('selected');
        }
      }
      li.classList.add('selected');
      monthForDays=li.value;
      daysOfMonth=monthBox[monthForDays-1].d;
      while(table.firstChild) {
        table.removeChild(table.firstChild);
      }
      setWeekHead();
      setWeek(daysOfMonth,monthForDays);
      setMonthLabel(monthForDays);
    });
    thumbnails.appendChild(li);
  }
  
  //先月と来月ボタンの設定
  const prev=document.getElementById('prev');
  prev.addEventListener('click',()=>{
    monthForDays--;
    if(monthForDays<1) {
      monthForDays=12;
      daysOfMonth=monthBox[monthForDays-1].d;
    }
    daysOfMonth=monthBox[monthForDays-1].d;
    while(table.firstChild) {
      table.removeChild(table.firstChild);
    }
    setWeekHead();
    setWeek(daysOfMonth,monthForDays);
    setMonthLabel(monthForDays);
    addClassToThumbnail();
  });
  const next=document.getElementById('next');
  next.addEventListener('click',()=>{
    monthForDays++;
    if(monthForDays>12) {
      monthForDays=1;
      daysOfMonth=monthBox[monthForDays-1].d;
    }
    daysOfMonth=monthBox[monthForDays-1].d;
    while(table.firstChild) {
      table.removeChild(table.firstChild);
    }
    setWeekHead();
    setWeek(daysOfMonth,monthForDays);
    setMonthLabel(monthForDays);
    addClassToThumbnail();
  });
  
  //サムネイルにクラスを付け外しするクラス
  function addClassToThumbnail() {
    const target=thumbnails.children;
    for(let i=0;i<12;i++) {
      if(target.item(i).classList.contains('selected')) {
        target.item(i).classList.remove('selected');
      }
      if(target.item(i).value===monthForDays) {
        target.item(i).classList.add('selected');
      }
    }
  }
}