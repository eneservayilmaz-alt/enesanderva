import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react'

export type Language = 'tr' | 'en'

const copy = {
  tr: {
    previousPhoto: 'Önceki fotoğraf', nextPhoto: 'Sonraki fotoğraf',
    anime: 'Animeler', enesRating: "Enes’in Puanı", ervaRating: "Erva’nın Puanı", unrated: 'Puan verilmedi',
    seasonEpisode: 'Sezon / Bölüm', notApplicable: 'Film için uygulanmaz',
    mediaNameImage: 'Ad / Görsel',
    memoryWriteDenied: 'Fotoğraf kaydedilemedi. Firestore memories koleksiyonu için admin yazma izni bulunmuyor. Firebase kurallarını kontrol edin.',
    uploadServiceUnavailable: 'Görsel yükleme servisi kullanılamıyor. Lütfen site yöneticisinin yükleme ayarlarını tamamlamasını bekleyin.',
    sortBy: 'Sıralama', sortTitleAsc: 'A’dan Z’ye', sortTitleDesc: 'Z’den A’ya',
    sortEnesDesc: 'Enes’in puanı: yüksekten düşüğe', sortErvaDesc: 'Erva’nın puanı: yüksekten düşüğe',
    sortEnesAsc: 'Enes’in puanı: düşükten yükseğe', sortErvaAsc: 'Erva’nın puanı: düşükten yükseğe', ratings: 'Puanlamalar', actions: 'İşlemler', animeOne: 'Anime',
    imageSearch: 'Görsel ara', imageSearchPlaceholder: 'Örn. Predestination film',
    imageSearchSource: 'Wikipedia görselleri · Bir görsel seçin; yalnızca internet adresi kaydedilir.',
    imageSearchError: 'Görsel aramasına ulaşılamadı. Yeniden deneyin veya görsel adresi yapıştırın.',
    noImages: 'Görsel bulunamadı. Aramayı değiştirin veya görsel adresi yapıştırın.',
    imageUrl: 'Görsel adresi (isteğe bağlı)', removeImage: 'Görseli kaldır', invalidImageUrl: 'Geçerli bir http veya https görsel adresi girin.',

    dataPermissionDenied: 'Arşivi görüntülemek için gerekli erişim izni bulunmuyor.',
    dataServerNotConfigured: 'Sunucunun veritabanı bağlantısı henüz yapılandırılmamış.',
    dataDatabaseMissing: 'Arşiv veritabanı bulunamadı.',
    dataUnavailable: 'Anı arşivine şu anda ulaşılamıyor. Bağlantıyı kontrol edip yeniden deneyin.',
    dataApiUnavailable: 'Uygulama sunucusuna ulaşılamıyor. Lütfen daha sonra tekrar deneyin.',
    dataLoadFailed: 'Kayıtlar yüklenemedi. Lütfen yeniden deneyin.',
    allMemories: 'Tüm anılarımız', allMedia: 'Tüm dizi ve filmler',
    brand: 'BİZİM ARŞİVİMİZ', mainNav: 'Ana menü', openMenu: 'Menüyü aç', closeMenu: 'Menüyü kapat', navAbout: 'Hakkımızda', navMemories: 'Anılarımız', navMedia: 'Dizi & Filmler',
    heroMeta: 'İKİ KİŞİLİK KÜÇÜK BİR EVREN', heroAside: 'BAŞLANGIÇTAN BUGÜNE, HEP BİRLİKTE', heroFirst: 'En güzel', heroSecond: 'hikâyemiz bizim.', heroCopy: 'Küçük anlar, uzun yollar, bolca kahkaha. Bize ait ne varsa, burada.', heroNote: 'SEVGİYLE BİRİKTİRİLDİ', scroll: 'KAYDIR',
    aboutIndex: 'HAKKIMIZDA', story: 'BİZİM HİKÂYEMİZ', aboutFirst: 'İki ayrı yoldan,', aboutSecond: 'aynı hikâyeye.', aboutCopy1: 'Biri Ordu’dan, diğeri Zonguldak’tan yola çıkan iki hayatın kesişimi… Sayfalar dolusu kitap muhabbetleriyle başlayan hikâyemiz, kod satırları ve ortak hayallerle büyümeye devam ediyor. Zonguldak Bülent Ecevit Üniversitesi Bilgisayar Mühendisliği mezunu Muhammed Enes ile aynı üniversitede Yazılım Geliştirme yolculuğuna devam eden Ervanur’un birlikte yazdığı bu köşe; bize, anlarımıza ve yarınlarımıza dair.', aboutCopy2: 'Henüz anlatacak çok şeyimiz, çekilecek çok fotoğrafımız var. Hepsi için buradayız.', memoriesCta: 'Anılarımıza göz at', statOne: 'birlikte biriktirecek an', statTwo: 'bu hikâyenin kahramanı', together: 'BİRLİKTE, HEP.',
    memoryIndex: 'ANILARIMIZ', memoryAside: 'SEÇİLMİŞ KÜÇÜK MUTLULUKLAR', memoriesTitle: 'Biriktirdiklerimiz', memoryNote: 'Her fotoğrafın arkasında bir “hatırlıyor musun?” var.', memory1: 'Her şeyin başladığı yer', memory2: 'Bir yaz akşamı', memory3: 'Yolumuz hep güzel yerlere', date1: 'İLK BULUŞMA', date2: 'YAZ 2025', date3: 'BİRLİKTE YOLDA', moreMemories: 'DAHA NİCE GÜZEL ANA...', emptyMemories: 'Henüz anı eklenmemiş. İlk fotoğrafınızı Cloudinary’ye yükleyip Firestore’a kaydedin.', backHome: 'Ana sayfaya dön', loadingMemories: 'Anılar yükleniyor…',
    mediaIndex: 'EKRAN BAŞINDA', mediaAside: 'İZLEDİKLERİMİZ VE SIRADAKİLER', mediaEyebrow: 'KÜÇÜK BİR İZLEME GÜNLÜĞÜ', mediaTitle: 'Dizi & Filmler', add: 'Listeye ekle', library: 'KÜTÜPHANE', all: 'Hepsi', series: 'Diziler', films: 'Filmler', evenings: 'BERABER GEÇEN AKŞAMLAR', eveningsCopy: 'Bir bölüm daha deyip sabahladığımız her şey.', ourList: 'BİZİM LİSTEMİZ', entries: 'KAYIT', loading: 'Liste yükleniyor…', emptyTitle: 'Listeniz henüz boş.', emptyCopy: 'Dizi, film ve animelerimiz burada birikecek.', firstEntry: 'İlk kaydı ekle', titleLabel: 'İzlediklerimizin adı', titlePlaceholder: 'Örn. Bir dizi ya da film', movie: 'Film', seriesOne: 'Dizi', save: 'Kaydet', season: 'Sezon', episode: 'Bölüm', saveProgress: 'İlerlemeyi kaydet', finished: 'BİTİRDİK', ongoing: 'DEVAM EDİYOR', planned: 'İZLENECEKLER', markFinished: 'Bitirdik olarak işaretle', finishedButton: 'Bitirdik', apiError: 'Listeniz şu an yüklenemedi. Firebase bağlantısını kontrol edin.', genericError: 'Bir hata oluştu.', saveError: 'Kayıt eklenemedi.', updateError: 'Değişiklik kaydedilemedi.', invalidTitle: 'Başlık 1–100 karakter arasında olmalı.', invalidKind: 'Tür dizi veya film olmalı.', invalidStatus: 'Geçersiz izleme durumu.', invalidProgress: 'Sezon ve bölüm 1 veya üzeri tam sayı olmalı.', missingUpdate: 'Güncellenecek bir alan gönderilmedi.', missingRecord: 'Kayıt bulunamadı.',
    footerLine: 'EN GÜZEL ŞEYLER, BİRLİKTEYKEN.', footerTitle: 'Bu hikâye', footerEnd: 'devam ediyor.', footerSign: 'SEVGİYLE, İKİMİZ.', top: 'YUKARI ÇIK ↑', languageLabel: 'Dili English yap', themeLabel: 'Açık temaya geç', themeDarkLabel: 'Koyu temaya geç', loginTitle: 'Giriş Yap', loginEmail: 'E-posta', loginPassword: 'Şifre', loginButton: 'Giriş', loginError: 'E-posta veya şifre hatalı.', loginRequired: 'Bu sayfayı görüntülemek için giriş yapmalısınız.', adminTitle: 'Yönetim Paneli', adminWelcome: 'Hoş geldiniz, yönetici.', adminLogout: 'Çıkış Yap', navAdmin: 'Yönetim', adminDeleteConfirm: 'Bu kaydı silmek istediğinize emin misiniz?', adminMemoryTitle: 'Başlık', adminMemoryDate: 'Tarih', adminMemoryImage: 'Görsel', adminMemoryNote: 'Not', adminType: 'Tür', adminStatus: 'Durum', edit: 'Düzenle', delete: 'Sil', cancel: 'İptal', confirmDelete: 'Evet, sil', deleteConfirmTitle: 'Silmek istediğinize emin misiniz?', editMemory: 'Anıyı düzenle', addMemory: 'Yeni anı ekle', editMedia: 'Dizi veya filmi düzenle', aboutHeading: 'Başlığın ilk satırı', aboutHeadingSecond: 'Başlığın ikinci satırı', aboutParagraphOne: 'Birinci paragraf', aboutParagraphTwo: 'İkinci paragraf', chooseImage: 'Kütüphaneden görsel seç', uploadingImage: 'Görsel Cloudinary’ye yükleniyor', imageUploadFailed: 'Görsel yüklenemedi. Sunucu ve Cloudinary bağlantısını kontrol edin.', imageOnly: 'Lütfen bir görsel dosyası seçin.', imageTooLarge: 'Görsel boyutu en fazla 10 MB olabilir.', memoryImagePreview: 'Seçilen görselin önizlemesi', memoryDatePlaceholder: 'Örn. 19 Temmuz 2026', backToHome: 'Ana sayfaya dön',
  },
  en: {
    previousPhoto: 'Previous photo', nextPhoto: 'Next photo',
    anime: 'Anime', enesRating: "Enes’s rating", ervaRating: "Erva’s rating", unrated: 'Not rated',
    seasonEpisode: 'Season / Episode', notApplicable: 'Not applicable to films',
    mediaNameImage: 'Title / Image',
    memoryWriteDenied: 'Photo could not be saved. Admin write access to the Firestore memories collection is missing. Check the Firebase rules.',
    uploadServiceUnavailable: 'Image upload is unavailable. Please wait for the site administrator to finish configuring uploads.',
    sortBy: 'Sort by', sortTitleAsc: 'A to Z', sortTitleDesc: 'Z to A',
    sortEnesDesc: 'Enes’s rating: high to low', sortErvaDesc: 'Erva’s rating: high to low',
    sortEnesAsc: 'Enes’s rating: low to high', sortErvaAsc: 'Erva’s rating: low to high', ratings: 'Ratings', actions: 'Actions', animeOne: 'Anime',
    imageSearch: 'Search images', imageSearchPlaceholder: 'e.g. Predestination film',
    imageSearchSource: 'Wikipedia images · Select an image; only its internet URL is saved.',
    imageSearchError: 'Image search is unavailable. Retry or paste an image URL.',
    noImages: 'No images found. Change your search or paste an image URL.',
    imageUrl: 'Image URL (optional)', removeImage: 'Remove image', invalidImageUrl: 'Enter a valid http or https image URL.',

    dataPermissionDenied: 'You do not have permission to view this archive.',
    dataServerNotConfigured: 'The server database connection has not been configured yet.',
    dataDatabaseMissing: 'The archive database could not be found.',
    dataUnavailable: 'The archive is currently unreachable. Check your connection and try again.',
    dataApiUnavailable: 'The application server is unreachable. Please try again later.',
    dataLoadFailed: 'The records could not be loaded. Please try again.',
    allMemories: 'All our memories', allMedia: 'All shows and films',
    brand: 'OUR LITTLE ARCHIVE', mainNav: 'Main menu', openMenu: 'Open menu', closeMenu: 'Close menu', navAbout: 'About Us', navMemories: 'Our Memories', navMedia: 'Shows & Films',
    heroMeta: 'A LITTLE UNIVERSE FOR TWO', heroAside: 'TOGETHER, FROM THE VERY BEGINNING', heroFirst: 'Our favorite', heroSecond: 'story is us.', heroCopy: 'Little moments, long roads, lots of laughter. Everything that is ours lives here.', heroNote: 'SAVED WITH LOVE', scroll: 'SCROLL',
    aboutIndex: 'ABOUT US', story: 'OUR STORY', aboutFirst: 'Two different roads,', aboutSecond: 'one shared story.', aboutCopy1: 'The intersection of two lives—one from Ordu, the other from Zonguldak… Our story began with countless book conversations and keeps growing through lines of code and shared dreams. This little corner, written together by Muhammed Enes—a Computer Engineering graduate of Zonguldak Bülent Ecevit University—and Ervanur, who continues her Software Development journey at the same university, is about us, our moments, and our tomorrows.', aboutCopy2: 'There are still so many stories to tell and photos to take. We are here for all of them.', memoriesCta: 'Explore our memories', statOne: 'memories still to make', statTwo: 'people in this story', together: 'TOGETHER, ALWAYS.',
    memoryIndex: 'OUR MEMORIES', memoryAside: 'A FEW LITTLE JOYS', memoriesTitle: 'What we keep', memoryNote: 'Behind every photo is a “remember when?”', memory1: 'Where it all began', memory2: 'A summer evening', memory3: 'The road takes us somewhere lovely', date1: 'OUR FIRST DATE', date2: 'SUMMER 2025', date3: 'ON THE ROAD', moreMemories: 'HERE IS TO MANY MORE…', emptyMemories: 'No memories yet. Upload your first photo to Cloudinary and save its record to Firestore.', backHome: 'Back to home', loadingMemories: 'Loading memories…',
    mediaIndex: 'SCREEN TIME', mediaAside: 'WHAT WE WATCHED & WHAT IS NEXT', mediaEyebrow: 'OUR LITTLE WATCHLIST', mediaTitle: 'Shows & Films', add: 'Add to list', library: 'LIBRARY', all: 'All', series: 'Shows', films: 'Films', evenings: 'EVENINGS TOGETHER', eveningsCopy: 'Everything we stayed up late to watch one more episode of.', ourList: 'OUR WATCHLIST', entries: 'SAVED', loading: 'Loading your list…', emptyTitle: 'Your list is empty for now.', emptyCopy: 'Our shows, films and anime will appear here.', firstEntry: 'Add the first one', titleLabel: 'Title', titlePlaceholder: 'A show or film', movie: 'Film', seriesOne: 'Show', save: 'Save', season: 'Season', episode: 'Episode', saveProgress: 'Save progress', finished: 'FINISHED', ongoing: 'IN PROGRESS', planned: 'UP NEXT', markFinished: 'Mark as finished', finishedButton: 'Finished', apiError: 'Could not load your list. Check the Firebase connection.', genericError: 'Something went wrong.', saveError: 'Could not add this item.', updateError: 'Could not save your changes.', invalidTitle: 'The title must be 1–100 characters.', invalidKind: 'Choose a show or film.', invalidStatus: 'That watch status is not valid.', invalidProgress: 'Season and episode must be positive whole numbers.', missingUpdate: 'No fields to update were provided.', missingRecord: 'Item not found.',
    footerLine: 'THE BEST THINGS ARE BETTER TOGETHER.', footerTitle: 'Our story', footerEnd: 'is still unfolding.', footerSign: 'WITH LOVE, US TWO.', top: 'BACK TO TOP ↑', languageLabel: 'Switch language to Türkçe', themeLabel: 'Switch to light theme', themeDarkLabel: 'Switch to dark theme', loginTitle: 'Sign In', loginEmail: 'Email', loginPassword: 'Password', loginButton: 'Sign In', loginError: 'Invalid email or password.', loginRequired: 'You must sign in to view this page.', adminTitle: 'Admin Panel', adminWelcome: 'Welcome, admin.', adminLogout: 'Sign Out', navAdmin: 'Admin', adminDeleteConfirm: 'Are you sure you want to delete this record?', adminMemoryTitle: 'Title', adminMemoryDate: 'Date', adminMemoryImage: 'Image', adminMemoryNote: 'Note', adminType: 'Type', adminStatus: 'Status', edit: 'Edit', delete: 'Delete', cancel: 'Cancel', confirmDelete: 'Yes, delete', deleteConfirmTitle: 'Are you sure you want to delete this?', editMemory: 'Edit memory', addMemory: 'Add a memory', editMedia: 'Edit show or film', aboutHeading: 'First heading line', aboutHeadingSecond: 'Second heading line', aboutParagraphOne: 'First paragraph', aboutParagraphTwo: 'Second paragraph', chooseImage: 'Choose an image', uploadingImage: 'Uploading image to Cloudinary', imageUploadFailed: 'Image upload failed. Check the server and Cloudinary connection.', imageOnly: 'Please choose an image file.', imageTooLarge: 'The image must be 10 MB or smaller.', memoryImagePreview: 'Selected image preview', memoryDatePlaceholder: 'e.g. July 19, 2026', backToHome: 'Back to home',
  },
} satisfies Record<Language, Record<string, string>>

type I18nValue = { language: Language; setLanguage: (language: Language) => void; t: (key: keyof typeof copy.tr) => string }
const I18nContext = createContext<I18nValue | null>(null)

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('eae-language') === 'en' ? 'en' : 'tr')
  const value = useMemo<I18nValue>(() => ({
    language,
    setLanguage: (next) => { localStorage.setItem('eae-language', next); setLanguage(next) },
    t: (key) => copy[language][key],
  }), [language])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useLanguage() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useLanguage must be used within LanguageProvider')
  return value
}

export function getAboutDefaults(language: Language) {
  const locale = copy[language]
  return { first: locale.aboutFirst, second: locale.aboutSecond, copy1: locale.aboutCopy1, copy2: locale.aboutCopy2 }
}
