const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKUz7jYM_BaqIoiWYVKExyw50HIWysPRyBw_twgIFzX3UQk22M9qzhLUfaJY6DFUuZ83ggADHHHA5h/pubhtml";
// Замени ТВОЙ_ID на реальный ID из ссылки таблицы

async function loadData() {
  const response = await fetch(SHEET_URL);
  const text = await response.text();
  const rows = text.split('\n').map(row => row.split(',').map(cell => cell.replace(/"/g, '')));
  
  const headers = rows[0];
  const data = rows.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i] || '');
    return obj;
  });

  window.allData = data;
  renderCards(data);
  fillCities(data);
}

function fillCities(data) {
  const cities = [...new Set(data.map(item => item.Город))];
  const select = document.getElementById('city');
  cities.forEach(city => {
    if (city) {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      select.appendChild(opt);
    }
  });
}

function renderCards(data) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      ${item['Фото (ссылка)'] ? `<img src="${item['Фото (ссылка)']}" alt="фото">` : ''}
      <div class="card-content">
        <h3>${item.Город}, ${item.Район}</h3>
        <p class="price">${item.Цена} ₽/мес</p>
        <p>${item.Комнат}к, ${item.Площадь} м², ${item.Этаж} этаж</p>
        <p>${item.Адрес}</p>
        <p>${item.Описание ? item.Описание.substring(0, 120) + '...' : ''}</p>
        ${item.Телефон ? `<p><strong>Тел: </strong>${item.Телефон}</p>` : ''}
        ${item['Ссылка на объявление'] ? `<a href="${item['Ссылка на объявление']}" target="_blank">Подробнее →</a>` : ''}
      </div>
    `;
    container.appendChild(card);
  });
}

function filterTable() {
  const search = document.getElementById('search').value.toLowerCase();
  const city = document.getElementById('city').value;
  const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;

  const filtered = window.allData.filter(item => {
    const matchesSearch = !search || 
      (item.Адрес && item.Адрес.toLowerCase().includes(search)) ||
      (item.Район && item.Район.toLowerCase().includes(search));
    
    const matchesCity = !city || item.Город === city;
    const matchesPrice = !item.Цена || parseInt(item.Цена) <= maxPrice;

    return matchesSearch && matchesCity && matchesPrice;
  });

  renderCards(filtered);
}

// Загружаем данные при открытии страницы
loadData();