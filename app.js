const products=[
{id:'mascarilla-crema',name:'Mascarilla-Crema Nocturna',type:'Mascarilla',phase:'Luna Llena',skin:['seca','normal'],price:18.00,desc:'Tratamiento nocturno de textura cremosa para despertar con una sensación de confort y suavidad.',benefits:['Nutre y suaviza','Sensación de confort','Ideal para rutina nocturna'],how:'Aplicar una capa fina sobre el rostro limpio y dejar actuar durante la noche.',icon:'jar'},
{id:'exfoliante',name:'Exfoliante Lunar',type:'Exfoliante',phase:'Luna Menguante',skin:['mixta','grasa'],price:14.00,desc:'Exfoliante suave pensado para ayudar a retirar células superficiales y dejar la piel más uniforme.',benefits:['Ayuda a renovar la superficie','Suaviza la textura','Uso ocasional'],how:'Usar sobre piel húmeda con movimientos suaves. Evitar el contorno de ojos.',icon:'bottle'},
{id:'limpiador',name:'Limpiador Facial',type:'Limpiador',phase:'Luna Nueva',skin:['sensible','mixta','seca'],price:12.50,desc:'Limpiador de uso diario para retirar suciedad, sudor y residuos sin dejar una sensación pesada.',benefits:['Limpieza diaria','Sensación fresca','Textura ligera'],how:'Masajear sobre rostro húmedo y enjuagar con agua. Usar mañana y noche.',icon:'bottle'},
{id:'tonico',name:'Tónico Equilibrante',type:'Tónico',phase:'Luna Creciente',skin:['mixta','grasa','normal'],price:13.50,desc:'Tónico ligero para acompañar una rutina equilibrada y preparar la piel para los siguientes pasos.',benefits:['Refresca','Prepara la piel','Textura acuosa'],how:'Aplicar con las manos limpias o algodón después de limpiar el rostro.',icon:'bottle'},
{id:'crema-corporal',name:'Crema Corporal Luna',type:'Crema corporal',phase:'Luna Azul',skin:['seca','normal'],price:16.00,desc:'Crema corporal de acabado suave para acompañar el ritual nocturno más allá del rostro.',benefits:['Suavidad duradera','Sensación nutritiva','Ritual nocturno'],how:'Aplicar sobre la piel limpia y masajear hasta absorber.',icon:'jar'},
{id:'serum',name:'Sérum de Noche',type:'Sérum',phase:'Luna Llena',skin:['grasa','mixta'],price:21.00,desc:'Fórmula prevista para complementar rutinas de noche.',benefits:['Ligero','Próxima fórmula','Rutina nocturna'],how:'Próximamente.',icon:'bottle',soon:true},
{id:'balsamo',name:'Bálsamo Reparador',type:'Bálsamo',phase:'Luna Nueva',skin:['sensible','seca'],price:19.00,desc:'Bálsamo de confort en desarrollo para pieles que prefieren rutinas minimalistas.',benefits:['Confort','Textura rica','Próximamente'],how:'Próximamente.',icon:'jar',soon:true},
{id:'gel',name:'Gel Purificante',type:'Gel',phase:'Luna Menguante',skin:['grasa'],price:15.00,desc:'Gel facial en desarrollo para rutinas enfocadas en piel grasa.',benefits:['Textura fresca','Rutina nocturna','Próximamente'],how:'Próximamente.',icon:'bottle',soon:true},
{id:'bruma',name:'Bruma Calmante',type:'Bruma',phase:'Luna Nueva',skin:['sensible'],price:11.00,desc:'Bruma ligera en desarrollo para acompañar momentos de calma.',benefits:['Ligera','Refrescante','Próximamente'],how:'Próximamente.',icon:'bottle',soon:true},
{id:'aceite',name:'Aceite Lunar',type:'Aceite',phase:'Luna Creciente',skin:['seca'],price:22.00,desc:'Aceite facial de noche en desarrollo para piel seca.',benefits:['Nutritivo','Acabado luminoso','Próximamente'],how:'Próximamente.',icon:'bottle',soon:true}
];
const phaseData={
'Llena':{name:'Luna Llena',skin:'Piel grasa',desc:'Catálogo pensado para rutinas que buscan texturas ligeras y una sensación equilibrada.'},
'Menguante':{name:'Luna Menguante',skin:'Piel mixta',desc:'Una selección para acompañar zonas con necesidades diferentes.'},
'Nueva':{name:'Luna Nueva',skin:'Piel sensible',desc:'Rutinas minimalistas y de confort para piel que prefiere menos pasos.'},
'Creciente':{name:'Luna Creciente',skin:'Piel seca',desc:'Texturas más envolventes para un ritual nocturno de nutrición y suavidad.'},
'Azul':{name:'Luna Azul',skin:'Piel normal',desc:'Una rutina versátil para mantener una sensación cómoda y equilibrada.'}
};
function money(n){return '$'+n.toFixed(2)}
function cart(){return JSON.parse(localStorage.getItem('luaCart')||'[]')}
function saveCart(c){localStorage.setItem('luaCart',JSON.stringify(c));updateCartCount()}
function updateCartCount(){const n=cart().reduce((a,x)=>a+x.qty,0);document.querySelectorAll('.cart-count').forEach(e=>e.textContent=n)}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p||p.soon)return;const c=cart();const found=c.find(x=>x.id===id);if(found)found.qty++;else c.push({id,qty:1});saveCart(c);toast('Producto añadido al carrito');}
function toast(t){const el=document.querySelector('.toast');if(!el)return;el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
function productVisual(p,large=false){return `<div class="${p.icon==='jar'?'jar':'bottle'}" ${large?'style="transform:scale(1.5)"':''}></div>`}
function productCard(p){return `<article class="product-card ${p.soon?'soon':''}"><a href="product.html?id=${p.id}"><div class="product-visual">${productVisual(p)}${p.soon?'<div class="coming">Próximamente</div>':''}</div></a><span class="pill">${p.phase}</span><h3>${p.name}</h3><p>${p.desc}</p><div class="card-row"><span class="price">${p.soon?'Próximamente':money(p.price)}</span>${p.soon?'<button class="mini-btn" disabled>Próximamente</button>':`<button class="mini-btn" onclick="event.preventDefault();addToCart('${p.id}')">+ Carrito</button>`}</div></article>`}
function renderProducts(target, list=products){const el=document.querySelector(target);if(el)el.innerHTML=list.map(productCard).join('')}

function setupShared(){
 const h=document.querySelector('#header');
 if(h) h.innerHTML=`<header class="navbar"><div class="container nav"><a class="brand" href="index.html"><span class="moon-logo"></span>LuaShop</a><nav class="navlinks"><a href="index.html">Inicio</a><a href="catalogo.html">Catálogo</a><a href="analizador.html">Analiza tu piel</a><a href="nosotros.html">Nuestra luna</a><a href="contacto.html">Contacto</a></nav><div class="nav-actions"><a class="icon-btn" href="cuenta.html" aria-label="Cuenta">◌</a><a class="icon-btn" href="carrito.html" aria-label="Carrito">🛒<span class="cart-count">0</span></a><button class="icon-btn hamb" aria-label="Menú">☰</button></div></div></header>`;
 const f=document.querySelector('#footer');
 if(f) f.innerHTML=`<footer class="footer"><div class="container"><div class="footer-grid"><div><div class="brand" style="color:white"><span class="moon-logo"></span>LuaShop</div><p style="line-height:1.7;max-width:330px">Piel radiante, cuidado constante. Un ritual nocturno inspirado en las fases de la luna.</p></div><div><h3>Explora</h3><a href="catalogo.html">Catálogo</a><a href="analizador.html">Analizador de rostro</a><a href="nosotros.html">Nuestra historia</a></div><div><h3>Ayuda</h3><a href="cuenta.html">Iniciar sesión / Registro</a><a href="carrito.html">Carrito</a><a href="checkout.html">Pago</a></div><div><h3>Contacto</h3><a href="tel:75490359">75490359</a><a href="https://instagram.com/luuashopp" target="_blank">Instagram · @luuashopp</a><a href="contacto.html">Chat Lua IA</a></div></div><div class="footer-bottom"><span>© 2026 LuaShop · Prototipo escolar</span><span>Piel radiante, cuidado constante.</span></div></div></footer>`;
 setupNav();
}

function setupNav(){document.querySelector('.hamb')?.addEventListener('click',()=>document.querySelector('.navlinks')?.classList.toggle('mobile'));updateCartCount();document.querySelectorAll('[data-logout]').forEach(b=>b.addEventListener('click',()=>{localStorage.removeItem('luaUser');toast('Sesión cerrada')}))}
function initCatalog(){let active='all';const grid=document.querySelector('#catalogGrid');const title=document.querySelector('#catalogTitle');const buttons=document.querySelectorAll('.filter-btn');function go(){let list=products;if(active!=='all')list=products.filter(p=>p.skin.includes(active));title.textContent=active==='all'?'Todos los productos':`Catálogo · ${active}`;grid.innerHTML=list.map(productCard).join('');}buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(x=>x.classList.remove('active'));b.classList.add('active');active=b.dataset.filter;go()}));go()}
function initProduct(){const id=new URLSearchParams(location.search).get('id')||'limpiador';const p=products.find(x=>x.id===id)||products[0];document.querySelector('#detailVisual').innerHTML=productVisual(p,true);document.querySelector('#productName').textContent=p.name;document.querySelector('#productType').textContent=p.type+' · '+p.phase;document.querySelector('#productDesc').textContent=p.desc;document.querySelector('#productPrice').textContent=p.soon?'Próximamente':money(p.price);document.querySelector('#productBenefits').innerHTML=p.benefits.map(x=>`<div class="spec"><strong>Beneficio</strong>${x}</div>`).join('');document.querySelector('#productHow').textContent=p.how;const add=document.querySelector('#addProduct');if(p.soon){add.disabled=true;add.textContent='Próximamente'}else add.onclick=()=>addToCart(p.id)}
function initCart(){const wrap=document.querySelector('#cartItems');const summary=document.querySelector('#summary');function draw(){const c=cart();if(!c.length){wrap.innerHTML='<div style="padding:40px;text-align:center"><h2 class="serif">Tu carrito está vacío</h2><p style="color:var(--muted)">Explora el ritual nocturno de LuaShop.</p><a class="btn btn-primary" href="catalogo.html">Ver catálogo</a></div>';summary.innerHTML='';return}let total=0;wrap.innerHTML=c.map(i=>{const p=products.find(x=>x.id===i.id);const sub=p.price*i.qty;total+=sub;return `<div class="cart-item"><div class="thumb">${productVisual(p)}</div><div><strong>${p.name}</strong><div style="color:var(--muted);font-size:.84rem">${money(p.price)} · ${p.phase}</div><div class="qty" style="margin-top:8px"><button onclick="changeQty('${p.id}',-1)">−</button><span>${i.qty}</span><button onclick="changeQty('${p.id}',1)">+</button></div></div><strong>${money(sub)}</strong></div>`}).join('');const shipping=total>=40?0:4.5;summary.innerHTML=`<h2 class="serif">Resumen</h2><div class="summary-line"><span>Subtotal</span><span>${money(total)}</span></div><div class="summary-line"><span>Envío</span><span>${shipping?money(shipping):'Gratis'}</span></div><div class="summary-line summary-total"><span>Total</span><span>${money(total+shipping)}</span></div><a class="btn btn-primary" style="width:100%;margin-top:14px" href="checkout.html">Continuar al pago</a>`}window.changeQty=(id,d)=>{const c=cart();const x=c.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)c.splice(c.indexOf(x),1);saveCart(c);draw()};draw()}
function initCheckout(){const c=cart();const total=c.reduce((s,i)=>{const p=products.find(x=>x.id===i.id);return s+p.price*i.qty},0);document.querySelector('#checkoutTotal').textContent=money(total+(total>=40?0:4.5));document.querySelector('#payForm')?.addEventListener('submit',e=>{e.preventDefault();const order='LU-'+Math.floor(100000+Math.random()*899999);localStorage.removeItem('luaCart');document.querySelector('#paymentArea').innerHTML=`<div class="notice" style="text-align:center;padding:35px"><h2 class="serif">¡Pedido confirmado!</h2><p>Tu pedido <strong>${order}</strong> quedó registrado como demostración del prototipo.</p><p>No se realizó ningún cobro real.</p><a class="btn btn-primary" href="index.html">Volver a LuaShop</a></div>`;updateCartCount()})}
function initAuth(){document.querySelector('#authForm')?.addEventListener('submit',e=>{e.preventDefault();const name=document.querySelector('#authName')?.value||'Usuario Lua';localStorage.setItem('luaUser',name);toast('Cuenta guardada en este prototipo');setTimeout(()=>location.href='index.html',700)})}
let skinModel = null;
let faceMesh = null;
let modelLoading = false;

