# Bizim Anılarımız

Birlikte biriktirdiğimiz fotoğrafları ve hikâyeleri saklamak için React + Node.js projesi.

## Teknoloji

- Web: React, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide
- API: Node.js, Express, Firebase Admin / Firestore, Cloudinary
- Palet: `#0C0C0B`, `#F1EFE7`, `#D1867D`

## Başlangıç

Node.js 20 veya üzeri gerekir. Kök klasörde `npm install`, ardından `npm run dev` komutunu çalıştırın. Web uygulaması `http://localhost:5173`, API `http://localhost:4000` adresindedir.

Yerel servis bilgileri kök `.env` dosyasında tutulur; örnek anahtarlar `.env.example` içindedir. Web SDK ayarı ve Firestore istemcisi `client/src/lib/firebase.ts` içindedir; Vite yalnızca `VITE_` ile başlayan değerleri istemciye aktarır. Node tarafındaki Firebase Admin işlemleri ayrıca bir servis hesabı JSON'u veya `GOOGLE_APPLICATION_CREDENTIALS` ile yerel kimlik bilgisi ister. Bu servis hesabını `.env` dosyasına yerel olarak ekleyin; Git'e ya da sohbete göndermeyin.

Cloudinary'den cloud name, API key ve API secret alın. İmzalı yüklemelerde API secret sunucuda kalır. React görsel sunumu ve otomatik dönüşüm `client/src/CloudinaryPhoto.tsx` bileşenindedir; Cloudinary cloud name kaynak dosyasında `dx1m46bt` olarak ayarlı. Fotoğraf dosyaları Cloudinary'de; başlık, tarih ve açıklama gibi anı kayıtları Firestore'da tutulur. Bu servislerin ücretsiz planları kota ve koşullara tabidir; sınırsız depolama varsayılmamalıdır.

## İlk sürüm

- “Hakkımızda” ve “Anılarımız” gezinmesi
- Dizi ve film izleme listesi; tür filtresi, bitirme durumu ve dizi sezon/bölüm ilerlemesi
- Framer Motion ile giriş ve anı kartı geçişleri; mobil uyumlu Tailwind CSS düzeni
- İmzalı Cloudinary yüklemesi ve Firestore kayıt altyapısı

İzleme listesi Firestore'daki `watchlist` koleksiyonunu kullanır. API `GET`/`POST /api/watchlist` ve `PATCH /api/watchlist/:id` uç noktalarını sağlar.

Kimlik doğrulama ve erişim kuralları henüz eklenmedi. Gerçek ve özel fotoğrafları yüklemeden önce bu katmanı tamamlayacağız.
