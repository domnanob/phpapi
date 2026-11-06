// ---------- Beállítások ----------
const API = {
  base: '../../phpapi/server',             // az api gyökere a client mappához képest: ../server ha kell
  imgDir: 'src/img/',         // helyi képek mappája
  methods: { create: 'POST', update: 'PUT', delete: 'DELETE' } // szükség esetén módosítható
};

// ---------- Segédfüggvények ----------
const $ = (s, r = document) => r.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state = { pets: [], types: [] };

function toast(text, error = false) {
  const m = $('#msg');
  m.textContent = text;
  m.className = error ? 'error' : '';
  m.style.display = 'block';
  clearTimeout(toast.t);
  toast.t = setTimeout(() => m.style.display = 'none', 3000);
}

async function request(path, method = 'GET', body = null) {
  const opt = { method, headers: { 'Accept': 'application/json' } };
  if (body !== null) {
    opt.headers['Content-Type'] = 'application/json';
    opt.body = JSON.stringify(body);
  }
  const res = await fetch(`${API.base}/${path}`, opt);
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error((data && data.message) || (typeof data === 'string' && data) || `Hiba (${res.status})`);
  return data;
}

function imgSrc(p) {
  if (!p) return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="210" height="160"><rect width="100%" height="100%" fill="#ccc"/><text x="50%" y="50%" text-anchor="middle" fill="#888" font-size="16">nincs kép</text></svg>');
  return /^(https?:)?\/\//i.test(p) || p.startsWith('data:') ? p : API.imgDir + p;
}

const typeName = id => (state.types.find(t => String(t.id) === String(id)) || {}).name || '—';

// ---------- Fülek ----------
document.querySelectorAll('nav button').forEach(b => b.onclick = () => {
  document.querySelectorAll('nav button').forEach(x => x.classList.toggle('active', x === b));
  document.querySelectorAll('section').forEach(s => s.classList.toggle('active', s.id === b.dataset.tab));
});

// ---------- Betöltés ----------
async function loadTypes() {
  state.types = (await request('types')) || [];
  renderTypes();
  const sel = $('#petForm [name=typeid]');
  const cur = sel.value;
  sel.innerHTML = state.types.map(t => `<option value="${esc(t.id)}">${esc(t.name)}</option>`).join('');
  sel.value = cur;
}

async function loadPets() {
  state.pets = (await request('pets')) || [];
  renderPets();
}

async function loadAll() {
  try { await loadTypes(); await loadPets(); }
  catch (e) { toast(e.message, true); }
}

// ---------- Típusok ----------
function renderTypes() {
  $('#typeList').innerHTML = state.types.map(t => `
    <tr>
      <td>${esc(t.id)}</td><td>${esc(t.name)}</td>
      <td class="actions-cell">
        <button data-edit="${esc(t.id)}">Szerkesztés</button>
        <button class="danger" data-del="${esc(t.id)}">Törlés</button>
      </td>
    </tr>`).join('') || '<tr><td colspan="3">Nincs típus.</td></tr>';
}

const typeForm = $('#typeForm');
function resetTypeForm() { typeForm.reset(); typeForm.id.value = ''; $('#typeFormTitle').textContent = 'Új típus'; }
$('#typeCancel').onclick = resetTypeForm;

typeForm.onsubmit = async e => {
  e.preventDefault();
  const data = { name: typeForm.name.value.trim() };
  const id = typeForm.id.value;
  try {
    if (id) { data.id = Number(id); await request('types/update', API.methods.update, data); }
    else await request('types/create', API.methods.create, data);
    toast('Típus mentve');
    resetTypeForm();
    await loadAll();
  } catch (err) { toast(err.message, true); }
};

$('#typeList').onclick = async e => {
  const edit = e.target.dataset.edit, del = e.target.dataset.del;
  if (edit) {
    const t = state.types.find(x => String(x.id) === edit);
    typeForm.id.value = t.id; typeForm.name.value = t.name;
    $('#typeFormTitle').textContent = 'Típus szerkesztése';
    typeForm.name.focus();
  }
  if (del && confirm('Biztosan törlöd a típust?')) {
    try { await request('types/delete', API.methods.delete, { id: Number(del) }); toast('Típus törölve'); await loadAll(); }
    catch (err) { toast(err.message, true); }
  }
};

// ---------- Kisállatok ----------
function renderPets() {
  $('#petList').innerHTML = state.pets.map(p => `
    <div class="pet">
      <img src="${esc(imgSrc(p.picture))}" alt="${esc(p.name)}" onerror="this.src='${imgSrc('')}'">
      <div class="body">
        <h3>${esc(p.name)}</h3>
        <p>Típus: ${esc(typeName(p.typeid))}</p>
        <p>Kor: ${esc(p.age)}</p>
        <p>Cukiság: ${esc(p.cuteness)}</p>
      </div>
      <div class="actions">
        <button data-edit="${esc(p.id)}">Szerkesztés</button>
        <button class="danger" data-del="${esc(p.id)}">Törlés</button>
      </div>
    </div>`).join('') || '<p>Nincs kisállat.</p>';
}

const petForm = $('#petForm');
function resetPetForm() { petForm.reset(); petForm.id.value = ''; $('#petFormTitle').textContent = 'Új kisállat'; }
$('#petCancel').onclick = resetPetForm;

$('#petFile').onchange = e => {
  const f = e.target.files[0];
  if (f) petForm.picture.value = f.name;
};

petForm.onsubmit = async e => {
  e.preventDefault();
  const data = {
    name: petForm.name.value.trim(),
    cuteness: Number(petForm.cuteness.value),
    age: Number(petForm.age.value),
    typeid: Number(petForm.typeid.value),
    picture: petForm.picture.value.trim()
  };
  const id = petForm.id.value;
  try {
    if (id) { data.id = Number(id); await request('pets/update', API.methods.update, data); }
    else await request('pets/create', API.methods.create, data);
    toast('Kisállat mentve');
    resetPetForm();
    await loadPets();
  } catch (err) { toast(err.message, true); }
};

$('#petList').onclick = async e => {
  const edit = e.target.dataset.edit, del = e.target.dataset.del;
  if (edit) {
    const p = state.pets.find(x => String(x.id) === edit);
    petForm.id.value = p.id; petForm.name.value = p.name;
    petForm.cuteness.value = p.cuteness; petForm.age.value = p.age;
    petForm.typeid.value = p.typeid; petForm.picture.value = p.picture || '';
    $('#petFormTitle').textContent = 'Kisállat szerkesztése';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (del && confirm('Biztosan törlöd a kisállatot?')) {
    try { await request('pets/delete', API.methods.delete, { id: Number(del) }); toast('Kisállat törölve'); await loadPets(); }
    catch (err) { toast(err.message, true); }
  }
};

loadAll();