const CLASS_NAMES = ['seca', 'grasa', 'mixta', 'sensible', 'normal'];
const MODEL_URL = 'tfjs_model/model.json';

const LANDMARK_INDICES = {
  forehead: [10, 151, 9, 8, 168, 6, 197, 195, 5, 4, 1, 19, 94, 2, 326, 327],
  leftCheek: [116, 117, 118, 119, 120, 121, 126, 142, 36, 205, 206, 207, 213, 192, 147, 187, 204, 203, 202, 201, 200, 199, 198],
  rightCheek: [345, 346, 347, 348, 349, 350, 355, 371, 266, 425, 426, 427, 433, 412, 376, 411, 424, 423, 422, 421, 420, 419, 418],
  chin: [152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109]
};

async function loadSkinModel() {
  if (skinModel || modelLoading) return skinModel;
  modelLoading = true;
  const loadingEl = document.getElementById('modelLoading');
  const progressEl = document.getElementById('loadingProgress');
  const textEl = document.getElementById('loadingText');
  if (loadingEl) loadingEl.style.display = 'flex';
  
  try {
    if (progressEl) progressEl.textContent = 'Descargando arquitectura...';
    skinModel = await tf.loadGraphModel(MODEL_URL);
    if (progressEl) progressEl.textContent = 'Calentando modelo...';
    const warmup = tf.zeros([1, 224, 224, 3]);
    await skinModel.predict(warmup).data();
    warmup.dispose();
    if (textEl) textEl.textContent = '¡Modelo listo!';
    if (progressEl) progressEl.textContent = 'Inicializando Face Mesh...';
  } catch (e) {
    console.error('Error cargando modelo:', e);
    if (textEl) textEl.textContent = 'Error cargando modelo. Usando modo demo.';
    if (progressEl) progressEl.textContent = 'Fallback a análisis aleatorio';
    skinModel = null;
  } finally {
    modelLoading = false;
    setTimeout(() => { if (loadingEl) loadingEl.style.display = 'none'; }, 1000);
  }
  return skinModel;
}

