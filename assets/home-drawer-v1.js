/* NZER INICIO — panel Explora NZER con enlaces a servicios y tienda */
(() => {
 'use strict';
 const openButton=document.getElementById('n5HomeMenuToggle');
 const drawer=document.getElementById('n5HomeDrawer');
 const overlay=document.getElementById('n5HomeOverlay');
 const closeButton=document.getElementById('n5HomeDrawerClose');
 if(!openButton||!drawer||!overlay||!closeButton)return;
 let focusedBefore=null;
 const isOpen=()=>!drawer.hidden;
 function closePanel(){
  if(!isOpen())return;
  drawer.hidden=true;overlay.hidden=true;
  openButton.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
  (focusedBefore&&focusedBefore.isConnected?focusedBefore:openButton).focus();
 }
 function openPanel(){
  if(isOpen())return;
  focusedBefore=document.activeElement;
  drawer.hidden=false;overlay.hidden=false;
  openButton.setAttribute('aria-expanded','true');
  document.body.style.overflow='hidden';
  closeButton.focus();
 }
 openButton.addEventListener('click',()=>isOpen()?closePanel():openPanel());
 closeButton.addEventListener('click',closePanel);
 overlay.addEventListener('click',closePanel);
 drawer.querySelectorAll('a[href]').forEach(a=>a.addEventListener('click',closePanel));
 document.addEventListener('keydown',event=>{
  if(!isOpen())return;
  if(event.key==='Escape'){event.preventDefault();closePanel();return;}
  if(event.key!=='Tab')return;
  const items=Array.from(drawer.querySelectorAll('a[href],button:not([disabled])'));
  if(!items.length)return;
  const first=items[0],last=items[items.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 });
})();
