# Vercel fotoğraf yükleme

`/api/uploads/signature` artık Vercel Function olarak bulunur; SPA yönlendirmesi `/api/` isteklerini index.html'e göndermez. Hem proje kökü hem client Root Directory desteklenir. Yerel Express sunucusu aynı handler'ı kullanır.

Vercel → Project Settings → Environment Variables kısmında Production (ve kullanılıyorsa Preview) için şu değerleri ayarlayın:

- `CLOUDINARY_CLOUD_NAME` (mevcut `VITE_CLOUDINARY_CLOUD_NAME` da kullanılabilir)
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET` (yalnızca sunucu değişkeni; **VITE_ öneki eklemeyin**)
- `FIREBASE_API_KEY` (mevcut `VITE_FIREBASE_API_KEY` da kullanılabilir)

Değerler mevcut Cloudinary/Firebase projesinden alınmalıdır. Bu dosyaya veya Git'e gizli değer yazmayın. Ardından Redeploy yapın; yalnızca yerel dosya değişikliği canlı servisi güncellemez.

İstek Firebase oturum token'ıyla yapılır. Firebase token'ı aynı proje için doğrular; yalnızca `enes@erva.com` imza alabilir. Servis hesabı gerekmez. Eksik oturum 401, başka hesap 403, eksik yapılandırma 503 JSON döndürür. İmza Cloudinary'ye gönderilir; fotoğraf başarıyla yüklenince admin formuna URL/publicId yazılır. Firestore kaydı ayrıca memories admin yazma izni gerektirir.

Kaynaklar: [Vercel Node Functions](https://vercel.com/docs/functions/runtimes/node-js), [Cloudinary upload signatures](https://cloudinary.com/documentation/upload_images#generating_authentication_signatures).
