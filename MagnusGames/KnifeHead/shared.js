// ═══════════════════════════════════════════════════════════════════
//  KnifeHead — shared.js
//  Edit this file to change settings that apply to every level.
// ═══════════════════════════════════════════════════════════════════

// ── GAME CONFIG ──────────────────────────────────────────────────────────────
const GAME_CONFIG = {

    // ── Graphics ────────────────────────────────────────────────────────────
    renderer: {
        antialias:        true,
        pixelRatio:       1.5,       // cap to avoid GPU crash on high-DPI screens
        shadows:          true,
        toneMapping:      'ACESFilmic',
        toneMappingExposure: 0.9,
    },

    // ── Lighting ─────────────────────────────────────────────────────────────
    // Change these to make every level brighter/darker/warmer/cooler
    lighting: {
        ambientColor:     0x223344,
        ambientIntensity: 5.5,
        hemisphereTop:    0x223344,
        hemisphereBot:    0x110808,
        hemisphereIntensity: 1.2,
    },

    // ── Fog ──────────────────────────────────────────────────────────────────
    fog: {
        color:  0x080508,
        near:   35,
        far:    120,
    },

    // ── Player ───────────────────────────────────────────────────────────────
    player: {
        walkSpeed:    6,
        sprintSpeed:  13,
        eyeHeight:    2.5,         // default (overridden underground)
        fov:          75,
        near:         0.1,
        far:          300,
        mouseSensitivity: 0.002,
    },
};

// ─────────────────────────────────────────────────────────────────────────────
//  Apply renderer settings from config
// ─────────────────────────────────────────────────────────────────────────────
function applyRendererConfig(renderer) {
    const cfg = GAME_CONFIG.renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, cfg.pixelRatio));
    renderer.shadowMap.enabled = cfg.shadows;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = cfg.toneMappingExposure;
}

function applyLighting(scene) {
    const l = GAME_CONFIG.lighting;
    scene.add(new THREE.AmbientLight(l.ambientColor, l.ambientIntensity));
    scene.add(new THREE.HemisphereLight(l.hemisphereTop, l.hemisphereBot, l.hemisphereIntensity));
}

function applyFog(scene) {
    const f = GAME_CONFIG.fog;
    scene.fog = new THREE.Fog(f.color, f.near, f.far);
}

// ─────────────────────────────────────────────────────────────────────────────
//  TEXTURES  (shared across all levels)
// ─────────────────────────────────────────────────────────────────────────────
function makeTex(drawFn) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    drawFn(c.getContext('2d'), 512);
    const t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
}
function addNoise(ctx,s,base,range,alpha){for(let i=0;i<1800;i++){const v=base+(Math.random()-.5)*range;ctx.fillStyle=`rgba(${v|0},${(v-2)|0},${(v-4)|0},${alpha})`;const x=Math.random()*s,y=Math.random()*s,r=3+Math.random()*18;ctx.beginPath();ctx.ellipse(x,y,r,r*.6,Math.random()*Math.PI,0,Math.PI*2);ctx.fill();}}
function addCracks(ctx,s,count){ctx.strokeStyle='rgba(8,6,4,0.75)';for(let i=0;i<count;i++){let x=Math.random()*s,y=Math.random()*s;ctx.lineWidth=0.8+Math.random()*1.5;ctx.beginPath();ctx.moveTo(x,y);for(let j=0;j<6;j++){x+=(Math.random()-.5)*55;y+=(Math.random()-.5)*55;ctx.lineTo(x,y);}ctx.stroke();}}
function addStreaks(ctx,s,count){for(let i=0;i<count;i++){const x=Math.random()*s;ctx.strokeStyle=`rgba(12,10,8,${0.08+Math.random()*.22})`;ctx.lineWidth=2+Math.random()*5;ctx.beginPath();ctx.moveTo(x,0);ctx.bezierCurveTo(x+(Math.random()-.5)*25,s*.33,x+(Math.random()-.5)*25,s*.66,x+(Math.random()-.5)*20,s);ctx.stroke();}}
function addRust(ctx,s,count){for(let i=0;i<count;i++){const rx=Math.random()*s,ry=Math.random()*s*.5;ctx.fillStyle=`rgba(${80+Math.random()*40|0},${20+Math.random()*15|0},0,0.28)`;ctx.beginPath();ctx.ellipse(rx,ry,10+Math.random()*20,5+Math.random()*10,0,0,Math.PI*2);ctx.fill();ctx.fillRect(rx-4,ry+5,7,25+Math.random()*80);}}

