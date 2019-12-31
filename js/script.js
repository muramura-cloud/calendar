'use strict';

//自作カレンダー
//多分だけどその月の日数によってカレンダーのセルを生成できるようにする必要がある。
//つまりfor文だけでなくwhile文も使う必要がある。
{
  const table=document.getElementById('tbody');
  const monthLabel=document.getElementById('monthLabel');
  const prev=document.getElementById('prev');
  const next=document.getElementById('next');
  
  //月ごとにおける日数についてのオブジェクト
  const monthBox={
    1:31,
    2:28,
    3:31,
    4:30,
    5:31,
    6:30,
    7:31,
    8:31,
    9:30,
    10:31,
    11:30,
    12:31,
  }
  
  //月選びボタンの設定かつここで月の日数が確定する。
  let monthForDays;
  let daysOfMonth;
  const selectMonth=document.getElementById('selectMonth');
  const selectBtn=document.getElementById('selectBtn');
  selectBtn.addEventListener('click',()=>{
    monthForDays=parseInt(getSelectValue('selectMonth'));
    daysOfMonth=monthBox[monthForDays];
    while(table.firstChild) {// #choicesの中に要素があるなら
      table.removeChild(table.firstChild);//#choicesの中に要素がなくなるまで要素を消す。
    }
    setWeekHead();
    setWeek(daysOfMonth,monthForDays);
    setMonthLabel(monthForDays);
    console.log(monthForDays);
    console.log(daysOfMonth);
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
  function timer() {
    const d=new Date();
    const year=d.getFullYear();
    month=d.getMonth()+1;
    date=d.getDate();
    const day=d.getDay();
    const h=d.getHours();
    const m=d.getMinutes();
    const s=d.getSeconds();
    now.textContent=`${year}年 ${month}月 ${date}日(${dayOfTheWeeks[day]}) ${h}時:${m}分${s}秒`
    setTimeout(()=>{
      timer();
    },1000);
  }
  timer();
  
  function setMonthForDays() {
    monthForDays=month;
    daysOfMonth=monthBox[monthForDays];
  }
  setMonthForDays();
  console.log(monthForDays);
  console.log(daysOfMonth);
  
  //monthLabelの設定
  function setMonthLabel(monthForDays) {
    monthLabel.textContent=`${monthForDays}月`;
  }
  setMonthLabel(monthForDays);
  
  
  //カレンダーの曜日セルを生成する
  function setWeekHead() {
    const weekHead=document.createElement('tr');
    weekHead.classList.add('week-head');
    // const dayOfTheWeeks=['月','火','水','木','金','土','日'];
    for(let i=0;i<7;i++) {
      const dayOfTheWeek=document.createElement('th');
      dayOfTheWeek.classList.add('day-of-the-week');
      dayOfTheWeek.textContent=dayOfTheWeeks[i];
      weekHead.appendChild(dayOfTheWeek);
    }
    table.appendChild(weekHead);
  }
  setWeekHead();
  
  //カレンダーの日にちセルを生成する
  function setWeek(daysOfMonth,monthForDays) {
    let weekCount=1;
    while (daysOfMonth>weekCount) {
      const week=document.createElement('tr');
      week.classList.add('week');
      for(let i=0;i<7;i++) {
        if(daysOfMonth<weekCount) {
          break;
        }
        const td=document.createElement('td');
        td.textContent=weekCount;
        if(weekCount===date&&month===monthForDays) {
          td.classList.add('today');
        }
        weekCount++;
        week.appendChild(td);
      }
      table.appendChild(week);
    }
  }
  setWeek(daysOfMonth,monthForDays);

  //先月と来月ボタンの設定
  prev.addEventListener('click',()=>{
    monthForDays--;
    daysOfMonth=monthBox[monthForDays];
    if(monthForDays<1) {
      monthForDays=12;
      daysOfMonth=monthBox[monthForDays];
    }
    while(table.firstChild) {// #choicesの中に要素があるなら
      table.removeChild(table.firstChild);//#choicesの中に要素がなくなるまで要素を消す。
    }
    setWeekHead();
    setWeek(daysOfMonth,monthForDays);
    setMonthLabel(monthForDays);
    console.log(monthForDays);
  });
  next.addEventListener('click',()=>{
    monthForDays++;
    daysOfMonth=monthBox[monthForDays];
    if(monthForDays>12) {
      monthForDays=1;
      daysOfMonth=monthBox[monthForDays];
    }
    while(table.firstChild) {// #choicesの中に要素があるなら
      table.removeChild(table.firstChild);//#choicesの中に要素がなくなるまで要素を消す。
    }
    setWeekHead();
    setWeek(daysOfMonth,monthForDays);
    setMonthLabel(monthForDays);
    console.log(monthForDays);
  });
}