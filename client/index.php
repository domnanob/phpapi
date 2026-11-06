<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kisállatok</title>
<link rel="stylesheet" href="./src/css/style.css">
<style>
  
</style>
</head>
<body>
<header>
  <h1>🐾 Kisállat nyilvántartó</h1>
  <nav>
    <button data-tab="pets" class="active">Kisállatok</button>
    <button data-tab="types">Típusok</button>
  </nav>
</header>

<main>
  <!-- PETS -->
  <section id="pets" class="active">
    <div class="card">
      <h2 id="petFormTitle">Új kisállat</h2>
      <form id="petForm">
        <input type="hidden" name="id">
        <label>Név <input name="name" required></label>
        <label>Cukiság (1-10) <input name="cuteness" type="number" min="0" max="10" required></label>
        <label>Kor <input name="age" type="number" min="0" required></label>
        <label>Típus <select name="typeid" required></select></label>
        <label>Kép (URL vagy fájlnév) <input name="picture" placeholder="https://... vagy kutya.jpg"></label>
        <label>Kép feltöltése (fájl)
          <input type="file" id="petFile" accept="image/*">
        </label>
        <div>
          <button class="primary" type="submit">Mentés</button>
          <button type="button" id="petCancel">Mégse</button>
        </div>
      </form>
      <p class="hint">Fájl választásakor a fájl neve kerül mentésre; a képnek a <code>client/src/img</code> mappában kell lennie.</p>
    </div>
    <div class="grid" id="petList"></div>
  </section>

  <!-- TYPES -->
  <section id="types">
    <div class="card">
      <h2 id="typeFormTitle">Új típus</h2>
      <form id="typeForm">
        <input type="hidden" name="id">
        <label>Név <input name="name" required></label>
        <div>
          <button class="primary" type="submit">Mentés</button>
          <button type="button" id="typeCancel">Mégse</button>
        </div>
      </form>
    </div>
    <div class="card">
      <table>
        <thead><tr><th>ID</th><th>Név</th><th></th></tr></thead>
        <tbody id="typeList"></tbody>
      </table>
    </div>
  </section>
</main>
<div id="msg"></div>

<script src="./src/js/jquery-4.0.0.min.js"></script>
<script src="./src/js/script.js"></script>
</body>
</html>