const fs = require("fs");
const path = require("path");

const BASE = "https://thunder.bid";
const DIST = path.join(process.cwd(), "dist");

async function get(url, binary = false) {
  const r = await fetch(url, {
    headers: {
      "user-agent": "THUNDER-Pages-Bootstrap/1.0",
      "cache-control": "no-cache"
    }
  });
  if (!r.ok) throw new Error(`${url} -> HTTP ${r.status}`);
  return binary ? Buffer.from(await r.arrayBuffer()) : await r.text();
}

function cleanPreviousPatch(html) {
  return html
    .replace(/<!-- THUNDER_MOBILE_PATCH_START -->[\s\S]*?<!-- THUNDER_MOBILE_PATCH_END -->/g, "")
    .replace(/<style id="thunder-mobile-source-authority">[\s\S]*?<\/style>/g, "")
    .replace(/<script id="thunder-mobile-source-runtime">[\s\S]*?<\/script>/g, "");
}

const css = `
<style id="thunder-mobile-source-authority">
#thMobileSourceHero{display:none}
@media(max-width:760px){
  html,body{
    margin:0!important;
    padding:0!important;
    width:100%!important;
    min-height:100%!important;
    overflow-x:hidden!important;
    background:#050506!important;
  }

  /* Real mobile hero: independent of the legacy desktop/video hero. */
  #thMobileSourceHero{
    display:block!important;
    position:relative!important;
    z-index:1000!important;
    isolation:isolate!important;
    overflow:hidden!important;
    width:auto!important;
    min-height:350px!important;
    margin:8px 9px 14px!important;
    padding:0!important;
    border-radius:15px!important;
    border:1px solid rgba(255,255,255,.075)!important;
    background:
      radial-gradient(330px 210px at 78% 20%,rgba(255,232,77,.09),transparent 62%),
      radial-gradient(280px 190px at 5% 105%,rgba(78,92,190,.08),transparent 65%),
      linear-gradient(155deg,#11110e 0%,#080809 52%,#050506 100%)!important;
    box-shadow:0 22px 55px rgba(0,0,0,.3)!important;
    color:#f2f1eb!important;
  }

  #thMobileSourceHero .grid{
    position:absolute;z-index:-2;inset:0;opacity:.18;
    background-image:
      linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);
    background-size:32px 32px;
    mask-image:linear-gradient(to bottom,black,transparent 78%);
  }
  #thMobileSourceHero .beam{
    position:absolute;z-index:-1;top:-50%;left:42%;width:1px;height:190%;
    background:linear-gradient(transparent,rgba(255,232,77,.55),transparent);
    box-shadow:0 0 32px rgba(255,232,77,.18);
    transform:rotate(28deg);
    animation:thSourceBeam 5.5s ease-in-out infinite;
  }
  #thMobileSourceHero .meta{
    display:flex;align-items:center;justify-content:space-between;
    padding:14px 15px 0;color:#696a66;font:900 6px/1 system-ui,sans-serif;letter-spacing:.12em;
  }
  #thMobileSourceHero .meta span{display:flex;align-items:center;gap:6px}
  #thMobileSourceHero .meta i{
    width:5px;height:5px;border-radius:50%;background:#8be0a9;
    box-shadow:0 0 9px rgba(139,224,169,.35)
  }
  #thMobileSourceHero .meta b{font-size:6px;color:#898b85}
  #thMobileSourceHero .core{padding:58px 16px 38px}
  #thMobileSourceHero .over{
    font:950 6.5px/1 system-ui,sans-serif;letter-spacing:.21em;color:#72736d
  }
  #thMobileSourceHero h1{
    position:relative;width:max-content;margin:6px 0 9px;
    font:950 49px/.9 system-ui,sans-serif;letter-spacing:-.065em;color:#f2f1eb
  }
  #thMobileSourceHero h1:before,#thMobileSourceHero h1:after{
    content:attr(data-text);position:absolute;inset:0;pointer-events:none;opacity:0
  }
  #thMobileSourceHero h1:before{
    color:#ffe84d;clip-path:inset(0 0 55% 0);animation:thSourceGlitchA 4.8s infinite
  }
  #thMobileSourceHero h1:after{
    color:#7b8cff;clip-path:inset(62% 0 5% 0);animation:thSourceGlitchB 4.8s infinite
  }
  #thMobileSourceHero .sub{
    display:flex;align-items:center;gap:7px;color:#8c8d87;
    font:900 6px/1 system-ui,sans-serif;letter-spacing:.12em
  }
  #thMobileSourceHero .sub i{width:2px;height:2px;border-radius:50%;background:#ffe84d}
  #thMobileSourceHero p{
    margin:13px 0 0;color:#a09f99;font:500 9px/1.5 system-ui,sans-serif
  }
  #thMobileSourceHero .actions{
    display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;padding:0 15px
  }
  #thMobileSourceHero .actions a{
    min-height:43px;border-radius:9px;display:flex;align-items:center;justify-content:center;
    gap:8px;text-decoration:none!important;font:950 7.3px/1 system-ui,sans-serif;letter-spacing:.035em
  }
  #thMobileSourceHero .actions a:first-child{background:#ffe84d;color:#050505!important}
  #thMobileSourceHero .actions .more{
    padding:0 13px;background:#101011;border:1px solid rgba(255,255,255,.07);color:#aaa9a3!important
  }
  #thMobileSourceHero .actions .more span{color:#ffe84d}
  #thMobileSourceHero .foot{
    display:flex;justify-content:space-between;gap:10px;margin:12px 15px 0;padding:10px 0 13px;
    border-top:1px solid rgba(255,255,255,.045);
    font:850 5.5px/1 system-ui,sans-serif;letter-spacing:.09em;color:#555752
  }

  /* Hide actual legacy video media on phones, regardless of its container name. */
  video[autoplay], body>video, main video{
    display:none!important;
    visibility:hidden!important;
    opacity:0!important;
    width:0!important;height:0!important;min-height:0!important;
    pointer-events:none!important;
  }

  /* Wallet entry is intentionally absent from mobile/left navigation. */
  .left [data-page="wallet"],.left [data-nav="wallet"],.left a[href="#wallet"],
  aside [data-page="wallet"],aside [data-nav="wallet"],aside a[href="#wallet"],
  nav [data-page="wallet"],nav [data-nav="wallet"],nav a[href="#wallet"]{
    display:none!important
  }

  #thPullSource{
    position:fixed;z-index:2147483000;left:50%;
    top:calc(env(safe-area-inset-top,0px) + 8px);
    transform:translate(-50%,-75px);opacity:0;
    min-width:175px;height:46px;padding:0 13px;border-radius:24px;
    display:flex;align-items:center;gap:9px;
    background:rgba(8,8,9,.95);border:1px solid rgba(255,232,77,.13);
    box-shadow:0 12px 34px rgba(0,0,0,.4);backdrop-filter:blur(14px);
    transition:.17s ease;pointer-events:none
  }
  #thPullSource.on{transform:translate(-50%,0);opacity:1}
  #thPullSource .bolt{
    width:29px;height:29px;border-radius:50%;display:grid;place-items:center;
    color:#ffe84d;background:#13130f;border:1px solid rgba(255,232,77,.13)
  }
  #thPullSource .bolt:before{content:"ϟ";font:900 17px/1 system-ui}
  #thPullSource strong{display:block;color:#dddcd5;font:900 6.8px/1 system-ui;letter-spacing:.08em}
  #thPullSource small{display:block;margin-top:3px;color:#60615e;font:800 5.5px/1 system-ui;letter-spacing:.11em}

  @keyframes thSourceBeam{
    0%,100%{opacity:.2;transform:translateX(-40px) rotate(28deg)}
    50%{opacity:.72;transform:translateX(75px) rotate(28deg)}
  }
  @keyframes thSourceGlitchA{
    0%,91%,100%{opacity:0;transform:none}92%{opacity:.75;transform:translate(2px,-1px)}
    93%{opacity:0}94%{opacity:.45;transform:translate(-1px,0)}95%{opacity:0}
  }
  @keyframes thSourceGlitchB{
    0%,94%,100%{opacity:0;transform:none}95%{opacity:.6;transform:translate(-2px,1px)}
    96%{opacity:0}97%{opacity:.35;transform:translate(1px,0)}98%{opacity:0}
  }
}
@media(prefers-reduced-motion:reduce){
  #thMobileSourceHero .beam,#thMobileSourceHero h1:before,#thMobileSourceHero h1:after{animation:none!important}
}
</style>`;