function mcStoneBrick() {
    return makeTex((ctx,s)=>{
        // Realistic red brick
        const BW=160,BH=62,M=12;
        ctx.fillStyle='#c4b89a'; ctx.fillRect(0,0,s,s);
        const rows=Math.ceil(s/(BH+M))+1, cols=Math.ceil(s/(BW+M))+2;
        for(let row=0;row<rows;row++){
            const offX=(row%2===0)?0:(BW+M)/2, y=row*(BH+M);
            for(let col=-1;col<cols;col++){
                const x=col*(BW+M)-offX;
                const rv=(Math.random()-.5)*28;
                const r=Math.floor(Math.min(255,Math.max(100,158+rv)));
                const g=Math.floor(Math.min(120,Math.max(30,62+rv*.4)));
                const b=Math.floor(Math.min(80,Math.max(15,38+rv*.2)));
                ctx.fillStyle=`rgb(${r},${g},${b})`;ctx.fillRect(x+M/2,y+M/2,BW,BH);
                ctx.fillStyle='rgba(255,200,160,0.12)';ctx.fillRect(x+M/2,y+M/2,BW,BH*.25);
                ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(x+M/2,y+M/2+BH*.7,BW,BH*.3);
                for(let n=0;n<6;n++){ctx.fillStyle=`rgba(0,0,0,${0.05+Math.random()*.08})`;ctx.fillRect(x+M/2+Math.random()*BW,y+M/2+Math.random()*BH,2+Math.random()*3,1+Math.random()*2);}
            }
        }
        ctx.strokeStyle='rgba(80,65,45,0.25)';ctx.lineWidth=1.5;
        for(let row=0;row<rows;row++){const y=row*(BH+M);ctx.beginPath();ctx.moveTo(0,y+BH+M/2);ctx.lineTo(s,y+BH+M/2);ctx.stroke();}
        addStreaks(ctx,s,6); addCracks(ctx,s,4);
    });
}
function mcNetherBrick() {
    return makeTex((ctx,s)=>{ctx.fillStyle='#1c0c0c';ctx.fillRect(0,0,s,s);addNoise(ctx,s,35,18,0.5);addCracks(ctx,s,14);addStreaks(ctx,s,8);ctx.fillStyle='rgba(60,10,0,0.2)';for(let i=0;i<12;i++){ctx.beginPath();ctx.ellipse(Math.random()*s,Math.random()*s,15+Math.random()*35,10+Math.random()*25,0,0,Math.PI*2);ctx.fill();}});
}
function mcCobble() {
    return makeTex((ctx,s)=>{ctx.fillStyle='#2c2c2c';ctx.fillRect(0,0,s,s);addNoise(ctx,s,50,18,0.6);addCracks(ctx,s,16);addStreaks(ctx,s,6);});
}
function mcDirt() {
    return makeTex((ctx,s)=>{ctx.fillStyle='#14100a';ctx.fillRect(0,0,s,s);addNoise(ctx,s,22,10,0.7);addCracks(ctx,s,20);ctx.fillStyle='rgba(18,14,6,0.5)';for(let i=0;i<20;i++){ctx.beginPath();ctx.ellipse(Math.random()*s,Math.random()*s,5+Math.random()*20,3+Math.random()*12,Math.random()*Math.PI,0,Math.PI*2);ctx.fill();}});
}
function mcGravel() {
    return makeTex((ctx,s)=>{ctx.fillStyle='#1e1e1e';ctx.fillRect(0,0,s,s);addNoise(ctx,s,35,16,0.65);addCracks(ctx,s,22);addStreaks(ctx,s,5);});
}
function mcOakPlank() {
    return makeTex((ctx,s)=>{ctx.fillStyle='#3a2808';ctx.fillRect(0,0,s,s);addNoise(ctx,s,55,20,0.5);ctx.lineWidth=2;ctx.strokeStyle='rgba(20,12,4,0.4)';for(let i=0;i<20;i++){const x=Math.random()*s;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+(Math.random()-.5)*20,s);ctx.stroke();}ctx.lineWidth=3;ctx.strokeStyle='rgba(10,6,2,0.6)';[0,s/3,s*2/3,s].forEach(y=>{ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(s,y);ctx.stroke();});addCracks(ctx,s,6);});
}
function mcMetal() {
    return makeTex((ctx,s)=>{ctx.fillStyle='#252525';ctx.fillRect(0,0,s,s);addNoise(ctx,s,42,16,0.55);addRust(ctx,s,8);addStreaks(ctx,s,8);addCracks(ctx,s,5);ctx.lineWidth=3;ctx.strokeStyle='rgba(8,8,8,0.7)';[0,s/2,s].forEach(v=>{ctx.beginPath();ctx.moveTo(0,v);ctx.lineTo(s,v);ctx.stroke();ctx.beginPath();ctx.moveTo(v,0);ctx.lineTo(v,s);ctx.stroke();});});
}
const _texCache = new Map();
function mcMat(texFn, repX, repY) {
    if (!_texCache.has(texFn)) _texCache.set(texFn, texFn());
    const t = _texCache.get(texFn).clone();
    t.repeat.set(repX, repY);
    t.needsUpdate = true;
    return new THREE.MeshPhongMaterial({ map:t, shininess:8, specular:0x111111 });
}

