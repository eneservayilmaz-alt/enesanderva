import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Heart, Menu, X } from 'lucide-react'
import SeriesAndFilms from './SeriesAndFilms'
import CloudinaryPhoto from './CloudinaryPhoto'

const memories = [
  { number: '01', title: 'Her şeyin başladığı yer', date: 'İLK BULUŞMA', image: 'photo-1516589178581-6cd7833ae3b2', tone: 'memory-card--large' },
  { number: '02', title: 'Bir yaz akşamı', date: 'YAZ 2025', image: 'photo-1470252649378-9c29740c9fa8', tone: '' },
  { number: '03', title: 'Yolumuz hep güzel yerlere', date: 'BİRLİKTE YOLDA', image: 'photo-1470770841072-f978cf4d019e', tone: '' },
]

function App() {
  const [active, setActive] = useState('Anılarımız')
  const [menuOpen, setMenuOpen] = useState(false)
  const goTo = (label: string, target: string) => {
    setActive(label)
    setMenuOpen(false)
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main>
      <header className="site-header flex items-center justify-between px-[7.2%] max-md:px-[6%]">
        <a className="wordmark flex items-center gap-2" href="#top" onClick={() => setActive('Anılarımız')} aria-label="Bizim Anılarımız ana sayfa">
          <span className="wordmark-heart inline-flex"><Heart size={15} fill="currentColor" /></span> BİZİM ARŞİVİMİZ<span className="wordmark-dot">.</span>
        </a>
        <nav className="desktop-nav flex items-center gap-9 max-md:hidden" aria-label="Ana menü">
          <button className={active === 'Hakkımızda' ? 'nav-link active' : 'nav-link'} onClick={() => goTo('Hakkımızda', '#hakkimizda')}>Hakkımızda</button>
          <button className={active === 'Anılarımız' ? 'nav-link active' : 'nav-link'} onClick={() => goTo('Anılarımız', '#anilarimiz')}>Anılarımız</button>
          <button className={active === 'Dizi & Filmler' ? 'nav-link active' : 'nav-link'} onClick={() => goTo('Dizi & Filmler', '#dizi-filmler')}>Dizi &amp; Filmler</button>
          <span className="nav-index">01 — 03</span>
        </nav>
        <button className="mobile-menu hidden max-md:block" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav className="mobile-nav flex flex-col" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <button onClick={() => goTo('Hakkımızda', '#hakkimizda')}>Hakkımızda</button>
              <button onClick={() => goTo('Anılarımız', '#anilarimiz')}>Anılarımız</button>
              <button onClick={() => goTo('Dizi & Filmler', '#dizi-filmler')}>Dizi &amp; Filmler</button>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <section className="hero" id="top">
        <div className="hero-meta border-b border-white/10 pb-4 mb-8 flex justify-between items-center">
          <span>İKİ KİŞİLİK KÜÇÜK BİR EVREN</span>
          <span>BAŞLANGIÇTAN BUGÜNE, HEP BİRLİKTE</span>
        </div>
        <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}>
          En güzel<br />hikâyemiz <em>bizim.</em>
        </motion.h1>
        <div className="hero-bottom border-t border-white/10 pt-6 mt-8">
          <p>Küçük anlar, uzun yollar, bolca kahkaha.<br />Bize ait ne varsa, burada.</p>
          <button className="round-link" onClick={() => goTo('Anılarımız', '#anilarimiz')} aria-label="Anılara kaydır">
            <ArrowDown size={18} />
          </button>
          <span className="hero-note">SEVGİYLE BİRİKTİRİLDİ <Heart size={12} fill="currentColor" /></span>
        </div>
        <div className="hero-stamp" aria-hidden="true">
          <span>YOU &amp; ME<br />ALWAYS</span>
          <Heart size={15} fill="currentColor" />
        </div>
      </section>

      <section className="intro section-pad" id="hakkimizda">
        <div className="section-kicker">
          <span>01 / HAKKIMIZDA</span>
          <span>BİZİM HİKÂYEMİZ</span>
        </div>
        <div className="intro-grid grid grid-cols-[1.15fr_.65fr] gap-[8%] items-end max-md:grid-cols-1 max-md:gap-[30px]">
          <h2>İki ayrı yoldan,<br /><em>aynı hikâyeye.</em></h2>
          <div className="intro-copy">
            <p>Biri Ordu’dan, diğeri Zonguldak’tan yola çıkan iki hayatın kesişimi… Sayfalar dolusu kitap muhabbetleriyle başlayan hikâyemiz, kod satırları ve ortak hayallerle büyümeye devam ediyor. Zonguldak Bülent Ecevit Üniversitesi Bilgisayar Mühendisliği mezunu Muhammed Enes ile aynı üniversitede Yazılım Geliştirme yolculuğuna devam eden Ervanur’un birlikte yazdığı bu köşe; bize, anlarımıza ve yarınlarımıza dair.</p>
            <p>Henüz anlatacak çok şeyimiz, çekilecek çok fotoğrafımız var. Hepsi için buradayız.</p>
            <button className="text-link" onClick={() => goTo('Anılarımız', '#anilarimiz')}>Anılarımıza göz at <ArrowRight size={15} /></button>
          </div>
        </div>
        <div className="stats-row">
          <div><strong>∞</strong><span>birlikte biriktirecek an</span></div>
          <div><strong>01</strong><span>bu hikâyenin kahramanı</span></div>
          <span className="stats-mark">BİRLİKTE, HEP.</span>
        </div>
      </section>

      <section className="memories section-pad" id="anilarimiz">
        <div className="section-kicker">
          <span>02 / ANILARIMIZ</span>
          <span>SEÇİLMİŞ KÜÇÜK MUTLULUKLAR</span>
        </div>
        <div className="memories-heading flex items-end justify-between max-md:block">
          <h2>Biriktirdiklerimiz<span className="accent">.</span></h2>
          <p>Her fotoğrafın arkasında<br />bir “hatırlıyor musun?” var.</p>
        </div>
        <div className="memory-grid grid grid-cols-[1.3fr_1fr_1fr] gap-[18px] items-start max-md:grid-cols-2 max-md:gap-[10px]">
          <AnimatePresence>
            {memories.map((memory, i) => (
              <motion.article className={`memory-card ${memory.tone} ${i === 0 ? 'max-md:col-span-2' : ''}`} key={memory.number} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .65, delay: i * .1 }}>
                <div className="memory-photo" style={{ backgroundImage: `linear-gradient(180deg, transparent 48%, rgba(12,12,11,.48)), url(https://images.unsplash.com/${memory.image}?auto=format&fit=crop&w=1200&q=85)` }}>
                  {i === 0 && <CloudinaryPhoto publicId="cld-sample-5" alt="Cloudinary örnek fotoğrafı" width={1200} height={900} className="memory-cloudinary-image" />}
                  <span className="photo-index">{memory.number}</span>
                  <span className="photo-heart"><Heart size={15} /></span>
                  <span className="photo-title">{memory.title}</span>
                </div>
                <div className="memory-caption">
                  <span>{memory.date}</span>
                  <ArrowUpRight size={15} />
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
        <div className="memories-foot">
          <span>DAHA NİCE GÜZEL ANA...</span>
          <span>01 — ∞</span>
        </div>
      </section>

      <SeriesAndFilms />

      <footer className="footer section-pad">
        <div className="footer-top">
          <span>EN GÜZEL ŞEYLER, BİRLİKTEYKEN.</span>
          <Heart size={19} fill="currentColor" />
        </div>
        <p>Bu hikâye <em>devam ediyor.</em></p>
        <div className="footer-bottom">
          <a className="wordmark" href="#top">BİZİM ARŞİVİMİZ<span className="wordmark-dot">.</span></a>
          <span>SEVGİYLE, İKİMİZ.</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>YUKARI ÇIK ↑</button>
        </div>
      </footer>
    </main>
  )
}

export default App