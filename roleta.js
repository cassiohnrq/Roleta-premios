// roleta.js
let prizes=[
  {text:'10% OFF',color:'#fff',textColor:'#000'},
  {text:'Brinde',color:'#ff8300',textColor:'#fff'},
  {text:'Frete Grátis',color:'#0077bd',textColor:'#fff'},
  {text:'Nada',color:'#ffe433',textColor:'#000'}
];
const wheel=document.getElementById('wheel'),ctx=wheel.getContext('2d');
const pointer=document.getElementById('pointer');
const resultModal=document.getElementById('resultModal'),resultText=document.getElementById('resultText'),closeResult=document.getElementById('closeResult');
const formModal=document.getElementById('formModal'),saveForm=document.getElementById('saveForm');
const nome=document.getElementById('nome'),telefone=document.getElementById('telefone');
const downloadData=document.getElementById('downloadData');
const centerImageInput=document.getElementById('centerImage');
let isSpinning=false;
let centerImg=null;
let bgColor='#0f172a';
let bgImage=null;


centerImageInput.addEventListener('change',e=>{
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{centerImg=new Image();centerImg.src=ev.target.result;centerImg.onload=drawWheel;};
  reader.readAsDataURL(file);
});

// Fundo da roleta: cor
const bgColorPicker = document.getElementById('bgColorPicker');
if(bgColorPicker) {
  bgColorPicker.addEventListener('input',e=>{
    bgColor = e.target.value;
    drawWheel();
  });
}