// ─────────────────────────────────────────────────────────────────────────────
//  BLOOD  (shared)
// ─────────────────────────────────────────────────────────────────────────────
function realisticSplat(ctx, cx, cy, r, seed) {
    let s=seed+1; const rnd=()=>{s=(s*9301+49297)%233280;return s/233280;};
    const R=85+Math.floor(rnd()*20);
    const pts=14+Math.floor(rnd()*8); ctx.beginPath();
    for(let i=0;i<=pts;i++){const ang=(i/pts)*Math.PI*2,rad=r*(0.45+rnd()*0.7);const x=cx+Math.cos(ang)*rad,y=cy+Math.sin(ang)*rad*(0.6+rnd()*0.5);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.closePath();const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,`rgba(${R-25},0,0,0.98)`);g.addColorStop(0.55,`rgba(${R-10},2,0,0.88)`);g.addColorStop(1,`rgba(${R+5},3,0,0.60)`);ctx.fillStyle=g;ctx.fill();
    const nd=3+Math.floor(rnd()*4);for(let d=0;d<nd;d++){const dx=cx+(rnd()-.5)*r*1.8,startY=cy+r*(0.3+rnd()*0.3),len=r*.5+rnd()*r*2.8,w1=1.5+rnd()*3,bulgeR=w1*(0.8+rnd()*0.8),bulgeY=startY+len*.75;ctx.beginPath();ctx.moveTo(dx-w1,startY);ctx.bezierCurveTo(dx-w1*.3,startY+len*.4,dx-bulgeR,bulgeY-bulgeR,dx-bulgeR,bulgeY);ctx.arc(dx,bulgeY,bulgeR,Math.PI,0,false);ctx.bezierCurveTo(dx+bulgeR,bulgeY-bulgeR,dx+w1*.3,startY+len*.4,dx+w1,startY);ctx.closePath();ctx.fillStyle=`rgba(${R-15},1,0,${0.78+rnd()*.18})`;ctx.fill();}
    const ns=18+Math.floor(rnd()*20);for(let i=0;i<ns;i++){const ang=rnd()*Math.PI*2,dist=r*(0.8+rnd()*2.2),sx=cx+Math.cos(ang)*dist,sy=cy+Math.sin(ang)*dist,sr=0.6+rnd()*4;ctx.save();ctx.translate(sx,sy);ctx.rotate(ang);ctx.beginPath();ctx.ellipse(0,0,sr,sr*(1.5+rnd()*2.5),0,0,Math.PI*2);ctx.fillStyle=`rgba(${R-10},1,0,${0.3+rnd()*.55})`;ctx.fill();ctx.restore();}
}

