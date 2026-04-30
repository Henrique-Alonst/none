// assets/js/utils.js

function initImageUpload(inputId, previewId) {
  const input   = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) { preview.style.display = 'none'; return; }
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  return () => preview.style.display !== 'none' ? preview.src : null;
}

function initAccordion(toggleId, formId) {
  const toggle = document.getElementById(toggleId);
  const form   = document.getElementById(formId);
  toggle.addEventListener('click', () => form.classList.toggle('aberto'));
}

function criarAcoes(onApagar) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex; gap:6px; margin-top:8px;';

  const btnDel = document.createElement('button');
  btnDel.textContent = '✕ Apagar';
  btnDel.style.cssText = `
    font-family:'Special Elite',monospace;
    font-size:10px; letter-spacing:1px;
    background:none; border:1px solid var(--red-margin);
    border-radius:2px; padding:3px 8px;
    cursor:pointer; color:var(--red-margin);
    transition: all 0.15s;
  `;
  btnDel.addEventListener('click', onApagar);

  wrap.appendChild(btnDel);
  return wrap;
}

function adicionarCard(gridId, nome, desc, status, tags, link, imgSrc, placeholder, id = null, endpoint = null) {
  const statusLabel = { ativo: 'Ativo', pausado: 'Pausado', concluido: 'Concluído' }[status];

  const tagHTML = tags
    ? tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('')
    : '';

  const linkHTML = link
    ? `<a class="card-link" href="${link}" target="_blank">↗ VER PROJETO</a>`
    : '';

  const card = document.createElement('div');
  card.classList.add('project-card');

  // Imagem ou placeholder com hover de câmera
  const imgWrap = document.createElement('div');
  imgWrap.style.cssText = 'position:relative; cursor:pointer;';

  if (imgSrc) {
    imgWrap.innerHTML = `
      <img class="card-img" src="${imgSrc}" alt="${nome}" style="display:block;">
      <div class="img-hover-cam" style="
        position:absolute; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.35); display:flex; align-items:center;
        justify-content:center; opacity:0; transition:opacity 0.2s;
        border-radius:0;
      ">📷</div>
    `;
  } else {
    imgWrap.innerHTML = `
      <div class="card-img-placeholder" style="position:relative;">${placeholder}
        <div class="img-hover-cam" style="
          position:absolute; top:0; left:0; width:100%; height:100%;
          background:rgba(0,0,0,0.15); display:flex; align-items:center;
          justify-content:center; opacity:0; transition:opacity 0.2s;
          font-size:1.2rem;
        ">📷</div>
      </div>
    `;
  }

  imgWrap.addEventListener('mouseenter', () => {
    imgWrap.querySelector('.img-hover-cam').style.opacity = '1';
  });
  imgWrap.addEventListener('mouseleave', () => {
    imgWrap.querySelector('.img-hover-cam').style.opacity = '0';
  });

  // Clique na imagem abre seletor de arquivo
  const inputImg = document.createElement('input');
  inputImg.type   = 'file';
  inputImg.accept = 'image/*';
  inputImg.style.display = 'none';

  inputImg.addEventListener('change', () => {
    const arquivo = inputImg.files[0];
    if (!arquivo || !id || !endpoint) return;

    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('nome', card.querySelector('.card-name').textContent.trim());
    formData.append('desc', card.querySelector('.card-desc').textContent.trim());
    formData.append('imagem_arquivo', arquivo);

    fetch(`${endpoint}?id=${id}`, { method: 'POST', body: formData })
      .then(r => r.json())
      .then(() => {
        const reader = new FileReader();
        reader.onload = e => {
          const imgExistente = imgWrap.querySelector('.card-img');
          if (imgExistente) {
            imgExistente.src = e.target.result;
          } else {
            imgWrap.querySelector('.card-img-placeholder').style.backgroundImage = `url(${e.target.result})`;
            imgWrap.innerHTML = `
              <img class="card-img" src="${e.target.result}" alt="${nome}" style="display:block;">
              <div class="img-hover-cam" style="
                position:absolute; top:0; left:0; width:100%; height:100%;
                background:rgba(0,0,0,0.35); display:flex; align-items:center;
                justify-content:center; opacity:0; transition:opacity 0.2s;
              ">📷</div>
            `;
            imgWrap.addEventListener('mouseenter', () => imgWrap.querySelector('.img-hover-cam').style.opacity = '1');
            imgWrap.addEventListener('mouseleave', () => imgWrap.querySelector('.img-hover-cam').style.opacity = '0');
          }
        };
        reader.readAsDataURL(arquivo);
      });
  });

  imgWrap.addEventListener('click', () => inputImg.click());
  imgWrap.appendChild(inputImg);

  card.appendChild(imgWrap);

  // Body do card
  const body = document.createElement('div');
  body.classList.add('card-body');
  body.innerHTML = `
    <div class="card-name" contenteditable="true" style="outline:none; cursor:text;">${nome}</div>
    <div class="card-desc" contenteditable="true" style="outline:none; cursor:text; font-size:12px; color:var(--ink-faded); line-height:1.6;">${desc || 'Sem descrição.'}</div>
    <div class="card-tags">
      <span class="tag status-${status} tag-status-editavel" style="cursor:pointer;" title="Clique para mudar status">${statusLabel}</span>
      ${tagHTML}
    </div>
    ${linkHTML}
  `;

  // Salvar nome ao sair
  body.querySelector('.card-name').addEventListener('blur', () => {
    const novoNome = body.querySelector('.card-name').textContent.trim();
    if (id && endpoint && novoNome) {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      formData.append('nome', novoNome);
      formData.append('desc', body.querySelector('.card-desc').textContent.trim());
      fetch(`${endpoint}?id=${id}`, { method: 'POST', body: formData });
    }
  });

  // Salvar desc ao sair
  body.querySelector('.card-desc').addEventListener('blur', () => {
    const novaDesc = body.querySelector('.card-desc').textContent.trim();
    if (id && endpoint) {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      formData.append('nome', body.querySelector('.card-name').textContent.trim());
      formData.append('desc', novaDesc);
      fetch(`${endpoint}?id=${id}`, { method: 'POST', body: formData });
    }
  });

  // Ciclo de status
  const tagStatus = body.querySelector('.tag-status-editavel');
  const statusCiclo = ['ativo', 'pausado', 'concluido'];
  const labelCiclo  = ['Ativo', 'Pausado', 'Concluído'];
  let statusAtual = statusCiclo.indexOf(status);

  tagStatus.addEventListener('click', () => {
    statusAtual = (statusAtual + 1) % 3;
    tagStatus.className = `tag status-${statusCiclo[statusAtual]} tag-status-editavel`;
    tagStatus.style.cursor = 'pointer';
    tagStatus.textContent = labelCiclo[statusAtual];
  });

  // Só botão apagar agora
  const acoes = criarAcoes(
    () => {
      if (confirm('Apagar este item?')) {
        if (id && endpoint) {
          fetch(`${endpoint}?id=${id}`, { method: 'DELETE' })
            .then(() => card.remove());
        } else {
          card.remove();
        }
      }
    }
  );

  body.appendChild(acoes);
  card.appendChild(body);
  document.getElementById(gridId).prepend(card);
}