function initFaceMesh() {
  console.log('initFaceMesh called, FaceMesh defined:', typeof FaceMesh !== 'undefined');
  if (typeof FaceMesh === 'undefined') {
    console.error('FaceMesh NOT loaded from CDN!');
    const scanStatus = document.getElementById('scanStatus');
    if (scanStatus) scanStatus.textContent = '⚠️ FaceMesh CDN falló - recarga o prueba Chrome incógnito';
    return null;
  }
  faceMesh = new FaceMesh({
    locateFile: (file) => `https://storage.googleapis.com/mediapipe-models/face_mesh/face_mesh_js/${file}`
  });
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  console.log('FaceMesh instance created');
  return faceMesh;
}

function getFaceBoundingBox(landmarks, indices, width, height, padding = 0.15) {
  let minX = 1, minY = 1, maxX = 0, maxY = 0;
  for (const idx of indices) {
    const lm = landmarks[idx];
    if (lm) {
      minX = Math.min(minX, lm.x);
      minY = Math.min(minY, lm.y);
      maxX = Math.max(maxX, lm.x);
      maxY = Math.max(maxY, lm.y);
    }
  }
  const w = maxX - minX;
  const h = maxY - minY;
  minX = Math.max(0, minX - w * padding);
  minY = Math.max(0, minY - h * padding);
  maxX = Math.min(1, maxX + w * padding);
  maxY = Math.min(1, maxY + h * padding);
  return {
    x: minX * width,
    y: minY * height,
    width: (maxX - minX) * width,
    height: (maxY - minY) * height
  };
}

