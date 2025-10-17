/* ejercicios.js - lógica para paleta, to-do y Simpsons API */
document.addEventListener('DOMContentLoaded', ()=>{

  // Loading overlay helpers
  const loading = document.getElementById('loading-overlay');
  function showLoading(){ if(loading) loading.classList.add('show'); }
  function hideLoading(){ if(loading) loading.classList.remove('show'); }

  // PALETTE
  const paletteBtn = document.getElementById('generate-palette');
  const paletteContainer = document.getElementById('palette-container');
  function randomHex(){ return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0').toUpperCase(); }
  function generatePalette(){
    paletteContainer.innerHTML = '';
    for(let i=0;i<5;i++){
      const color = randomHex();
      const d = document.createElement('div');
      d.className = 'color-swatch';
      d.style.backgroundColor = color;
      d.title = color;
      d.dataset.hex = color;
      d.addEventListener('click', async ()=> {
        try{
          await navigator.clipboard.writeText(color);
          const old = d.innerText;
          d.innerText = 'Copiado';
          setTimeout(()=> d.innerText = '',800);
        }catch(e){
          alert('No se pudo copiar. Usa Ctrl+C: '+color);
        }
      });
      paletteContainer.appendChild(d);
    }
  }
  if(paletteBtn) paletteBtn.addEventListener('click', generatePalette);

  // TODO LIST
  let tareas = [];
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task');
  const tasksUl = document.getElementById('tasks-ul');

  function renderizarTareas(){
    tasksUl.innerHTML = '';
    tareas.forEach((t, idx)=>{
      const li = document.createElement('li');
      li.className = 'todo-item card';
      li.innerHTML = `<span>${t}</span>`;
      const btn = document.createElement('button');
      btn.textContent = 'Eliminar';
      btn.addEventListener('click', ()=> {
        tareas.splice(idx,1);
        renderizarTareas();
      });
      li.appendChild(btn);
      tasksUl.appendChild(li);
    });
  }

  function agregarTarea(){
    const v = taskInput.value && taskInput.value.trim();
    if(!v) return;
    tareas.push(v);
    taskInput.value = '';
    renderizarTareas();
  }
  if(addTaskBtn) addTaskBtn.addEventListener('click', agregarTarea);
  if(taskInput) taskInput.addEventListener('keyup', (e)=> { if(e.key==='Enter') agregarTarea(); });

  // SIMPSONS API - fetch a specific episode by id input
  const simpsonBtn = document.getElementById('fetch-episode');
  const episodeIdInput = document.getElementById('episode-id');
  const simpsonContainer = document.getElementById('simpson-result');

  async function fetchEpisode(id){
    showLoading();
    try{
      const res = await fetch('https://thesimpsonsapi.com/api/episodes/' + encodeURIComponent(id));
      if(!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      console.log(data);
      simpsonContainer.innerHTML = '';
      const card = document.createElement('div');
      card.className = 'simpson-card card';
      const img = document.createElement('img');
      //no da la imagen correcta
      img.src = data.image || data.image_path || ('https://thesimpsonsapi.com' + (data.portrait_path||''));
      img.src = img.src.replace('file:///D:','https://thesimpsonsapi.com');
      console.log('Imagen URL:', img.src);
      img.alt = data.title || data.name || 'Imagen episodio';
      const info = document.createElement('div');
      info.innerHTML = `<h3>${data.title || data.name || 'Episodio '+id}</h3>
                        <p class="small">Temporada: ${data.season || data.series || '-' }  |  Episodio: ${data.episode || data.episode_number || '-'}</p>
                        <p>${data.synopsis || data.desc || data.summary || 'Sin sinopsis disponible.'}</p>`;
      card.appendChild(img);
      card.appendChild(info);
      simpsonContainer.appendChild(card);
    }catch(err){
      simpsonContainer.innerHTML = '<p class="small">Error al obtener episodio: '+err.message+'</p>';
    }finally{
      hideLoading();
    }
  }

  if(simpsonBtn){
    simpsonBtn.addEventListener('click', ()=>{
      const id = episodeIdInput.value.trim() || '1';
      fetchEpisode(id);
    });
  }

});