# Petualangan Pilihanmu 📖

Sebuah web app Choose-Your-Own-Adventure interaktif dengan sistem autentikasi dan tracking progres.

## 🚀 Fitur

- **Gameplay Interaktif**: Pilih jalanmu sendiri melalui cerita
- **14 Ending Berbeda**: Temukan semua kemungkinan akhir cerita
- **Koleksi Ending**: Galeri untuk melihat ending yang sudah dibuka
- **Simpan Progres**: Sebagai tamu (localStorage) atau akun (Supabase)
- **Dark/Light Mode**: Pilih tema sesuai preferensi
- **Mobile-First**: Tampilan responsif untuk semua perangkat

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL)
- **Font**: Plus Jakarta Sans

## 📦 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Buat project di [Supabase](https://supabase.com)
2. Buka **SQL Editor** dan jalankan script di `supabase/migrations/001_init.sql`
3. Aktifkan **Email Auth** di Authentication > Providers

### 3. Configure Environment

Buat file `.env.local` di root project:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Nilai ini bisa ditemukan di Supabase Dashboard > Settings > API

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173)

## 📁 Struktur Folder

```
src/
├── app/                    # App setup & routing
│   ├── App.jsx
│   ├── Router.jsx
│   └── providers/
│       ├── AuthProvider.jsx
│       └── ThemeProvider.jsx
├── components/             # UI components
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   ├── StoryNode.jsx
│   ├── EndingCard.jsx
│   ├── Confetti.jsx
│   └── ui/
│       └── LoadingSpinner.jsx
├── pages/                  # Route pages
│   ├── HomePage.jsx
│   ├── PlayPage.jsx
│   ├── EndingsPage.jsx
│   ├── LoginPage.jsx
│   ├── SettingsPage.jsx
│   └── ErrorPage.jsx
├── lib/                    # Utilities
│   ├── supabaseClient.js
│   ├── storage.js
│   ├── validator.js
│   └── api.js
├── hooks/                  # Custom hooks
│   ├── useGame.js
│   └── useEndings.jsx
├── data/                   # Story data
│   └── storyline.json
└── styles/
    └── index.css
```

## 📖 Format Data Cerita

```json
{
  "nodes": [
    {
      "id": "n1",
      "text": "Teks cerita...",
      "choices": [
        { "label": "Pilihan A", "next": "n2" },
        { "label": "Pilihan B", "ending": "e1" }
      ]
    }
  ],
  "endings": [
    {
      "id": "e1",
      "title": "Judul Ending",
      "badge": "Badge Name",
      "text": "Deskripsi ending...",
      "hint": "Petunjuk untuk menemukan ending ini"
    }
  ]
}
```

### Validasi Data

Aplikasi akan memvalidasi storyline.json saat startup:
- Semua ID node dan ending harus unik
- Setiap node harus punya tepat 2 pilihan
- Setiap pilihan harus punya `next` ATAU `ending` (tidak keduanya)
- Semua referensi harus valid

## 🆕 Menambah Story Pack Baru

1. Buat file JSON baru di `src/data/` (contoh: `mystery.json`)
2. Tambahkan row ke tabel `story_packs`:
   ```sql
   INSERT INTO story_packs (id, title) VALUES ('mystery', 'Misteri Malam');
   ```
3. Modifikasi UI untuk memilih story pack
4. Pass `storyPackId` ke hooks dan API calls

## 🔐 Database Schema

### story_packs
| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key |
| title | text | Display name |
| created_at | timestamptz | Creation time |

### unlocked_endings
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Reference to auth.users |
| story_pack_id | text | Reference to story_packs |
| ending_id | text | Ending identifier |
| unlocked_at | timestamptz | Unlock time |

## 📱 Routes

| Path | Description |
|------|-------------|
| `/` | Halaman utama |
| `/play` | Bermain cerita |
| `/endings` | Galeri ending |
| `/login` | Masuk/Daftar |
| `/settings` | Pengaturan |

## 📄 License

MIT