function realisticHandprint(ctx, hx, hy, seed) {
    let s=seed+1; const rnd=()=>{s=(s*9301+49297)%233280;return s/233280;};
    const R=90+Math.floor(rnd()*15);
    ctx.beginPath();
    const palPts=12;
    for(let i=0;i<=palPts;i++){const a=(i/palPts)*Math.PI*2,rx=22+rnd()*6,ry=26+rnd()*8;i===0?ctx.moveTo(hx+Math.cos(a)*rx,hy+Math.sin(a)*ry):ctx.lineTo(hx+Math.cos(a)*rx,hy+Math.sin(a)*ry);}
    ctx.closePath(); ctx.fillStyle=`rgba(${R},2,0,0.9)`; ctx.fill();
    [[-22,-38,6,14],[-8,-44,5.5,16],[7,-43,5.5,16],[21,-38,6,14]].forEach(([fx,fy,fw,fh])=>{
        ctx.beginPath();
        ctx.moveTo(hx+fx-fw*0.5,hy+fy+fh);
        ctx.bezierCurveTo(hx+fx-fw*0.7,hy+fy+fh*0.5,hx+fx-fw*0.3,hy+fy,hx+fx,hy+fy-2);
        ctx.bezierCurveTo(hx+fx+fw*0.3,hy+fy,hx+fx+fw*0.7,hy+fy+fh*0.5,hx+fx+fw*0.5,hy+fy+fh);
        ctx.closePath(); ctx.fillStyle=`rgba(${R-5},1,0,0.85)`; ctx.fill();
    });
    ctx.beginPath();
    ctx.moveTo(hx-18,hy+22); ctx.bezierCurveTo(hx-20,hy+60,hx-8,hy+90,hx-2,hy+110);
    ctx.lineTo(hx+2,hy+110); ctx.bezierCurveTo(hx+8,hy+90,hx+20,hy+60,hx+18,hy+22);
    ctx.closePath();
    const sg=ctx.createLinearGradient(hx,hy+22,hx,hy+110);
    sg.addColorStop(0,`rgba(${R-10},1,0,0.7)`); sg.addColorStop(1,`rgba(${R-20},0,0,0)`);
    ctx.fillStyle=sg; ctx.fill();
}

function addBloodDecal(scene, x, y, z, rotX, rotY, w, h, seed, isPool) {
    const S=512; const c=document.createElement('canvas'); c.width=S; c.height=S;
    const ctx=c.getContext('2d'); ctx.clearRect(0,0,S,S);
    if(isPool){
        let sv=seed+1;const rnd=()=>{sv=(sv*9301+49297)%233280;return sv/233280;};
        const R=90+rnd()*20|0;const g=ctx.createRadialGradient(S/2,S/2,0,S/2,S/2,S*.48);
        g.addColorStop(0,`rgba(${R},3,3,0.95)`);g.addColorStop(0.55,`rgba(${R-15},2,2,0.75)`);g.addColorStop(1,'rgba(0,0,0,0)');
        const pts=20+Math.floor(rnd()*10);ctx.fillStyle=g;ctx.beginPath();
        for(let i=0;i<pts;i++){const a=(i/pts)*Math.PI*2,r=S*0.28+rnd()*S*.18,px=S/2+Math.cos(a)*r*(1+rnd()*.3),py=S/2+Math.sin(a)*r*(0.5+rnd()*.2);i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);}
        ctx.closePath();ctx.fill();
    } else {
        realisticSplat(ctx,S/2,S/2,S*.35,seed);
    }
    const t=new THREE.CanvasTexture(c); t.magFilter=THREE.LinearFilter;
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));
    mesh.position.set(x,y,z); mesh.rotation.x=rotX; mesh.rotation.y=rotY;
    scene.add(mesh);
}

// ─────────────────────────────────────────────────────────────────────────────
//  COLLISION  (shared)
// ─────────────────────────────────────────────────────────────────────────────
// wallSlabs is defined per-level, but the resolver is shared
function pushOutOfSlab(camera, box) {
    const r=0.5, px=camera.position.x, pz=camera.position.z;
    if(px+r<box.minX||px-r>box.maxX)return;
    if(pz+r<box.minZ||pz-r>box.maxZ)return;
    const oX1=(px+r)-box.minX,oX2=box.maxX-(px-r);
    const oZ1=(pz+r)-box.minZ,oZ2=box.maxZ-(pz-r);
    const mn=Math.min(oX1,oX2,oZ1,oZ2);
    if(mn===oX1)camera.position.x=box.minX-r;
    else if(mn===oX2)camera.position.x=box.maxX+r;
    else if(mn===oZ1)camera.position.z=box.minZ-r;
    else camera.position.z=box.maxZ+r;
}