const hero = `
<!-- THUNDER_MOBILE_PATCH_START -->
<section id="thMobileSourceHero" aria-label="THUNDER mobile">
  <div class="grid" aria-hidden="true"></div>
  <div class="beam" aria-hidden="true"></div>
  <div class="meta"><span><i></i>THUNDER NETWORK</span><b>84201 · LIVE</b></div>
  <div class="core">
    <div class="over">THE OLD WORLD IS ONLINE</div>
    <h1 data-text="THUNDER">THUNDER</h1>
    <div class="sub"><span>IDENTITY</span><i></i><span>ODIN</span><i></i><span>SOCIAL</span></div>
    <p>One wallet. One identity. One realm.</p>
  </div>
  <div class="actions">
    <a href="/wallet/THUNDER_WALLET.zip" download="THUNDER_WALLET.zip">GET THUNDER WALLET</a>
    <a class="more" href="/wallet/">v0.6.1 <span>→</span></a>
  </div>
  <div class="foot"><span>PRIVATE KEYS STAY LOCAL</span><span>POWERED BY ODIN</span></div>
</section>
<div id="thPullSource" aria-hidden="true">
  <div class="bolt"></div><div><strong id="thPullSourceTitle">PULL TO SYNC</strong><small>THUNDER NETWORK</small></div>
</div>
<!-- THUNDER_MOBILE_PATCH_END -->
`;

