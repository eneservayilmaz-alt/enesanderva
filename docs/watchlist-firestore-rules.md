# İzleme listesi Firestore erişimi

2026-10-01: Web SDK Firebase'e ulaşıyor; oturum açmış `enes@erva.com` hesabıyla `watchlist` okuma ve oluşturma işlemleri `permission-denied` döndü. Yerel `FIREBASE_SERVICE_ACCOUNT_JSON` gerekli servis hesabı alanlarını içermiyor. Henüz örnek kayıt oluşturulamadı.

Firebase Console → Firestore Database → Rules bölümünde aşağıdaki **match bloğunu mevcut `/databases/{database}/documents` bloğunun içine ekleyin**. Mevcut `memories`, `siteContent` ve diğer koleksiyon kurallarını koruyun. Bu dosya kuralları otomatik yayımlamaz.

```javascript
match /watchlist/{itemId} {
  function isWatchlistAdmin() {
    return request.auth != null
      && request.auth.token.email == 'enes@erva.com';
  }
  function validItem() {
    let item = request.resource.data;
    return item.keys().hasOnly(['title', 'kind', 'status', 'season', 'episode',
      'enesRating', 'ervaRating', 'imageUrl', 'createdAt'])
      && item.title is string && item.title.size() > 0 && item.title.size() <= 100
      && item.kind in ['series', 'movie', 'anime']
      && item.status in ['planned', 'watching', 'completed']
      && item.enesRating is int && item.enesRating >= 0 && item.enesRating <= 5
      && item.ervaRating is int && item.ervaRating >= 0 && item.ervaRating <= 5
      && item.imageUrl is string
      && (item.imageUrl == '' || item.imageUrl.matches('https?://.*'))
      && item.createdAt is string
      && ((item.kind == 'movie' && item.season == null && item.episode == null)
        || (item.kind != 'movie' && item.season is int && item.season >= 1
          && item.episode is int && item.episode >= 1));
  }
  // Normal /dizi-filmler sayfasının oturumsuz görüntülenmesi.
  allow read: if true;
  allow create: if isWatchlistAdmin() && validItem();
  allow update: if isWatchlistAdmin() && validItem()
    && request.resource.data.createdAt == resource.data.createdAt;
  allow delete: if isWatchlistAdmin();
}
```

Bu blok, herkese listeyi okuma; yalnızca belirtilen admin hesabına yazma izni verir. Daha geniş bir üst `match` kuralı varsa, Firestore izinleri birleştiği için o kural da kontrol edilmelidir. Eski kayıtlarda puan/görsel alanları eksikse önce admin düzenleme popup'ından kaydedin. Bu örnekte ziyaretçilerin ilerleme değiştirmesine izin verilmez; giriş yapmış admin değiştirebilir.

Kurallar yayımlandıktan sonra admin `/admin/dizi-filmler` popup'ındaki hazırlanmış örnek kaydı yeniden kaydedin ve sayfayı yenileyerek puanları ve görsel adresini doğrulayın. Firestore koleksiyonu ilk başarılı belge yazımıyla otomatik oluşur.

Görsel galerisi Wikipedia PageImages API'sini kullanır; seçilen URL `imageUrl` alanına yazılır. Cloudinary kullanılmaz. Google Custom Search JSON API yeni müşterilere kapalı olduğundan Google görselleri entegrasyonu kurulmadı: https://developers.google.com/custom-search/v1/overview