// ─────────────────────────────────────────────────────────────────────────────
//  KITCHEN KNIFE ICON  (shared — used in inventory + chest slots)
// ─────────────────────────────────────────────────────────────────────────────
function drawKitchenKnife(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;

    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.rotate(-Math.PI / 4);

    // Scale so knife fills ~90% of the canvas
    const sc = w / 22;

    // ── Handle ────────────────────────────────────────────────────────────
    ctx.fillStyle = '#2e1506';
    ctx.beginPath(); ctx.roundRect(-3*sc, 3*sc, 6*sc, 12*sc, 1.5*sc); ctx.fill();
    ctx.strokeStyle = 'rgba(10,4,1,0.55)'; ctx.lineWidth = 0.6*sc;
    for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-2.5*sc,(5+i*3)*sc);ctx.lineTo(2.5*sc,(5+i*3)*sc);ctx.stroke();}
    ctx.fillStyle = '#555548';
    [5.5, 9, 12.5].forEach(y=>{ctx.beginPath();ctx.arc(0,y*sc,0.8*sc,0,Math.PI*2);ctx.fill();});

    // ── Bolster ───────────────────────────────────────────────────────────
    ctx.fillStyle = '#888880'; ctx.fillRect(-3.5*sc, 1*sc, 7*sc, 2.5*sc);
    ctx.fillStyle = '#aaaa99'; ctx.fillRect(-3.5*sc, 1*sc, 7*sc, 0.8*sc);

    // ── Blade ─────────────────────────────────────────────────────────────
    const bladeG = ctx.createLinearGradient(-4*sc, 0, 2*sc, 0);
    bladeG.addColorStop(0, '#888888'); bladeG.addColorStop(0.35, '#dddddd');
    bladeG.addColorStop(0.65, '#f0f0f0'); bladeG.addColorStop(1, '#aaaaaa');
    ctx.fillStyle = bladeG;
    ctx.beginPath();
    ctx.moveTo(-3.5*sc, 1*sc); ctx.lineTo(-3.5*sc, -14*sc);
    ctx.lineTo(0.5*sc, -18*sc); ctx.lineTo(1.5*sc, 1*sc);
    ctx.closePath(); ctx.fill();
    // Spine highlight
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.moveTo(-3.5*sc,1*sc); ctx.lineTo(-3.5*sc,-14*sc); ctx.lineTo(-2.5*sc,-14*sc); ctx.lineTo(-2.5*sc,1*sc); ctx.fill();
    // Bevel
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 0.5*sc;
    ctx.beginPath(); ctx.moveTo(1*sc, 1*sc); ctx.lineTo(0.3*sc, -17*sc); ctx.stroke();

    // ── Blood pools ───────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(110,0,0,0.92)';
    ctx.beginPath(); ctx.ellipse(-1.5*sc, -6*sc, 3*sc, 1.8*sc, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-0.5*sc, -2*sc, 2.5*sc, 1.5*sc, -0.1, 0, Math.PI*2); ctx.fill();

    // ── Drips — fixed positions, no random ───────────────────────────────
    [[0.8*sc,-1*sc,4.5*sc],[1*sc,-4*sc,3.8*sc],[0.5*sc,-8*sc,3*sc]].forEach(([bx,by,dl])=>{
        const dw = 0.5*sc;
        ctx.fillStyle = 'rgba(90,0,0,0.9)';
        ctx.beginPath();
        ctx.moveTo(bx-dw, by);
        ctx.bezierCurveTo(bx-dw*0.5, by+dl*0.4, bx+dw*0.5, by+dl*0.7, bx, by+dl);
        ctx.bezierCurveTo(bx+dw*0.5, by+dl*0.7, bx+dw, by+dl*0.4, bx+dw, by);
        ctx.fill();
        ctx.beginPath(); ctx.arc(bx, by+dl+dw, dw*0.9, 0, Math.PI*2); ctx.fill();
    });

    // ── Spray dots ────────────────────────────────────────────────────────
    [[-4,-4],[2,-7],[-3,-9],[1,-3],[-5,-7],[-2,-10]].forEach(([dx,dy])=>{
        ctx.fillStyle = 'rgba(100,0,0,0.7)';
        ctx.beginPath(); ctx.arc(dx*sc*0.5, dy*sc*0.5, 0.5*sc, 0, Math.PI*2); ctx.fill();
    });

    ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
