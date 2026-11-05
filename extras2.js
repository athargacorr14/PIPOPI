/* ===== testimonial carousel ===== */
(()=>{
const track=document.getElementById('carTrack');
if(!track)return;
const slides=[...track.children],dotsBox=document.getElementById('carDots'),prev=document.getElementById('carPrev'),next=document.getElementById('carNext'),root=document.getElementById('carousel');
let idx=0,timer,drag=null;
const per=()=>innerWidth<=640?1:innerWidth<=1100?2:3;
const max=()=>Math.max(0,slides.length-per());
function buildDots(){
  dotsBox.innerHTML='';
  for(let i=0;i<=max();i++){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Slide '+(i+1));b.addEventListener('click',()=>{go(i);restart()});dotsBox.appendChild(b)}
}
function go(i){
  idx=Math.min(Math.max(i,0),max());
  track.style.transform=`translateX(${-idx*(100/slides.length)*1}%)`;
  /* track width = slides.length * slideWidth, translate % is relative to track */
  const p=per();
  slides.forEach((s,k)=>s.classList.toggle('on',k>=idx&&k<idx+p));
  [...dotsBox.children].forEach((d,k)=>d.classList.toggle('on',k===idx));
}
function layout(){
  const p=per();
  track.style.width=(slides.length/p*100)+'%';
  slides.forEach(s=>s.style.flexBasis=(100/slides.length)+'%');
  buildDots();go(Math.min(idx,max()));
}
function step(d){go(d>0&&idx>=max()?0:d<0&&idx<=0?max():idx+d)}
function restart(){clearInterval(timer);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>step(1),4500)}
prev.addEventListener('click',()=>{step(-1);restart()});
next.addEventListener('click',()=>{step(1);restart()});
root.addEventListener('mouseenter',()=>clearInterval(timer));
root.addEventListener('mouseleave',restart);
root.addEventListener('focusin',()=>clearInterval(timer));
root.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){step(-1);restart()}if(e.key==='ArrowRight'){step(1);restart()}});
/* swipe */
track.addEventListener('pointerdown',e=>{drag={x:e.clientX,id:e.pointerId}});
addEventListener('pointerup',e=>{if(!drag)return;const dx=e.clientX-drag.x;drag=null;if(Math.abs(dx)>50){step(dx<0?1:-1);restart()}});
addEventListener('pointercancel',()=>{drag=null});
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(layout,150)});
layout();restart();
})();
