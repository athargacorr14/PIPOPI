/* ===== extras: loader, confetti, fly-to-cart, parallax ===== */
(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

const loader=document.getElementById('loader');
const hideLoader=()=>{if(!loader)return;loader.classList.add('done');setTimeout(()=>loader.remove(),700)};
addEventListener('load',()=>setTimeout(hideLoader,700));setTimeout(hideLoader,3500);

document.querySelectorAll('.hero h1 em').forEach(em=>{
  const txt=em.textContent;em.style.animation='none';em.textContent='';
  [...txt].forEach((c,i)=>{const s=document.createElement('span');s.className='hop-l';s.textContent=c;s.style.animationDelay=(i*0.12)+'s';em.appendChild(s)});
});

function confetti(x,y,n=14,set=['🌸','✦','♡','⭐','🎀','✧']){
  if(reduce)return;
  for(let i=0;i<n;i++){
    const s=document.createElement('span');s.className='confetti';s.textContent=set[i%set.length];
    s.style.left=x+'px';s.style.top=y+'px';s.style.fontSize=(14+Math.random()*14)+'px';document.body.appendChild(s);
    const a=Math.random()*Math.PI*2,d=50+Math.random()*90;
    s.animate([
      {transform:'translate(0,0) rotate(0) scale(.4)',opacity:1},
      {transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d-40}px) rotate(${(Math.random()-.5)*540}deg) scale(1.1)`,opacity:1,offset:.6},
      {transform:`translate(${Math.cos(a)*d*1.1}px,${Math.sin(a)*d+60}px) rotate(540deg) scale(.6)`,opacity:0}
    ],{duration:900+Math.random()*500,easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=()=>s.remove();
  }
}

document.querySelectorAll('.add-cart').forEach(btn=>btn.addEventListener('click',()=>{
  const r=btn.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
  confetti(x,y,10);
  const img=btn.closest('.product-card').querySelector('img');
  const mobile=getComputedStyle(document.querySelector('.mobile-bottom')).display!=='none';
  const target=(mobile?document.querySelector('.bottom-cart span'):document.querySelector('.cart-open')).getBoundingClientRect();
  if(!img||reduce)return;
  const f=document.createElement('img');f.src=img.src;f.className='fly';f.style.left=(x-23)+'px';f.style.top=(y-23)+'px';document.body.appendChild(f);
  f.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${target.left-x+10}px,${target.top-y+10}px) scale(.25)`,opacity:.3}],{duration:800,easing:'cubic-bezier(.5,0,.8,.4)'}).onfinish=()=>f.remove();
}));
document.getElementById('copyPromo').addEventListener('click',e=>{const r=e.target.getBoundingClientRect();confetti(r.left+r.width/2,r.top,22)});
document.querySelectorAll('.wish').forEach(b=>b.addEventListener('click',()=>{if(b.classList.contains('liked')){const r=b.getBoundingClientRect();confetti(r.left+16,r.top+16,8,['♥','♡','✦'])}}));

document.querySelectorAll('.product-card').forEach((c,i)=>{
  const t=['Best!','Lucu~','Hot ✦','Fav ♥','New!','Cute!'][i%6];
  c.querySelector('.thumb').insertAdjacentHTML('beforeend',`<span class="price-pop">${t}</span>`);
});

const par=[...document.querySelectorAll('.hero .float,.hero .blob,.hero .chip,.bubble,.tag-new')].map((el,i)=>({el,k:[.06,-.05,.09,-.08][i%4]}));
let ticking=false;
addEventListener('scroll',()=>{if(ticking||reduce)return;ticking=true;requestAnimationFrame(()=>{const y=scrollY;if(y<1200)par.forEach(p=>p.el.style.translate=`0 ${y*p.k}px`);ticking=false})},{passive:true});
})();
