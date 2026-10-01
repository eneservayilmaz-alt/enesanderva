# Firestore admin izinleri

Fotoğraf ekleme/düzenleme isteği artık memories için admin yazma izni gerektiriyor. Önceki `allow write: if false` kuralı bu işlemi engelliyordu. Canlı kurallar okunmadığı için mevcut sunucu durumu doğrulanmadı.

Firebase Console → Firestore Database → Rules bölümünde **tam dosyayı** kullanın. Kural yalnızca `eneservanur@admin.com` hesabına yazma izni verir. watchlist kuralları korunmuştur. Başka koleksiyon kurallarınız varsa onları da koruyun. Yerel dosyayı değiştirmek kuralları Firebase’e yayımlamaz.

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isMemoryAdmin() {
      return request.auth != null
        && request.auth.token.email == 'eneservanur@admin.com';
    }
    match /memories/{memoryId} {
      function validMemory() {
        let item = request.resource.data;
        return item.keys().hasOnly(['title', 'date', 'note', 'imageUrl', 'publicId', 'createdAt'])
          && item.title is string && item.title.size() > 0
          && item.date is string
          && item.note is string
          && item.imageUrl is string && item.imageUrl.matches('https?://.*')
          && item.publicId is string;
      }
      allow read: if true;
      allow create: if isMemoryAdmin() && validMemory()
        && request.resource.data.createdAt is string;
      allow update: if isMemoryAdmin() && validMemory()
        && request.resource.data.diff(resource.data).affectedKeys()
          .hasOnly(['title', 'date', 'note', 'imageUrl', 'publicId']);
      allow delete: if isMemoryAdmin();
    }

    match /watchlist/{itemId} {
      function isWatchlistAdmin() {
        return request.auth != null
          && request.auth.token.email == 'eneservanur@admin.com';
      }
      function validItem() {
        let item = request.resource.data;
        return item.keys().hasOnly(['title', 'kind', 'status', 'season', 'episode',
          'enesRating', 'ervanurRating', 'imageUrl', 'createdAt'])
          && item.title is string && item.title.size() > 0 && item.title.size() <= 100
          && item.kind in ['series', 'movie', 'anime']
          && item.status in ['planned', 'watching', 'completed']
          && item.enesRating is int && item.enesRating >= 0 && item.enesRating <= 5
          && item.ervanurRating is int && item.ervanurRating >= 0 && item.ervanurRating <= 5
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
  }
}
```

Kaynak: https://firebase.google.com/docs/firestore/security/rules-conditions