function extractFaceCrops(video, landmarks) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  canvas.width = vw;
  canvas.height = vh;
  ctx.drawImage(video, 0, 0, vw, vh);
  
  const crops = [];
  const regions = ['forehead', 'leftCheek', 'rightCheek', 'chin'];
  
  for (const region of regions) {
    const box = getFaceBoundingBox(landmarks, LANDMARK_INDICES[region], vw, vh);
    if (box.width < 20 || box.height < 20) continue;
    
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = 224;
    cropCanvas.height = 224;
    const cropCtx = cropCanvas.getContext('2d');
    cropCtx.drawImage(
      canvas,
      box.x, box.y, box.width, box.height,
      0, 0, 224, 224
    );
    crops.push(cropCanvas);
  }
  return crops;
}

async function predictSkinType(crops) {
  if (!skinModel || crops.length === 0) return null;
  
  const predictions = [];
  for (const crop of crops) {
    const tensor = tf.browser.fromPixels(crop).toFloat().div(255.0).expandDims(0);
    const pred = await skinModel.predict(tensor).data();
    predictions.push(Array.from(pred));
    tensor.dispose();
  }
  
  const avgPred = predictions[0].map((_, i) => 
    predictions.reduce((sum, p) => sum + p[i], 0) / predictions.length
  );
  
  const maxIdx = avgPred.indexOf(Math.max(...avgPred));
  return {
    skinType: CLASS_NAMES[maxIdx],
    confidence: avgPred[maxIdx],
    allScores: CLASS_NAMES.reduce((obj, name, i) => { obj[name] = avgPred[i]; return obj; }, {})
  };
}

