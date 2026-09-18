const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
if(menuToggle){menuToggle.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(isOpen));});}
document.querySelectorAll('.main-nav a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuToggle?.setAttribute('aria-expanded','false');}));

const aliasMap={oil:'oil',watercolor:'watercolor',china:'china',flowers:'flowers',acrylic:'acrylic',pleinair:'pleinair',photos:'photos'};
const filterButtons=document.querySelectorAll('.filter-btn');
const cards=document.querySelectorAll('.gallery-grid:not(.photo-gallery) .art-card');
filterButtons.forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter;
  filterButtons.forEach(btn=>btn.classList.remove('active'));
  button.classList.add('active');
  cards.forEach(card=>card.classList.toggle('is-hidden',filter!=='all'&&card.dataset.category!==aliasMap[filter]));
}));

// Separate quick visibility for the photo gallery (not shown in artwork filters).
const photoCards=document.querySelectorAll('.photo-gallery .art-card');

/* ---------- Lightbox ---------- */
const lb=document.getElementById('lightbox');
const lbImg=document.getElementById('lightbox-image');
const lbTitle=document.getElementById('lightbox-title');
const lbPrev=document.querySelector('.lightbox-prev');
const lbNext=document.querySelector('.lightbox-next');
const allOpeners=Array.from(document.querySelectorAll('.art-open'));
let currentIndex=0;

function showImage(index){
  currentIndex=(index+allOpeners.length)%allOpeners.length;
  const btn=allOpeners[currentIndex];
  lbImg.src=btn.dataset.image;
  lbImg.alt=btn.dataset.title;
  lbTitle.textContent=btn.dataset.title;
}
function openLightbox(index){
  showImage(index);
  lb.classList.add('open');
  lb.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}
function closeLightbox(){
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
  lbImg.src='';
}
allOpeners.forEach((button,index)=>{
  button.addEventListener('click',()=>openLightbox(index));
});
document.querySelector('.lightbox-close')?.addEventListener('click',closeLightbox);
lbPrev?.addEventListener('click',e=>{e.stopPropagation();showImage(currentIndex-1);});
lbNext?.addEventListener('click',e=>{e.stopPropagation();showImage(currentIndex+1);});
lb?.addEventListener('click',e=>{if(e.target===lb)closeLightbox();});
document.addEventListener('keydown',e=>{
  if(!lb.classList.contains('open'))return;
  if(e.key==='Escape')closeLightbox();
  if(e.key==='ArrowLeft')showImage(currentIndex-1);
  if(e.key==='ArrowRight')showImage(currentIndex+1);
});

/* ---------- Reveal on scroll ---------- */
const revealItems=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  },{
    threshold:0.01,
    rootMargin:'0px 0px -8% 0px'
  });
  revealItems.forEach(item=>observer.observe(item));

  // Страховка: через 1.2 с мягко проявляем то, что ещё не успело
  setTimeout(()=>{
    revealItems.forEach(item=>{
      if(!item.classList.contains('visible') && item.getBoundingClientRect().top < window.innerHeight){
        item.classList.add('visible');
      }
    });
  },1200);

  // Полная страховка: если пользователь долго не скроллит, а элементы всё ещё скрыты
  window.addEventListener('load',()=>{
    setTimeout(()=>revealItems.forEach(item=>item.classList.add('visible')),2500);
  });
}else{
  revealItems.forEach(item=>item.classList.add('visible'));
}
document.getElementById('year').textContent=new Date().getFullYear();