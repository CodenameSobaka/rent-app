const supabaseUrl = 'https://sxogeqclhzsbrgrnmlmt.supabase.co';
const supabaseKey = 'sxogeqclhzsbrgrnmlmt'; // из Supabase → Settings → API

const supabase = Supabase.createClient(supabaseUrl, supabaseKey);

let currentUser = null;

// Авторизация
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert('Проверь почту для подтверждения!');
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else {
    currentUser = data.user;
    document.getElementById('create-form').style.display = 'block';
    loadListings();
  }
}

// Загрузка объявлений
async function loadListings() {
  const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
  if (error) console.error(error);
  else renderCards(data);
}

// Создание объявления
async function createListing() {
  // Собери данные из формы
  const { error } = await supabase.from('listings').insert([{
    title: "...",
    city: "...",
    price: 35000,
    // ... остальные поля
    user_id: currentUser.id
  }]);

  if (error) alert(error.message);
  else {
    alert('Объявление добавлено!');
    loadListings();
  }
}

// При загрузке страницы
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    currentUser = session.user;
    document.getElementById('create-form').style.display = 'block';
  }
});

loadListings();