function renderResults(prediction) {
  const result = document.querySelector('#analysisResult');
  const scanStatus = document.getElementById('scanStatus');
  if (!result) return;
  
  if (!prediction) {
    const skin = CLASS_NAMES[Math.floor(Math.random() * CLASS_NAMES.length)];
    const rec = products.filter(p => !p.soon && p.skin.includes(skin)).slice(0, 3);
    result.innerHTML = `
      <span class="eyebrow">Resultado orientativo (modo demo)</span>
      <div class="score">${skin}</div>
      <p style="color:var(--muted);line-height:1.7">El análisis estima que una rutina para piel <strong>${skin}</strong> podría priorizar limpieza, equilibrio e hidratación.</p>
      <div class="notice">Modo demo: modelo IA no disponible. No sustituye valoración dermatológica.</div>
      <h3 class="serif" style="font-size:1.6rem;margin-top:24px">Tu ritual Lua</h3>
      ${rec.map(p => `<a class="recommendation" href="product.html?id=${p.id}"><div class="mini-icon">✦</div><div><strong>${p.name}</strong><div style="font-size:.8rem;color:var(--muted)">${p.phase} · ${money(p.price)}</div></div></a>`).join('')}
    `;
    if (scanStatus) scanStatus.textContent = '⚠️ Modo demo (modelo no cargado)';
    return;
  }
  
  const { skinType, confidence, allScores } = prediction;
  const rec = products.filter(p => !p.soon && p.skin.includes(skinType)).slice(0, 3);
  const confidencePct = Math.round(confidence * 100);
  
  result.innerHTML = `
    <span class="eyebrow">Análisis completado</span>
    <div class="score">${skinType}</div>
    <div style="margin:12px 0;display:flex;align-items:center;gap:10px">
      <div style="flex:1;height:8px;background:var(--line);border-radius:4px;overflow:hidden">
        <div style="width:${confidencePct}%;height:100%;background:linear-gradient(90deg,var(--gold),var(--marzipan));transition:width .5s"></div>
      </div>
      <span style="font-weight:700;color:var(--gold)">${confidencePct}%</span>
    </div>
    <p style="color:var(--muted);line-height:1.7;font-size:.9rem">Confianza del modelo: <strong>${confidencePct}%</strong>. Las puntuaciones por categoría:</p>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin:12px 0;font-size:.75rem">
      ${CLASS_NAMES.map(name => `<span class="pill" style="background:${name===skinType?'var(--buttermilk)':'var(--line)'};color:${name===skinType?'var(--bistre)':'var(--muted)'}">${name}: ${Math.round(allScores[name]*100)}%</span>`).join('')}
    </div>
    <div class="notice">Este análisis es orientativo y no sustituye una valoración dermatológica. El modelo se ejecuta localmente en tu navegador.</div>
    <h3 class="serif" style="font-size:1.6rem;margin-top:24px">Tu ritual Lua</h3>
    ${rec.map(p => `<a class="recommendation" href="product.html?id=${p.id}"><div class="mini-icon">✦</div><div><strong>${p.name}</strong><div style="font-size:.8rem;color:var(--muted)">${p.phase} · ${money(p.price)}</div></div></a>`).join('')}
  `;
  
  if (scanStatus) scanStatus.textContent = `✓ Análisis completado (${confidencePct}% confianza)`;
}

