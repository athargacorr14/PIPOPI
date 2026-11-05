const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);

/* menu */
const nav=$('#nav'),menuToggle=$('#menuToggle');
menuToggle.addEventListener('click',()=>{const o=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',o)});
$$('#nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

/* toast */
const toast=$('#toast');let toastTimer;
function notify(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400)}

/* search */
const searchPanel=$('#searchPanel'),searchInput=$('#searchInput');
$('#searchToggle').addEventListener('click',()=>{searchPanel.classList.toggle('open');if(searchPanel.classList.contains('open'))searchInput.focus()});
$('#searchClose').addEventListener('click',()=>searchPanel.classList.remove('open'));
searchInput.addEventListener('input',e=>{
  const q=e.target.value.toLowerCase().trim();let shown=0;
  $$('.product-card').forEach(c=>{const ok=c.dataset.name.toLowerCase().includes(q);c.style.display=ok?'':'none';if(ok)shown++});
  $('#noResult').style.display=shown?'none':'block';
  if(q)$('#produk').scrollIntoView();
});

/* wishlist */
$$('.wish').forEach(btn=>btn.addEventListener('click',()=>{
  btn.classList.toggle('liked');const l=btn.classList.contains('liked');
  btn.textContent=l?'♥':'♡';notify(l?'Ditambahkan ke wishlist':'Dihapus dari wishlist');
}));

/* cart */
let cart=[];
const drawer=$('#cartDrawer'),overlay=$('#overlay');
const openCart=()=>{drawer.classList.add('open');overlay.classList.add('show')};
const closeCart=()=>{drawer.classList.remove('open');overlay.classList.remove('show')};
$$('.cart-open,.bottom-cart').forEach(el=>el.addEventListener('click',e=>{if(el.classList.contains('bottom-cart'))e.preventDefault();openCart()}));
$('#cartClose').addEventListener('click',closeCart);overlay.addEventListener('click',closeCart);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();searchPanel.classList.remove('open')}});
const rupiah=n=>'Rp '+n.toLocaleString('id-ID');
function renderCart(){
  const count=cart.reduce((s,p)=>s+p.qty,0),total=cart.reduce((s,p)=>s+p.price*p.qty,0);
  ['cartCount','mobileCartCount'].forEach(id=>{const el=document.getElementById(id);el.textContent=count;el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')});
  $('#cartTotal').textContent=rupiah(total);
  const area=$('#cartItems');
  area.innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-row"><span>${p.name} × ${p.qty}<br><small>${rupiah(p.price*p.qty)}</small></span><button data-remove="${i}">Hapus</button></div>`).join(''):'<p class="empty-cart">Keranjang kamu masih kosong.</p>';
  area.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{cart.splice(Number(b.dataset.remove),1);renderCart()}));
}
$$('.add-cart').forEach(btn=>btn.addEventListener('click',()=>{
  const name=btn.dataset.product,price=Number(btn.dataset.price),f=cart.find(p=>p.name===name);
  f?f.qty++:cart.push({name,price,qty:1});renderCart();notify(name+' ditambahkan ke keranjang');
}));
$('#checkout').addEventListener('click',()=>{
  if(!cart.length){notify('Keranjang masih kosong.');return}
  const detail=cart.map(p=>`${p.name} x${p.qty} - ${rupiah(p.price*p.qty)}`).join('\n');
  const total=cart.reduce((s,p)=>s+p.price*p.qty,0);
  const msg=encodeURIComponent(`Halo PiPOPi, saya ingin memesan:\n${detail}\nTotal: ${rupiah(total)}\nMohon info proses selanjutnya.`);
  // Ganti nomor contoh ini dengan nomor WhatsApp resmi PiPOPi.
  window.open('https://wa.me/6281234567890?text='+msg,'_blank','noopener');
});

/* promo copy */
$('#copyPromo').addEventListener('click',()=>{
  const code=$('#promoCode').textContent;
  (navigator.clipboard?navigator.clipboard.writeText(code):Promise.reject()).then(()=>notify('Kode '+code+' disalin!')).catch(()=>notify('Kode promo: '+code));
});

/* newsletter */
['newsletterForm','footerNewsletter'].forEach(id=>$('#'+id).addEventListener('submit',e=>{e.preventDefault();e.target.reset();notify('Terima kasih! Email kamu sudah dicatat pada demo ini.')}));

/* image fallback */
$$('img').forEach(img=>img.addEventListener('error',()=>{img.style.visibility='hidden'}));

/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('.reveal').forEach(el=>io.observe(el));

/* counters */
function countUp(el){
  const target=parseFloat(el.dataset.count),dec=+el.dataset.dec||0,suf=el.dataset.suffix||'',t0=performance.now(),dur=1600;
  (function tick(t){const p=Math.min((t-t0)/dur,1),v=target*(1-Math.pow(1-p,3));el.textContent=v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g,'.')+suf;if(p<1)requestAnimationFrame(tick)})(t0);
}
const co=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){countUp(e.target);co.unobserve(e.target)}}),{threshold:.6});
$$('[data-count]').forEach(el=>co.observe(el));

/* scroll: progress bar, header shadow, back-to-top */
const progress=$('#progress'),header=$('#header'),toTop=$('#toTop');
function onScroll(){
  const h=document.documentElement,max=h.scrollHeight-h.clientHeight;
  progress.style.width=(max>0?h.scrollTop/max*100:0)+'%';
  header.classList.toggle('scrolled',h.scrollTop>10);
  toTop.classList.toggle('show',h.scrollTop>500);
}
addEventListener('scroll',onScroll,{passive:true});onScroll();
toTop.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

/* active nav + mobile bottom bar */
const links=[...$$('#nav a')],bottoms=[...$$('.mobile-bottom a')];
const so=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  const id='#'+(e.target.id||'home');
  links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===id));
  bottoms.forEach(a=>a.classList.toggle('selected',a.getAttribute('href')===id));
}),{rootMargin:'-45% 0px -50% 0px'});
$$('main [id], .hero').forEach(s=>{if(s.id)so.observe(s)});
const heroEl=$('.hero');heroEl.id='home-hero';
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#home'));bottoms.forEach(a=>a.classList.toggle('selected',a.getAttribute('href')==='#home'))}}),{rootMargin:'-45% 0px -50% 0px'}).observe(heroEl);