//  CHARACTER PORTRAIT — red hazmat suit  (shared)
// ─────────────────────────────────────────────────────────────────────────────
function drawCharPortrait() {
    const canvas=document.getElementById('char-portrait'); if(!canvas)return;
    const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,cx=w/2;
    ctx.fillStyle='#0a0806'; ctx.fillRect(0,0,w,h);
    const vig=ctx.createRadialGradient(cx,h*0.5,10,cx,h*0.5,95);
    vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(0,0,0,0.55)');
    ctx.fillStyle=vig; ctx.fillRect(0,0,w,h);
    const S='#bb1100',SD='#881000',SL='#dd2211',BLK='#111111',BGRY='#333333',GRY='#666666',VIS='#090912';
    function rg(x1,y1,x2,y2,c1,c2){const g=ctx.createLinearGradient(x1,y1,x2,y2);g.addColorStop(0,c1);g.addColorStop(1,c2);return g;}
    // Boots
    [cx-22,cx+4].forEach(bx=>{ctx.fillStyle=BLK;ctx.beginPath();ctx.roundRect(bx,166,18,24,[0,0,4,4]);ctx.fill();ctx.fillStyle='rgba(60,60,60,0.4)';ctx.fillRect(bx+3,168,6,10);});
    // Legs
    [cx-20,cx+4].forEach((lx,i)=>{ctx.fillStyle=rg(lx,0,lx+16,0,i===0?SD:S,i===0?S:SD);ctx.fillRect(lx,130,16,40);ctx.strokeStyle='rgba(60,5,0,0.4)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(lx+8,135);ctx.quadraticCurveTo(lx+4,152,lx+9,165);ctx.stroke();});
    // Torso
    ctx.fillStyle=rg(cx-28,0,cx+28,0,SD,SL);ctx.beginPath();ctx.roundRect(cx-26,72,52,62,[4,4,0,0]);ctx.fill();
    ctx.strokeStyle='rgba(60,5,0,0.3)';ctx.lineWidth=1.2;
    [[cx-10,78,cx-14,105],[cx+5,80,cx+9,108],[cx-3,112,cx-6,126]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.quadraticCurveTo(x1+4,y1+(y2-y1)/2,x2,y2);ctx.stroke();});
    // Belt
    ctx.fillStyle=BLK;ctx.fillRect(cx-26,126,52,9);ctx.fillStyle=BGRY;ctx.beginPath();ctx.roundRect(cx-9,127,18,7,1);ctx.fill();ctx.fillStyle=BLK;ctx.beginPath();ctx.roundRect(cx-6,128,12,5,1);ctx.fill();
    // Harness straps
    ctx.strokeStyle=BLK;ctx.lineWidth=5;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(cx-16,74);ctx.lineTo(cx-2,126);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx+16,74);ctx.lineTo(cx+2,126);ctx.stroke();
    ctx.fillStyle=BGRY;ctx.fillRect(cx-22,72,12,6);ctx.fillRect(cx+10,72,12,6);
    // Zipper
    ctx.strokeStyle=GRY;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cx,72);ctx.lineTo(cx,127);ctx.stroke();
    for(let zy=76;zy<127;zy+=5){ctx.strokeStyle='rgba(90,90,90,0.5)';ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(cx-2,zy);ctx.lineTo(cx+2,zy);ctx.stroke();}
    // Chest patch
    const px=cx-12,py=97;ctx.fillStyle='#cc2222';ctx.beginPath();ctx.arc(px,py,10,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#881111';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(px,py,10,0,Math.PI*2);ctx.stroke();
    for(let p=0;p<6;p++){const a=p/6*Math.PI*2;ctx.fillStyle='#ff4444';ctx.beginPath();ctx.ellipse(px+Math.cos(a)*5,py+Math.sin(a)*5,3,4,a,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#222';ctx.beginPath();ctx.arc(px,py,1.5,0,Math.PI*2);ctx.fill();
    // Arms
    ctx.fillStyle=rg(cx-42,0,cx-22,0,SD,S);ctx.beginPath();ctx.roundRect(cx-42,76,16,56,4);ctx.fill();
    ctx.fillStyle=rg(cx+26,0,cx+42,0,S,SD);ctx.beginPath();ctx.roundRect(cx+26,76,16,56,4);ctx.fill();
    ctx.strokeStyle='rgba(60,5,0,0.35)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(cx-36,90);ctx.quadraticCurveTo(cx-38,110,cx-34,125);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx+36,90);ctx.quadraticCurveTo(cx+38,110,cx+34,125);ctx.stroke();
    ctx.fillStyle=BLK;ctx.fillRect(cx-43,126,18,5);ctx.fillRect(cx+25,126,18,5);
    // Gloves
    [cx-43,cx+25].forEach(gx=>{ctx.fillStyle=BLK;ctx.beginPath();ctx.roundRect(gx,130,18,16,3);ctx.fill();ctx.strokeStyle='rgba(50,50,50,0.7)';ctx.lineWidth=0.8;[2,6,10].forEach(fi=>{ctx.beginPath();ctx.moveTo(gx+fi,140);ctx.lineTo(gx+fi+3,140);ctx.stroke();});});
    // Hood
    const hoodG=ctx.createRadialGradient(cx-6,38,4,cx,42,32);hoodG.addColorStop(0,SL);hoodG.addColorStop(1,SD);
    ctx.fillStyle=hoodG;ctx.beginPath();ctx.ellipse(cx,42,28,32,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=S;ctx.beginPath();ctx.ellipse(cx,68,26,10,0,0,Math.PI);ctx.fill();
    // Visor
    ctx.fillStyle=VIS;ctx.beginPath();ctx.roundRect(cx-18,26,36,22,4);ctx.fill();
    ctx.strokeStyle=GRY;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(cx-18,26,36,22,4);ctx.stroke();
    ctx.fillStyle='rgba(120,140,180,0.12)';ctx.beginPath();ctx.roundRect(cx-14,28,15,9,2);ctx.fill();
    // Breathing filter
    ctx.fillStyle=BGRY;ctx.beginPath();ctx.arc(cx+21,53,8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#222';ctx.beginPath();ctx.arc(cx+21,53,6,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=GRY;ctx.lineWidth=0.8;
    [-3,-1,1,3].forEach(dv=>{ctx.beginPath();ctx.moveTo(cx+16,53+dv);ctx.lineTo(cx+26,53+dv);ctx.stroke();});
    ctx.strokeStyle=BGRY;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx+21,53,8,0,Math.PI*2);ctx.stroke();
    // Collar
    ctx.fillStyle=SD;ctx.beginPath();ctx.roundRect(cx-14,66,28,10,2);ctx.fill();
}

// ─────────────────────────────────────────────────────────────────────────────
//  BLUE HAND VIEW MODEL  (shared)
// ─────────────────────────────────────────────────────────────────────────────
function buildBlueHandViewModel() {
    const g = new THREE.Group();
    const c = document.createElement('canvas'); c.width=512; c.height=768;
    const ctx = c.getContext('2d');

    function drawHandPose(closeT) {
        ctx.clearRect(0,0,512,768);
        function blueGrad(x1,x2){const gr=ctx.createLinearGradient(x1,0,x2,0);gr.addColorStop(0,'#0a44aa');gr.addColorStop(0.25,'#3a90ff');gr.addColorStop(0.5,'#5aaeff');gr.addColorStop(0.75,'#3a90ff');gr.addColorStop(1,'#0a44aa');return gr;}
        const cG=ctx.createLinearGradient(70,560,440,560);cG.addColorStop(0,'#aa8800');cG.addColorStop(0.15,'#ffdd00');cG.addColorStop(0.5,'#ffe83a');cG.addColorStop(0.85,'#ffdd00');cG.addColorStop(1,'#aa8800');
        ctx.shadowBlur=18;ctx.shadowColor='rgba(0,0,80,0.5)';ctx.fillStyle=cG;ctx.beginPath();ctx.roundRect(72,560,360,180,[18,18,40,40]);ctx.fill();ctx.shadowBlur=0;
        ctx.fillStyle='rgba(255,255,150,0.3)';ctx.beginPath();ctx.roundRect(80,562,352,30,12);ctx.fill();
        const pG=ctx.createRadialGradient(240,450,20,230,440,180);pG.addColorStop(0,'#5aaeff');pG.addColorStop(0.5,'#1a7dff');pG.addColorStop(1,'#0a44aa');
        ctx.fillStyle=pG;ctx.shadowBlur=22;ctx.shadowColor='rgba(0,0,80,0.45)';ctx.beginPath();ctx.roundRect(72,355,368,220,[8,8,28,28]);ctx.fill();ctx.shadowBlur=0;
        ctx.fillStyle='rgba(200,230,255,0.14)';ctx.beginPath();ctx.ellipse(220,420,120,80,0,0,Math.PI*2);ctx.fill();
        [[86,358,72,248],[168,358,76,300],[252,358,78,325],[338,358,72,275]].forEach(([fx,fy,fw,fh])=>{
            const h=fh*(1-closeT*.62),kY=fy-h*.52;
            ctx.shadowBlur=14;ctx.shadowColor='rgba(0,0,80,0.4)';ctx.fillStyle=blueGrad(fx,fx+fw);
            ctx.beginPath();ctx.roundRect(fx,fy-h,fw,h+12,[fw/2,fw/2,4,4]);ctx.fill();ctx.shadowBlur=0;
            if(closeT<0.5){ctx.fillStyle='rgba(200,230,255,0.40)';ctx.beginPath();ctx.ellipse(fx+fw*.38,fy-h+fw*.28,fw*.22,fw*.18,-0.3,0,Math.PI*2);ctx.fill();}
            ctx.strokeStyle='rgba(5,40,110,0.55)';ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(fx+8,kY);ctx.lineTo(fx+fw-8,kY);ctx.stroke();
        });
        ctx.save();ctx.translate(416,470);ctx.rotate(0.52+closeT*.22);ctx.fillStyle=blueGrad(-34,34);ctx.shadowBlur=14;ctx.shadowColor='rgba(0,0,80,0.4)';ctx.beginPath();ctx.roundRect(-33,-148,66,162,[33,33,10,10]);ctx.fill();ctx.shadowBlur=0;if(closeT<0.5){ctx.fillStyle='rgba(200,230,255,0.38)';ctx.beginPath();ctx.ellipse(-8,-120,14,22,-0.2,0,Math.PI*2);ctx.fill();}ctx.restore();
    }

    drawHandPose(0);
    const tex = new THREE.CanvasTexture(c);
    tex.magFilter = THREE.LinearFilter;
    tex._drawFn = drawHandPose;

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.52, 0.78),
        new THREE.MeshBasicMaterial({map:tex, transparent:true, depthTest:false, depthWrite:false, alphaTest:0.05})
    );
    plane.renderOrder = 999;
    g.add(plane);
    return { group: g, tex };
}

// ─────────────────────────────────────────────────────────────────────────────
//  UI HELPERS  (shared)
// ─────────────────────────────────────────────────────────────────────────────
function showMessage(text, duration) {
    const box = document.getElementById('message-box') || document.getElementById('msg');
    if(!box) return;
    box.textContent = text; box.style.display = 'block';
    clearTimeout(box._t);
    box._t = setTimeout(() => box.style.display = 'none', duration || 2500);
}

// ─────────────────────────────────────────────────────────────────────────────
//  GAME STATE PERSISTENCE
// ─────────────────────────────────────────────────────────────────────────────
const GameState = {
    save(data) {
        sessionStorage.setItem('knifeHead_state', JSON.stringify(data));
    },
    load() {
        return JSON.parse(sessionStorage.getItem('knifeHead_state') || '{}');
    },
    clear() {
        sessionStorage.removeItem('knifeHead_state');
    }
};