const runtime = `
<script id="thunder-mobile-source-runtime">
(()=>{
  if(!matchMedia("(max-width:760px)").matches)return;

  const hero=()=>document.getElementById("thMobileSourceHero");

  function placeHero(){
    const h=hero(); if(!h)return;
    const shell=document.querySelector(".shell");
    if(shell && h.nextElementSibling!==shell) shell.parentNode.insertBefore(h,shell);
  }

  function killLegacyVideo(){
    document.querySelectorAll("video").forEach(v=>{
      try{v.pause()}catch(_){}
      v.removeAttribute("autoplay");
      const r=v.getBoundingClientRect();
      v.style.setProperty("display","none","important");
      if(r.width>innerWidth*.75 || r.height>innerHeight*.35){
        let p=v.parentElement;
        for(let i=0;p && i<4;i++,p=p.parentElement){
          const key=((p.id||"")+" "+(p.className||"")).toLowerCase();
          const pr=p.getBoundingClientRect();
          if(/video|hero|intro|splash/.test(key) && pr.width>innerWidth*.75){
            p.style.setProperty("display","none","important");
            p.style.setProperty("height","0","important");
            p.style.setProperty("min-height","0","important");
            p.style.setProperty("margin","0","important");
            p.style.setProperty("padding","0","important");
            break;
          }
        }
      }
    });
  }

  function hideWalletNav(){
    document.querySelectorAll("a,button,[role=button]").forEach(el=>{
      const t=(el.textContent||"").trim().toLowerCase();
      const key=((el.id||"")+" "+(el.className||"")+" "+(el.getAttribute("data-page")||"")+" "+(el.getAttribute("data-nav")||"")).toLowerCase();
      if((t==="wallet" || key.includes("wallet")) && el.closest(".left,aside,nav,.mobileNav")){
        el.style.setProperty("display","none","important");
      }
    });
  }

  function enforce(){placeHero();killLegacyVideo();hideWalletNav()}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",enforce,{once:true}); else enforce();
  setTimeout(enforce,100);setTimeout(enforce,600);setTimeout(enforce,1600);

  new MutationObserver(enforce).observe(document.documentElement,{subtree:true,childList:true});

  let y0=0,pull=0,tracking=false,busy=false;
  const box=()=>document.getElementById("thPullSource");
  const title=()=>document.getElementById("thPullSourceTitle");
  addEventListener("touchstart",e=>{
    if(busy||scrollY>1||e.touches.length!==1)return;
    y0=e.touches[0].clientY;tracking=true;pull=0;
  },{passive:true});
  addEventListener("touchmove",e=>{
    if(!tracking||busy)return;
    const dy=e.touches[0].clientY-y0;
    if(dy<=0)return;
    pull=Math.min(100,dy*.5);
    if(pull<8)return;
    e.preventDefault();
    box()?.classList.add("on");
    if(title())title().textContent=pull>=62?"RELEASE TO SYNC":"PULL TO SYNC";
  },{passive:false});
  addEventListener("touchend",()=>{
    if(!tracking||busy)return;
    tracking=false;
    if(pull<62){box()?.classList.remove("on");return}
    busy=true;
    if(title())title().textContent="SYNCING THUNDER";
    if(navigator.vibrate)navigator.vibrate(18);
    setTimeout(()=>{
      if(title())title().textContent="THUNDER LIVE";
      setTimeout(()=>{box()?.classList.remove("on");busy=false;pull=0;location.reload()},380);
    },650);
  },{passive:true});
})();
</script>`;

(async()=>{
  fs.rmSync(DIST,{recursive:true,force:true});
  fs.mkdirSync(path.join(DIST,"wallet"),{recursive:true});

  let html = await get(BASE + "/?thunder_source=" + Date.now());
  html = cleanPreviousPatch(html);

  if (html.includes("</head>")) html = html.replace("</head>", css + "\n</head>");
  else html = css + html;

  if (html.includes("<body")) {
    html = html.replace(/(<body\\b[^>]*>)/i, "$1\n" + hero);
  } else {
    html = hero + html;
  }

  if (html.includes("</body>")) html = html.replace("</body>", runtime + "\n</body>");
  else html += runtime;

  fs.writeFileSync(path.join(DIST,"index.html"),html);

  const walletIndex = await get(BASE + "/wallet/?thunder_source=" + Date.now());
  fs.writeFileSync(path.join(DIST,"wallet","index.html"),walletIndex);
  fs.writeFileSync(path.join(DIST,"wallet","wallet.html"),walletIndex);

  const version = await get(BASE + "/wallet/version.json?thunder_source=" + Date.now());
  fs.writeFileSync(path.join(DIST,"wallet","version.json"),version);

  const walletZip = await get(BASE + "/wallet/THUNDER_WALLET.zip?thunder_source=" + Date.now(),true);
  fs.writeFileSync(path.join(DIST,"wallet","THUNDER_WALLET.zip"),walletZip);

  fs.writeFileSync(path.join(DIST,"_headers"), `/
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0
/index.html
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0
/wallet/version.json
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0
`);

  console.log("THUNDER build complete", {
    index: fs.statSync(path.join(DIST,"index.html")).size,
    wallet: walletZip.length
  });
})().catch(err=>{console.error(err);process.exit(1)});
