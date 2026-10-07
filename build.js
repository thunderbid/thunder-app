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
    .replace(/<script id="thunder-mobile-source-runtime">[\s\S]*?<\/script>/g, "")
    .replace(/<style id="thunder-wallet-token-authority">[\s\S]*?<\/style>/g, "")
    .replace(/<script id="thunder-wallet-token-runtime">[\s\S]*?<\/script>/g, "");

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

  /* Phone authority: the old video/auth hero must never occupy mobile layout space. */
  .videoHero,#videoHero,.authHero,#authHero,
  [class~="videoHero"],[id~="videoHero"]{
    display:none!important;
    visibility:hidden!important;
    opacity:0!important;
    position:absolute!important;
    width:0!important;height:0!important;min-height:0!important;max-height:0!important;
    margin:0!important;padding:0!important;border:0!important;
    overflow:hidden!important;pointer-events:none!important;
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

@media(min-width:761px){
  #thMobileSourceHero,#thPullSource,[id*="PullSource"],[class*="pullRefresh"],[class*="pull-refresh"]{
    display:none!important;
    visibility:hidden!important;
    opacity:0!important;
    pointer-events:none!important;
  }
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
<!-- THUNDER_MOBILE_PATCH_END -->
`;


const walletTokenCss = `
<style id="thunder-wallet-token-authority">
#thWalletFeedHero .thWalletTokenVisual{
  width:96px;height:96px;flex:0 0 96px;display:grid;place-items:center;
  border-radius:50%;overflow:hidden;background:transparent!important;
  border:0!important;box-shadow:none!important
}
#thWalletFeedHero .thWalletTokenVisual img{
  display:block;width:100%;height:100%;object-fit:contain;border:0!important;
  border-radius:50%;background:transparent!important;box-shadow:none!important
}
#thWalletFeedHero .thWalletFeedHeroMark,\n#thWalletFeedHero .thWalletFeedHeroCoin svg,
#thWalletFeedHero .thWalletFeedCoinInner,
#thWalletFeedHero .thWalletVisual svg,
#thWalletFeedHero .thWalletVisual .walletIcon,
#thWalletFeedHero .thWalletVisual [class*="walletIcon"]{display:none!important}
@media(max-width:760px){
  #thWalletFeedHero .thWalletTokenVisual{width:78px;height:78px;flex-basis:78px}
}
</style>`;

const walletTokenRuntime = `
<script id="thunder-wallet-token-runtime">
(()=>{
  const TOKEN="/wallet/thunder-coin.webp";
  function apply(){
    const card=document.getElementById("thWalletFeedHero");
    if(!card)return;

    const coin=card.querySelector(".thWalletFeedHeroCoin");
    if(!coin)return;
    if(coin.dataset.thToken==="1")return;

    coin.dataset.thToken="1";
    coin.classList.add("thWalletTokenVisual");
    coin.innerHTML='<img src="'+TOKEN+'" alt="ODIN token" loading="eager" decoding="async">';
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",apply,{once:true});
  } else {
    apply();
  }
  setTimeout(apply,80);
  setTimeout(apply,500);
  setTimeout(apply,1500);
  new MutationObserver(apply).observe(document.documentElement,{subtree:true,childList:true});
})();
</script>`;

const runtime = `
<script id="thunder-mobile-source-runtime">
(()=>{
  const mq=matchMedia("(max-width:760px)");
  if(!mq.matches)return;

  const HIDE=".videoHero,#videoHero,.authHero,#authHero";

  function enforce(){
    const h=document.getElementById("thMobileSourceHero");
    const shell=document.querySelector(".shell");

    if(h){
      h.style.setProperty("display","block","important");
      if(shell && h.nextElementSibling!==shell && shell.parentNode){
        shell.parentNode.insertBefore(h,shell);
      }
    }

    document.querySelectorAll(HIDE).forEach(el=>{
      el.querySelectorAll("video").forEach(v=>{try{v.pause()}catch(_){} v.removeAttribute("autoplay")});
      el.style.setProperty("display","none","important");
      el.style.setProperty("visibility","hidden","important");
      el.style.setProperty("height","0","important");
      el.style.setProperty("min-height","0","important");
      el.style.setProperty("max-height","0","important");
      el.style.setProperty("margin","0","important");
      el.style.setProperty("padding","0","important");
      el.style.setProperty("overflow","hidden","important");
    });

    document.querySelectorAll("a,button,[role=button]").forEach(el=>{
      const t=(el.textContent||"").trim().toLowerCase();
      const key=((el.id||"")+" "+(el.className||"")+" "+(el.getAttribute("data-page")||"")+" "+(el.getAttribute("data-nav")||"")).toLowerCase();
      if((t==="wallet"||key.includes("wallet")) && el.closest(".left,aside,nav,.mobileNav")){
        el.style.setProperty("display","none","important");
      }
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",enforce,{once:true});
  else enforce();

  setTimeout(enforce,50);
  setTimeout(enforce,300);
  setTimeout(enforce,1000);
  new MutationObserver(enforce).observe(document.documentElement,{subtree:true,childList:true});
})();
</script>`;

(async()=>{
  fs.rmSync(DIST,{recursive:true,force:true});
  fs.mkdirSync(path.join(DIST,"wallet"),{recursive:true});
  fs.copyFileSync(path.join(process.cwd(),"assets","thunder-coin.webp"),path.join(DIST,"wallet","thunder-coin.webp"));

  let html = await get(BASE + "/?thunder_source=" + Date.now());
  html = cleanPreviousPatch(html);

  if (html.includes("</head>")) html = html.replace("</head>", css + walletTokenCss + "\n</head>");
  else html = css + html;

  const bodyMatch = html.match(/<body[^>]*>/i);
  if (bodyMatch) {
    html = html.replace(bodyMatch[0], bodyMatch[0] + "\n" + hero);
  } else {
    html = hero + html;
  }

  html = html.replace(
    /<span[^>]*class=["'][^"']*thWalletFeedHeroMark[^"']*["'][^>]*>[\s\S]*?<\/span>/i,
    ""
  );

  // Replace the legacy lightning coin inside the featured Wallet card with the real ODIN token artwork.
  html = html.replace(
    /<div([^>]*class=["'][^"']*thWalletFeedHeroCoin[^"']*["'][^>]*)>[\s\S]*?<\/div>\s*<\/div>/i,
    '<div$1 class="thWalletFeedHeroCoin thWalletTokenVisual"><img src="/wallet/thunder-coin.webp" alt="ODIN token" loading="eager" decoding="async"></div>'
  );

  if (html.includes("</body>")) html = html.replace("</body>", walletTokenRuntime + runtime + "\n</body>");
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