// Fundo da roleta: imagem
const bgImagePicker = document.getElementById('bgImagePicker');
let bgImageObj = null;
if(bgImagePicker) {
  bgImagePicker.addEventListener('change',e=>{
    const file = e.target.files[0];
    if(!file) { bgImageObj = null; drawWheel(); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      bgImageObj = new Image();
      bgImageObj.src = ev.target.result;
      bgImageObj.onload = drawWheel;
      // Preview
      let preview = document.getElementById('bgImagePreview');
      if(!preview) {
        preview = document.createElement('img');
        preview.id = 'bgImagePreview';
        bgImagePicker.parentNode.appendChild(preview);
      }
      preview.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function drawWheel(){
  const size=wheel.width;
  // Fundo: cor
  ctx.clearRect(0,0,size,size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(size/2,size/2,size/2,0,2*Math.PI);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = bgColor;
  ctx.fillRect(0,0,size,size);
  ctx.restore();
  // Fundo: imagem
  if(bgImageObj) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(size/2,size/2,size/2,0,2*Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(bgImageObj,0,0,size,size);
    ctx.restore();
  }
  const cx=size/2,cy=size/2,r=size/2-10;const n=prizes.length,arc=2*Math.PI/n;
  for(let i=0;i<n;i++){
    const start=i*arc;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,start+arc);ctx.closePath();ctx.fillStyle=prizes[i].color;ctx.fill();ctx.save();ctx.translate(cx,cy);ctx.rotate(start+arc/2);ctx.textAlign='right';ctx.fillStyle=prizes[i].textColor||'#000';ctx.font='bold '+(r*0.08)+'px sans-serif';ctx.fillText(prizes[i].text,r-20,10);ctx.restore();
  }
  if(centerImg){ctx.save();const imgSize=r*0.4;ctx.beginPath();ctx.arc(cx,cy,imgSize/2,0,2*Math.PI);ctx.closePath();ctx.clip();ctx.drawImage(centerImg,cx-imgSize/2,cy-imgSize/2,imgSize,imgSize);ctx.restore();}
}

drawWheel();

function renderEditablePrizeList() {
  const container = document.getElementById('editablePrizeList');
  container.innerHTML = '';
  prizes.forEach((prize, idx) => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '6px';
    row.style.marginBottom = '8px';
    row.style.flexWrap = 'wrap';
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = prize.text;
    textInput.style.width = '90px';
    textInput.style.fontSize = '13px';
    textInput.style.borderRadius = '4px';
    textInput.style.border = '1px solid #ccc';
    textInput.style.padding = '2px 4px';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = prize.color;
    colorInput.title = 'Cor do Fundo';
    const textColorInput = document.createElement('input');
    textColorInput.type = 'color';
    textColorInput.value = prize.textColor||'#000';
    textColorInput.title = 'Cor do Texto';
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Salvar';
    saveBtn.style.fontSize = '12px';
    saveBtn.style.padding = '2px 8px';
    saveBtn.style.borderRadius = '4px';
    saveBtn.style.border = 'none';
    saveBtn.style.background = 'var(--accent)';
    saveBtn.style.color = '#fff';
    saveBtn.onclick = () => {
      prizes[idx].text = textInput.value;
      prizes[idx].color = colorInput.value;
      prizes[idx].textColor = textColorInput.value;
      drawWheel();
      renderEditablePrizeList();
    };
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✕';
    removeBtn.title = 'Remover';
    removeBtn.style.fontSize = '14px';
    removeBtn.style.padding = '2px 6px';
    removeBtn.style.borderRadius = '4px';
    removeBtn.style.border = 'none';
    removeBtn.style.background = '#dc2626';
    removeBtn.style.color = '#fff';
    removeBtn.onclick = () => {
      prizes.splice(idx, 1);
      drawWheel();
      renderEditablePrizeList();
    };
    row.appendChild(textInput);
    row.appendChild(colorInput);
    row.appendChild(textColorInput);
    row.appendChild(saveBtn);
    row.appendChild(removeBtn);
    container.appendChild(row);
  });
}
renderEditablePrizeList();

function spin(){if(isSpinning)return;nome.value='';telefone.value='';formModal.classList.add('show');}

saveForm.onclick=()=>{
  if(!nome.value||!telefone.value)return alert('Preencha todos os campos!');
  const userData = {
    nome: nome.value,
    telefone: telefone.value,
    date: new Date().toLocaleString()
  };
  window.currentUser = userData;
  formModal.classList.remove('show');
  startSpin();
}

function startSpin(){
  if(isSpinning) return;
  isSpinning = true;
  pointer.classList.remove('glow');
  const n = prizes.length;
  const slice = 360 / n;
  const target = Math.floor(Math.random() * n);
  const rounds = 5;
  const finalDeg = 360 * rounds + (360 - (target * slice + slice / 2));
  wheel.style.transition = 'none';
  wheel.style.transform = 'rotate(0deg)';
  void wheel.offsetWidth;
  wheel.style.transition = 'transform 5s cubic-bezier(.12,.8,.17,1)';
  wheel.style.transform = `rotate(${finalDeg}deg)`;
  wheel.addEventListener('transitionend', () => {
    const finalAngle = finalDeg % 360;
    wheel.style.transition = 'none';
    wheel.style.transform = `rotate(${finalAngle}deg)`;
    void wheel.offsetWidth;
    isSpinning = false;
    pointer.classList.add('glow');
    const prize = prizes[target];
    showResult(prize);
  }, { once: true });
}

function showResult(prize){
  resultText.textContent='Você ganhou: '+prize.text;
  if(window.currentUser) {
    const data = JSON.parse(localStorage.getItem('users')||'[]');
    data.push({
      ...window.currentUser,
      premio: prize.text
    });
    localStorage.setItem('users', JSON.stringify(data));
    window.currentUser = null;
  }
  resultModal.classList.add('show');
}
closeResult.onclick=()=>{resultModal.classList.remove('show');pointer.classList.remove('glow');};

const togglePanel=document.getElementById('togglePanel');const editor=document.getElementById('editor');
togglePanel.onclick=()=>{editor.classList.toggle('hidden');togglePanel.textContent=editor.classList.contains('hidden')?'Mostrar painel':'Ocultar painel';};

document.getElementById('addPrize').onclick=()=>{
  const t=document.getElementById('newPrizeText'),
        c=document.getElementById('newPrizeColor'),
        tc=document.getElementById('newPrizeTextColor');
  if(!t.value)return;
  prizes.push({
    text:t.value,
    color:c.value,
    textColor:tc.value
  });
  t.value='';
  drawWheel();
  renderEditablePrizeList();
};

downloadData.onclick=()=>{
  const data=JSON.parse(localStorage.getItem('users')||'[]');if(!data.length)return alert('Sem dados!');
  const header=['Nome','Telefone','Data','Prêmio'];
  const rows=data.map(d=>[d.nome,d.telefone,d.date,d.premio]);
  const csv=[header.join(','),...rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const link=document.createElement('a');
  link.href=URL.createObjectURL(blob);
  link.download='dados.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

pointer.onclick=spin;wheel.onclick=spin;