function initAnalyzer() {
  const video = document.querySelector('#cameraVideo');
  const start = document.querySelector('#startCamera');
  const scan = document.querySelector('#scanFace');
  const result = document.querySelector('#analysisResult');
  const cameraHint = document.getElementById('cameraHint');
  const scanStatus = document.getElementById('scanStatus');
  let stream = null;
  let lastLandmarks = null;
  let isAnalyzing = false;
  let faceMeshReady = false;
  
  loadSkinModel();
  const fm = initFaceMesh();
  
  if (fm) {
    // Debug canvas para ver landmarks
    const debugCanvas = document.createElement('canvas');
    debugCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;opacity:0.7';
    const cameraDiv = document.querySelector('.camera');
    if (cameraDiv) cameraDiv.appendChild(debugCanvas);
    const debugCtx = debugCanvas.getContext('2d');
    
    fm.onResults((results) => {
      console.log('FaceMesh results:', results.multiFaceLandmarks?.length || 0, 'faces');
      
      // Dibujar landmarks en debug canvas
      if (video.videoWidth && video.videoHeight) {
        debugCanvas.width = video.videoWidth;
        debugCanvas.height = video.videoHeight;
        debugCtx.clearRect(0, 0, debugCanvas.width, debugCanvas.height);
        if (results.multiFaceLandmarks) {
          for (const landmarks of results.multiFaceLandmarks) {
            debugCtx.fillStyle = '#0f0';
            for (const pt of landmarks) {
              debugCtx.beginPath();
              debugCtx.arc(pt.x * debugCanvas.width, pt.y * debugCanvas.height, 2, 0, 2 * Math.PI);
              debugCtx.fill();
            }
            // Dibujar conexiones clave (malla facial)
            debugCtx.strokeStyle = '#0f0';
            debugCtx.lineWidth = 1;
            const connections = [
              [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
              [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20],
              [33, 133], [133, 173], [173, 157], [157, 150], [150, 149], [149, 176], [176, 148], [148, 152],
              [263, 362], [362, 398], [398, 384], [384, 381], [381, 380], [380, 374], [374, 373], [373, 390],
              [61, 146], [146, 91], [91, 181], [181, 84], [84, 17], [17, 314], [314, 405], [405, 291]
            ];
            for (const [i, j] of connections) {
              if (landmarks[i] && landmarks[j]) {
                debugCtx.beginPath();
                debugCtx.moveTo(landmarks[i].x * debugCanvas.width, landmarks[i].y * debugCanvas.height);
                debugCtx.lineTo(landmarks[j].x * debugCanvas.width, landmarks[j].y * debugCanvas.height);
                debugCtx.stroke();
              }
            }
          }
        }
      }
      
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        lastLandmarks = results.multiFaceLandmarks[0];
        if (cameraHint) cameraHint.style.display = 'none';
        if (scanStatus) scanStatus.textContent = '✓ Rostro detectado - Pulsa Analizar';
        if (scan) scan.disabled = false;
      } else {
        if (cameraHint) cameraHint.style.display = 'block';
        if (scanStatus) scanStatus.textContent = 'Buscando rostro... colócate frente a la cámara';
        if (scan) scan.disabled = true;
      }
    });
    faceMeshReady = true;
    console.log('FaceMesh initialized with debug canvas');
  } else {
    console.error('FaceMesh NOT loaded - check CDN');
    if (scanStatus) scanStatus.textContent = '⚠️ FaceMesh no cargó - recarga la página';
  }
  
  start?.addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      video.srcObject = stream;
      video.style.display = 'block';
      start.textContent = 'Cámara activa';
      start.disabled = true;
      
      await video.play();
      console.log('Video playing:', video.videoWidth, 'x', video.videoHeight);
      
      if (scanStatus) scanStatus.textContent = 'Iniciando detección facial...';
      
      // Debug toggle
      const toggleDebug = document.getElementById('toggleDebug');
      const debugCanvas = document.querySelector('.camera canvas');
      if (toggleDebug && debugCanvas) {
        let debugVisible = true;
        toggleDebug.addEventListener('click', () => {
          debugVisible = !debugVisible;
          debugCanvas.style.display = debugVisible ? 'block' : 'none';
          toggleDebug.textContent = debugVisible ? '🔍 Debug ON' : '🔍 Debug OFF';
        });
      }
      
      if (fm) {
        const detectLoop = async () => {
          if (video.srcObject && video.readyState >= 2) {
            try {
              await fm.send({ image: video });
            } catch (e) { console.warn('FaceMesh send error:', e); }
            requestAnimationFrame(detectLoop);
          } else if (video.srcObject) {
            requestAnimationFrame(detectLoop);
          }
        };
        detectLoop();
      }
    } catch (e) {
      toast('No se pudo acceder a la cámara');
      console.error('Camera error:', e);
    }
  });
  
  scan?.addEventListener('click', async () => {
    if (isAnalyzing || !lastLandmarks) {
      toast('Espera a que se detecte tu rostro (verás "✓ Rostro detectado")');
      return;
    }
    if (!skinModel) {
      if (scanStatus) scanStatus.textContent = 'Cargando modelo IA...';
      await loadSkinModel();
    }
    
    isAnalyzing = true;
    scan.disabled = true;
    scan.textContent = 'Analizando...';
    if (scanStatus) scanStatus.textContent = 'Procesando imagen...';
    
    try {
      const crops = extractFaceCrops(video, lastLandmarks);
      if (crops.length === 0) throw new Error('No se pudieron extraer regiones faciales');
      console.log('Crops extracted:', crops.length);
      
      if (scanStatus) scanStatus.textContent = 'Ejecutando modelo IA...';
      const prediction = await predictSkinType(crops);
      
      renderResults(prediction);
    } catch (e) {
      console.error('Error en análisis:', e);
      toast('Error en el análisis, intentando modo demo');
      renderResults(null);
    } finally {
      isAnalyzing = false;
      scan.disabled = false;
      scan.textContent = 'Analizar';
    }
  });
}
function initChat(){const toggle=document.querySelector('#chatToggle'),panel=document.querySelector('#chatPanel'),form=document.querySelector('#chatForm'),input=document.querySelector('#chatInput'),msgs=document.querySelector('#messages');toggle?.addEventListener('click',()=>panel.classList.toggle('open'));form?.addEventListener('submit',e=>{e.preventDefault();const text=input.value.trim();if(!text)return;msgs.insertAdjacentHTML('beforeend',`<div class="msg user">${text.replace(/[<>]/g,'')}</div>`);input.value='';setTimeout(()=>{let reply='Puedo ayudarte con productos, tipos de piel, pedidos y el catálogo de LuaShop.';if(/producto|piel/i.test(text))reply='Puedes usar el Analizador de Rostro como orientación y después explorar el catálogo por tipo de piel.';if(/contacto|instagram|ig/i.test(text))reply='Contacto: 75490359 · Instagram: @luuashopp';msgs.insertAdjacentHTML('beforeend',`<div class="msg bot">${reply}</div>`);msgs.scrollTop=msgs.scrollHeight},400)})}
document.addEventListener('DOMContentLoaded',()=>{setupNav();initAuth();initChat();if(document.querySelector('#featuredGrid'))renderProducts('#featuredGrid',products.slice(0,5));if(document.querySelector('#catalogGrid'))initCatalog();if(document.querySelector('#detailVisual'))initProduct();if(document.querySelector('#cartItems'))initCart();if(document.querySelector('#checkoutTotal'))initCheckout();if(document.querySelector('#cameraVideo'))initAnalyzer()});
