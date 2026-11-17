/* Sextant — local-first prompt library. No server, no telemetry.
   Bilingual: Türkçe (varsayılan) / English. */

"use strict";

const STORAGE_KEY = "sextant.prompts.v1";
const SEED_FLAG = "sextant.seeded.v1";
const LANG_KEY = "sextant.lang";

/* ── i18n ───────────────────────────────────────────────────── */

const STRINGS = {
  en: {
    metaDescription: "Sextant — a local-first, offline personal prompt library. Search, copy, tag and track your best prompts. No account, no server, no telemetry.",
    title: "Sextant — your local prompt library",
    brandTagline: "your local prompt library",
    newPrompt: "New prompt",
    collections: "Collections",
    allPrompts: "All prompts",
    favorites: "Favorites",
    recentlyUsed: "Recently used",
    categories: "Categories",
    exportJson: "Export JSON",
    importJson: "Import JSON",
    searchPlaceholder: "Search prompts, tags, categories…",
    searchLabel: "Search prompts",
    sortLabel: "Sort order",
    sortRecent: "Recent",
    sortUses: "Most used",
    sortTitle: "A–Z",
    listLabel: "Prompt list",
    promptsCount: (n) => `${n} prompt${n === 1 ? "" : "s"}`,
    inCategory: (c) => ` in ${c}`,
    matching: (q) => ` matching “${q}”`,
    emptyTitle: "Nothing here yet",
    emptyHintFiltered: "No matches. Clear the search or pick another category.",
    emptyHintDefault: "Try a different search, or create your first prompt.",
    createPrompt: "Create a prompt",
    readerSelect: "Select a prompt to read it here.",
    readerHint: "Tip: press <kbd>/</kbd> to search and <kbd>N</kbd> to create one.",
    toggleFavorite: "Toggle favorite",
    copiedTimes: (n) => (n === 1 ? "Copied 1 time" : `Copied ${n} times`),
    edit: "Edit",
    delete: "Delete",
    copyPrompt: "Copy prompt",
    editorNew: "New prompt",
    editorEdit: "Edit prompt",
    closeEditor: "Close editor",
    fieldTitle: "Title",
    titlePlaceholder: "e.g. Precise code review",
    fieldCategory: "Category",
    categoryPlaceholder: "Coding",
    fieldTags: "Tags",
    tagsNote: "(comma separated)",
    tagsPlaceholder: "review, quality",
    fieldBody: "Prompt body",
    bodyPlaceholder: "You are a meticulous senior engineer…",
    addToFavorites: "Add to favorites",
    cancel: "Cancel",
    savePrompt: "Save prompt",
    footerPrompts: (n) => `${n} prompt${n === 1 ? "" : "s"}`,
    footerFavorites: (n) => `${n} favorite${n === 1 ? "" : "s"}`,
    footerCopies: (n) => `${n} total copies`,
    privacy: "Stored locally in this browser. Nothing leaves this machine.",
    uncategorised: "Uncategorised",
    favorite: "Favorite",
    addedFavorite: "Added to favorites",
    removedFavorite: "Removed from favorites",
    copied: "Prompt copied to clipboard",
    copyBlocked: "Copy blocked by browser — selected instead",
    confirmDelete: (title) => `Delete “${title}”? This cannot be undone.`,
    promptDeleted: "Prompt deleted",
    promptSaved: "Prompt saved",
    backupSaved: (path) => `Backup saved to ${path}`,
    backupDownloaded: "Backup downloaded",
    imported: (n) => `Imported ${n} prompt${n === 1 ? "" : "s"}`,
    nothingToImport: "Nothing new to import",
    importFailed: "Import failed: invalid backup file",
    language: "Language",
  },
  tr: {
    metaDescription: "Sextant — yerel öncelikli, çevrimdışı kişisel prompt kütüphanesi. Promptlarını ara, kopyala, etiketle ve takip et. Hesap yok, sunucu yok, telemetri yok.",
    title: "Sextant — yerel prompt kütüphanen",
    brandTagline: "yerel prompt kütüphanen",
    newPrompt: "Yeni prompt",
    collections: "Koleksiyonlar",
    allPrompts: "Tüm promptlar",
    favorites: "Favoriler",
    recentlyUsed: "Son kullanılanlar",
    categories: "Kategoriler",
    exportJson: "JSON dışa aktar",
    importJson: "JSON içe aktar",
    searchPlaceholder: "Prompt, etiket veya kategori ara…",
    searchLabel: "Promptlarda ara",
    sortLabel: "Sıralama",
    sortRecent: "Son",
    sortUses: "En çok",
    sortTitle: "A–Z",
    listLabel: "Prompt listesi",
    promptsCount: (n) => `${n} prompt`,
    inCategory: (c) => `, ${c} içinde`,
    matching: (q) => `, “${q}” ile eşleşen`,
    emptyTitle: "Henüz burada bir şey yok",
    emptyHintFiltered: "Sonuç bulunamadı. Aramayı temizle veya başka bir kategori seç.",
    emptyHintDefault: "Farklı bir arama deneyin ya da ilk promptunuzu oluşturun.",
    createPrompt: "Prompt oluştur",
    readerSelect: "Okumak için bir prompt seçin.",
    readerHint: "İpucu: aramak için <kbd>/</kbd>, yeni prompt için <kbd>N</kbd>",
    toggleFavorite: "Favorilere ekle/çıkar",
    copiedTimes: (n) => `${n} kez kopyalandı`,
    edit: "Düzenle",
    delete: "Sil",
    copyPrompt: "Promptu kopyala",
    editorNew: "Yeni prompt",
    editorEdit: "Promptu düzenle",
    closeEditor: "Düzenleyiciyi kapat",
    fieldTitle: "Başlık",
    titlePlaceholder: "örn. Titiz kod incelemesi",
    fieldCategory: "Kategori",
    categoryPlaceholder: "Kodlama",
    fieldTags: "Etiketler",
    tagsNote: "(virgülle ayırın)",
    tagsPlaceholder: "inceleme, kalite",
    fieldBody: "Prompt içeriği",
    bodyPlaceholder: "Sen titiz bir kıdemli mühendissin…",
    addToFavorites: "Favorilere ekle",
    cancel: "Vazgeç",
    savePrompt: "Promptu kaydet",
    footerPrompts: (n) => `${n} prompt`,
    footerFavorites: (n) => `${n} favori`,
    footerCopies: (n) => `${n} toplam kopya`,
    privacy: "Bu tarayıcıda yerel olarak saklanır. Hiçbir şey bu makineden çıkmaz.",
    uncategorised: "Kategorisiz",
    favorite: "Favori",
    addedFavorite: "Favorilere eklendi",
    removedFavorite: "Favorilerden çıkarıldı",
    copied: "Prompt panoya kopyalandı",
    copyBlocked: "Tarayıcı kopyalamayı engelledi — metin seçili bırakıldı",
    confirmDelete: (title) => `“${title}” silinsin mi? Bu işlem geri alınamaz.`,
    promptDeleted: "Prompt silindi",
    promptSaved: "Prompt kaydedildi",
    backupSaved: (path) => `Yedek kaydedildi: ${path}`,
    backupDownloaded: "Yedek indirildi",
    imported: (n) => `${n} prompt içe aktarıldı`,
    nothingToImport: "İçe aktarılacak yeni prompt yok",
    importFailed: "İçe aktarma başarısız: geçersiz yedek dosyası",
    language: "Dil",
  },
};

function currentLang() {
  const saved = localStorage.getItem(LANG_KEY);
  return saved === "en" || saved === "tr" ? saved : "tr";
}

function t(key, ...args) {
  const lang = currentLang();
  const entry = (STRINGS[lang] && STRINGS[lang][key]) ?? STRINGS.en[key];
  return typeof entry === "function" ? entry(...args) : entry;
}

const state = {
  prompts: [],
  scope: "all",            // all | favorites | recent
  category: null,          // string | null
  query: "",
  sort: "updated",         // updated | uses | title
  selectedId: null,
  editingId: null,         // null => creating, string => editing
};

/* ── Utilities ─────────────────────────────────────────────── */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function uid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "p-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function now() { return Date.now(); }
function activityOf(p) { return p.lastUsed || p.updated || p.created || 0; }
const uncategorised = () => t("uncategorised");

/* ── Starter pack ──────────────────────────────────────────── */

const SEED_PROMPTS = {
  en: [
    {
      title: "Precise code review",
      category: "Coding",
      tags: ["review", "quality"],
      favorite: true,
      uses: 14,
      body:
`You are a meticulous senior engineer reviewing a pull request.

Review the diff for:
1. Correctness bugs and edge cases (off-by-one, null, overflow, races)
2. Security issues (injection, authz, secrets, unsafe deserialization)
3. Error handling: swallowed errors, missing retries, unhelpful messages
4. API design: naming, defaults, backwards compatibility
5. Tests: missing cases, brittle assertions, flaky patterns

Rules:
- Report issues as a numbered list: severity (P0–P3), file:line, why it matters, concrete fix.
- Do not rewrite the whole file. Prefer the smallest correct change.
- If something is only a style nit, label it NIT and keep it short.
- If the change is good, say so and stop.`,
    },
    {
      title: "Root-cause a failing test",
      category: "Coding",
      tags: ["debug", "tests"],
      favorite: false,
      uses: 9,
      body:
`A test is failing. Work the problem in order:

1. Reproduce the failure deterministically. Show me the exact command and output.
2. Identify whether the failure is in the test, the code, or the environment.
   - Consider: shared state between tests, timing, locale/timezone, filesystem, network.
3. Form two competing hypotheses about the root cause. Rate each 0–100% likelihood.
4. Design the cheapest experiment that distinguishes them. Run it.
5. Fix the underlying cause, not the symptom. Do not delete or weaken the test to make it pass.
6. Confirm with a clean run and explain the mechanism of the bug in 3 sentences.`,
    },
    {
      title: "Explain like a systems engineer",
      category: "Analysis",
      tags: ["explanation", "learning"],
      favorite: true,
      uses: 21,
      body:
`Explain the following concept to me as if I am a competent engineer who has never touched it.

Structure:
- What problem it solves (the pain before it existed)
- How it works, with one concrete end-to-end example
- The invariants it maintains
- The trade-offs and where it breaks down
- What I should read next (primary sources, not listicles)

Avoid analogies that hide the mechanics. Define every acronym on first use.`,
    },
    {
      title: "Adversarial spec review",
      category: "Writing",
      tags: ["spec", "planning"],
      favorite: false,
      uses: 6,
      body:
`You are reviewing a product/engineering spec. Be adversarial but specific.

Find:
- Ambiguities: any sentence where two competent readers would build different things
- Missing failure modes: timeouts, partial writes, empty input, permission denied, retries
- Unstated assumptions about scale, latency, and data shape
- Success criteria that are unmeasurable

Output:
1. A numbered list of findings, each with: the exact quote, why it's a problem, proposed rewrite.
2. Three questions the author must answer before this is buildable.
3. A verdict: BUILDABLE / NEEDS REVISION / STOP.`,
    },
    {
      title: "Structured decision memo",
      category: "Analysis",
      tags: ["decisions", "ops"],
      favorite: true,
      uses: 12,
      body:
`Write a decision memo for the choice below.

Format:
- Context (2 sentences max)
- Options considered (max 4), each with cost, risk, reversibility
- Recommendation (one option, stated plainly)
- What would make us change our mind (tripwires)
- Explicitly list what we are NOT doing and why

Be opinionated. A memo that lists trade-offs without a recommendation is a shrug, not a memo.
Total length: under 400 words.`,
    },
    {
      title: "Serious test coverage plan",
      category: "Coding",
      tags: ["tests", "planning"],
      favorite: false,
      uses: 7,
      body:
`Given this module, produce a test plan.

For each behavior:
- Happy path
- Boundary conditions (empty, one, max, just over max)
- Invalid input and the expected error type/message
- Concurrency or ordering assumptions, if any
- What must be mocked and what must not (no mocking the thing under test)

Rank the tests by failure-risk-per-test so I know what to write first.
Call out any property that would be better verified by property-based testing.`,
    },
    {
      title: "Agent task briefing",
      category: "Agents",
      tags: ["agents", "delegation"],
      favorite: true,
      uses: 17,
      body:
`You are briefing a coding sub-agent on a task. Write the briefing.

Include:
- Objective in one sentence (what "done" looks like, not what to do)
- Hard constraints (files it may not touch, no new dependencies, must keep tests green)
- Context it needs but cannot see (why this exists, what was tried and failed)
- Deliverable format (patch? file? summary?)
- Explicit stop conditions: when to ask, when to stop, when to give up

Assume the agent is smart, fast, and literal. Ambiguity will be resolved in the cheapest way, which is usually wrong.`,
    },
    {
      title: "Weekly review, engineer edition",
      category: "Ops",
      tags: ["review", "habits"],
      favorite: false,
      uses: 4,
      body:
`Run me through a 20-minute weekly review.

Ask me, one block at a time:
1. What actually shipped this week (merged, deployed, documented)?
2. What was started but not finished? Is it blocked, or just not prioritized?
3. What did I learn that is not in a commit message?
4. What is silently rotting (flaky tests, stale docs, un-triaged alerts)?
5. One thing to kill, one thing to double down on.

Finish with a 3-line retro: keep / stop / start. No platitudes.`,
    },
    {
      title: "Unblock a vague request",
      category: "Writing",
      tags: ["clarity", "comms"],
      favorite: false,
      uses: 11,
      body:
`I received a vague request. Help me turn it into a buildable task.

Given my brain dump below:
1. State the underlying goal in one sentence.
2. List the assumptions embedded in the request.
3. Write the 3 clarifying questions with the highest information gain.
4. Draft the spec that would be true if those questions were answered in the most likely way.
5. Flag what would genuinely change the design versus what is cosmetic.`,
    },
    {
      title: "Pipeline-grade prompt polish",
      category: "Agents",
      tags: ["agents", "prompts"],
      favorite: false,
      uses: 8,
      body:
`Take my rough prompt and rewrite it to be pipeline-grade.

Process:
1. Identify the task type: extraction, classification, generation, critique, transformation.
2. Make implicit constraints explicit (format, length, tone, forbidden moves).
3. Add a worked example if the task has any ambiguity at all.
4. Add failure handling: what to do when input is missing or contradictory.
5. Keep it under 300 words. Remove every sentence that does not change the output.
6. Show me a diff of rough → polished with a one-line rationale per change.`,
    },
    {
      title: "Post-incident review without blame",
      category: "Ops",
      tags: ["incidents", "postmortem"],
      favorite: true,
      uses: 5,
      body:
`Facilitate a blameless postmortem.

Pull from my notes:
- Timeline (Detect → Triage → Mitigate → Resolve), with timestamps or explicit unknowns
- What broke, in one mechanistic sentence
- Why existing safeguards did not catch it
- Contributing factors, grouped: people / process / technology / external

Output:
1. 3–5 corrective actions, each with owner, due date, and the failure class it prevents
2. Explicitly separate "we must fix this" from "we should but won't" — say which and why
3. One thing that went well and should be protected
No blame language. Systems fail, not people.`,
    },
  ],
  tr: [
    {
      title: "Titiz kod incelemesi",
      category: "Kodlama",
      tags: ["inceleme", "kalite"],
      favorite: true,
      uses: 14,
      body:
`Sen titiz bir kıdemli mühendissin ve bir pull request'i inceliyorsun.

Diff'i şu açılardan incele:
1. Doğruluk hataları ve uç durumlar (off-by-one, null, taşma, yarış koşulları)
2. Güvenlik sorunları (injection, yetkilendirme, sırlar, güvensiz deserileştirme)
3. Hata yönetimi: yutulan hatalar, eksik yeniden denemeler, işe yaramayan mesajlar
4. API tasarımı: isimlendirme, varsayılanlar, geriye dönük uyumluluk
5. Testler: eksik senaryolar, kırılgan assertion'lar, kararsız (flaky) örüntüler

Kurallar:
- Sorunları numaralı liste halinde bildir: önem (P0–P3), dosya:satır, neden önemli, somut çözüm.
- Dosyanın tamamını yeniden yazma. En küçük doğru değişikliği tercih et.
- Bir şey yalnızca stil tercihiyse NIT olarak etiketle ve kısa tut.
- Değişiklik iyiyse, iyi olduğunu söyle ve bitir.`,
    },
    {
      title: "Başarısız testin kök nedeni",
      category: "Kodlama",
      tags: ["hata-ayiklama", "testler"],
      favorite: false,
      uses: 9,
      body:
`Bir test başarısız oluyor. Sorunu sırayla ele al:

1. Hatalı davranışı deterministik şekilde üret. Bana tam komutu ve çıktısını göster.
2. Hatanın testte mi, kodda mı, ortamda mı olduğunu belirle.
   - Şunları düşün: testler arası paylaşılan durum, zamanlama, yerel/timezone, dosya sistemi, ağ.
3. Kök nedene dair birbiriyle yarışan iki hipotez oluştur. Her birine 0–100% olasılık ver.
4. İkisini ayırt edecek en ucuz deneyi tasarla. Çalıştır.
5. Belirtiyi değil, altta yatan nedeni düzelt. Testi silme veya zayıflatma.
6. Temiz bir çalıştırmayla doğrula ve hatanın mekanizmasını 3 cümleyle açıkla.`,
    },
    {
      title: "Sistem mühendisi gibi açıkla",
      category: "Analiz",
      tags: ["açıklama", "öğrenme"],
      favorite: true,
      uses: 21,
      body:
`Aşağıdaki kavramı, konuya hiç dokunmamış ama işini bilen bir mühendisi karşıma alıyormuş gibi açıkla.

Yapı:
- Hangi problemi çözüyor (o olmadan önceki sancı)
- Nasıl çalışıyor — uçtan uca tek somut örnekle
- Hangi değişmezleri (invariant) koruyor
- Denge noktaları ve nerede bozulduğu
- Sonra ne okumalıyım (birincil kaynaklar, listicle'lar değil)

Mekaniği gizleyen analojilerden kaçın. Her kısaltmayı ilk geçtiği yerde aç.`,
    },
    {
      title: "Çekişmeli spec incelemesi",
      category: "Yazım",
      tags: ["spec", "planlama"],
      favorite: false,
      uses: 6,
      body:
`Bir ürün/mühendislik spec'ini inceliyorsun. Çekişmeli ama somut ol.

Bul:
- Belirsizlikler: iki yetkin okuyucunun farklı şeyler inşa edeceği her cümle
- Eksik hata modları: zaman aşımı, kısmi yazma, boş girdi, izin reddi, yeniden denemeler
- Ölçek, gecikme ve veri biçimi hakkında söylenmemiş varsayımlar
- Ölçülemeyen başarı kriterleri

Çıktı:
1. Numaralı bulgu listesi; her biri: tam alıntı, neden sorun olduğu, önerilen yeniden yazım.
2. Yazarın buildable olması için cevaplaması gereken 3 soru.
3. Karar: BUILDABLE / NEEDS REVISION / STOP.`,
    },
    {
      title: "Yapılandırılmış karar notu",
      category: "Analiz",
      tags: ["kararlar", "operasyon"],
      favorite: true,
      uses: 12,
      body:
`Aşağıdaki tercih için bir karar notu (decision memo) yaz.

Biçim:
- Bağlam (en fazla 2 cümle)
- Değerlendirilen seçenekler (en fazla 4), her biri: maliyet, risk, geri alınabilirlik
- Öneri (tek seçenek, açıkça)
- Fikrimizi değiştirecek şeyler (tripwire'lar)
- Neyi YAPMADIKLARIMIZI ve nedenini açıkça listele

Görüşlü ol. Öneri içermeyen bir trade-off listesi memo değil, omuz silkmmedir.
Toplam uzunluk: 400 kelimenin altında.`,
    },
    {
      title: "Ciddi test kapsamı planı",
      category: "Kodlama",
      tags: ["testler", "planlama"],
      favorite: false,
      uses: 7,
      body:
`Verilen modül için bir test planı üret.

Her davranış için:
- Mutlu yol (happy path)
- Sınır koşulları (boş, bir, maks, maks+1)
- Geçersiz girdi ve beklenen hata türü/mesajı
- Varsa eşzamanlılık veya sıralama varsayımları
- Ne mock'lanmalı, ne mock'lanmamalı (test edilenin kendisi asla mock'lanmaz)

Testleri failure-risk-per-test'e göre sırala; hangisini önce yazacağımı bileyim.
Hangi özelliklerin property-based testing ile daha iyi doğrulanacağını belirt.`,
    },
    {
      title: "Ajan görev brifingi",
      category: "Ajanlar",
      tags: ["ajanlar", "delegasyon"],
      favorite: true,
      uses: 17,
      body:
`Bir kodlama alt-ajanını göreve hazırlıyorsun. Brifingi yaz.

İçermeli:
- Tek cümlelik hedef (ne yapılacağı değil, "bitti"nin ne demek olduğu)
- Sert kısıtlar (dokunamayacağı dosyalar, yeni bağımlılık yok, testler yeşil kalmalı)
- Göremeyeceği bağlam (neden bu var, ne denendi ve neden başarısız oldu)
- Teslimat biçimi (patch mi? dosya mı? özet mi?)
- Açık durma koşulları: ne zaman sormalı, ne zaman durmalı, ne zaman vazgeçmeli

Ajanın zeki, hızlı ve literal olduğunu varsay. Belirsizlik en ucuz şekilde çözülecek — bu genellikle yanlış olandır.`,
    },
    {
      title: "Haftalık değerlendirme, mühendis edisyonu",
      category: "Operasyon",
      tags: ["inceleme", "alışkanlıklar"],
      favorite: false,
      uses: 4,
      body:
`Beni 20 dakikalık bir haftalık değerlendirmeye sok.

Bana blok blok sor:
1. Bu hafta gerçekten ne teslim edildi (merge, deploy, dokümantasyon)?
2. Başlandı ama bitmedi ne var? Takıldı mı, ertelendi mi?
3. Commit mesajına girmeyen ne öğrendim?
4. Ne sessizce çürüyor (kararsız testler, bayat dokümanlar, triyaj edilmemiş alarmlar)?
5. Öldürülecek bir şey, iki katına çıkarılacak bir şey.

3 satırlık retro ile bitir: sürdür / kes / başla. Klişe yok.`,
    },
    {
      title: "Belirsiz isteği netleştirme",
      category: "Yazım",
      tags: ["açıklık", "iletişim"],
      favorite: false,
      uses: 11,
      body:
`Bana belirsiz bir istek geldi. Bunu buildable bir göreve dönüştürmeme yardım et.

Aşağıdaki beyin dökümüme dayanarak:
1. Alttaki hedefi tek cümleyle ifade et.
2. İsteğe gömülü varsayımları listele.
3. En yüksek bilgi kazanımına sahip 3 netleştirme sorusunu yaz.
4. Sorular en olası şekilde cevaplansaydı doğru olacak spec'i taslakla.
5. Tasarımı gerçekten değiştirecek olanları kozmetik olanlardan ayır.`,
    },
    {
      title: "Pipeline kalitesinde prompt cilalama",
      category: "Ajanlar",
      tags: ["ajanlar", "promptlar"],
      favorite: false,
      uses: 8,
      body:
`Dağınık prompt'umu al ve pipeline kalitesine getir.

Süreç:
1. Görev tipini belirle: çıkarım, sınıflandırma, üretim, eleştiri, dönüşüm.
2. Örtük kısıtları açık hale getir (biçim, uzunluk, ton, yasak hamleler).
3. Görevde en ufak bir belirsizlik varsa çalışılmış örnek ekle.
4. Hata yönetimi ekle: girdi eksik veya çelişkiliyse ne yapılacak.
5. 300 kelimenin altında tut. Çıktıyı değiştirmeyen her cümleyi çıkar.
6. Ham → cilalı farkını (diff) değişiklik başına tek satır gerekçeyle göster.`,
    },
    {
      title: "Suçlamasız olay sonrası değerlendirmesi",
      category: "Operasyon",
      tags: ["olaylar", "postmortem"],
      favorite: true,
      uses: 5,
      body:
`Suçlamasız bir postmortem kolaylaştır.

Notlarımdan çek:
- Zaman çizelgesi (Tespit → Triyaj → Müdahale → Çözüm), zaman damgalı veya açık bilinmeyenlerle
- Neyin bozulduğunu tek mekanik cümleyle
- Mevcut güvenlik önlemleri neden yakalamadı
- Katkıda bulunan faktörler, gruplu: insanlar / süreç / teknoloji / dış

Çıktı:
1. 3–5 düzeltici aksiyon; her biri: sahip, son tarih ve önlediği hata sınıfı
2. "Bunu mutlaka düzeltmeliyiz" ile "düzeltmeliyiz ama düzeltmeyeceğiz"i açıkça ayır — hangisi ve neden
3. İyi giden ve korunması gereken bir şey
Suçlama dili yok. Sistemler çöker, insanlar değil.`,
    },
    {
      title: "Difikato — sert konuşma metni",
      category: "Yazım",
      tags: ["turkce", "konuşma"],
      favorite: false,
      uses: 3,
      body:
`Sana bir fikir veriyorum. Bunu 90 saniyelik, sert ve akılda kalıcı bir konuşma metnine çevir.

Kurallar:
- Açılış 15 kelimeden uzun olmasın ve doğrudan konuya girsin.
- Her cümle tek fikir taşısın. Sıfat yığını yok.
- Bir somut hikaye veya örnek kullan, iki tane değil.
- Kapanışta tek bir net çağrı olsun.
- Türkçe, konuşma dili, argo abartısı yok.
Çıktı: sadece konuşma metni, açıklamasız.`,
    },
  ],
};

function seedIfNeeded() {
  if (localStorage.getItem(SEED_FLAG)) return;
  const lang = currentLang();
  const seed = SEED_PROMPTS[lang] || SEED_PROMPTS.tr;
  const ts = now();
  const seeded = seed.map((p, i) => ({
    id: uid(),
    title: p.title,
    category: p.category,
    tags: [...p.tags],
    body: p.body,
    favorite: !!p.favorite,
    uses: p.uses || 0,
    created: ts - (seed.length - i) * 86400000,
    updated: ts - (seed.length - i) * 43200000,
    lastUsed: p.uses ? ts - i * 21600000 : null,
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  localStorage.setItem(SEED_FLAG, "1");
}

/* ── Persistence ───────────────────────────────────────────── */

function loadPrompts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function savePrompts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prompts));
}

/* ── Derived views ─────────────────────────────────────────── */

function categoriesWithCounts() {
  const map = new Map();
  for (const p of state.prompts) {
    const c = (p.category || uncategorised()).trim() || uncategorised();
    map.set(c, (map.get(c) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function filteredPrompts() {
  const q = state.query.trim().toLowerCase();
  let items = state.prompts.filter((p) => {
    if (state.scope === "favorites" && !p.favorite) return false;
    if (state.scope === "recent" && !p.lastUsed) return false;
    if (state.category) {
      const c = (p.category || uncategorised()).trim() || uncategorised();
      if (c !== state.category) return false;
    }
    if (!q) return true;
    const hay = [p.title, p.category, (p.tags || []).join(" "), p.body].join(" ").toLowerCase();
    return q.split(/\s+/).every((tok) => hay.includes(tok));
  });

  const byActivity = (a, b) => activityOf(b) - activityOf(a);
  if (state.sort === "uses") items.sort((a, b) => (b.uses || 0) - (a.uses || 0) || byActivity(a, b));
  else if (state.sort === "title") items.sort((a, b) => a.title.localeCompare(b.title));
  else items.sort(byActivity);

  if (state.scope === "recent") items.sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0));
  return items;
}

/* ── Rendering ─────────────────────────────────────────────── */

function applyStaticI18n() {
  const lang = currentLang();
  document.documentElement.lang = lang;
  document.title = t("title");
  $('meta[name="description"]').setAttribute("content", t("metaDescription"));

  $$("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const value = t(key);
    if (typeof value === "string") el.innerHTML = value;
  });
  $$("[data-i18n-placeholder]").forEach((el) => el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder)));
  $$("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));

  $$(".lang-btn").forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
}

function renderCounts() {
  $("#countAll").textContent = state.prompts.length;
  $("#countFav").textContent = state.prompts.filter((p) => p.favorite).length;
  $("#countRecent").textContent = state.prompts.filter((p) => p.lastUsed).length;

  const totalCopies = state.prompts.reduce((sum, p) => sum + (p.uses || 0), 0);
  $("#statTotal").textContent = t("footerPrompts", state.prompts.length);
  $("#statFav").textContent = t("footerFavorites", state.prompts.filter((p) => p.favorite).length);
  $("#statCopies").textContent = t("footerCopies", totalCopies);
}

function renderCategories() {
  const list = $("#categoryList");
  const datalist = $("#categoryOptions");
  const cats = categoriesWithCounts();

  list.innerHTML = cats
    .map(([name, n]) => {
      const active = state.category === name ? " is-active" : "";
      return `<button class="chip${active}" type="button" role="listitem" data-category="${escapeHtml(name)}" aria-pressed="${state.category === name}"><span>${escapeHtml(name)}</span><span class="n">${n}</span></button>`;
    })
    .join("");

  datalist.innerHTML = cats.map(([name]) => `<option value="${escapeHtml(name)}"></option>`).join("");
}

function renderScopeNav() {
  $$(".nav-item").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.scope === state.scope);
  });
}

function renderList() {
  const items = filteredPrompts();
  const listEl = $("#cardList");
  const empty = $("#emptyState");
  const meta = $("#resultMeta");

  meta.textContent = t("promptsCount", items.length) +
    (state.category ? t("inCategory", state.category) : "") +
    (state.query ? t("matching", state.query.trim()) : "");

  if (items.length === 0) {
    listEl.innerHTML = "";
    empty.hidden = false;
    $("#emptyHint").textContent = state.query || state.category
      ? t("emptyHintFiltered")
      : t("emptyHintDefault");
    return;
  }
  empty.hidden = true;

  // Keep selection valid if it fell out of the filter.
  if (state.selectedId && !items.some((p) => p.id === state.selectedId)) {
    state.selectedId = null;
  }

  listEl.innerHTML = items
    .map((p) => {
      const selected = p.id === state.selectedId ? " is-selected" : "";
      const star = p.favorite
        ? `<svg class="card-fav" viewBox="0 0 24 24" aria-label="${escapeHtml(t("favorite"))}"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.8L12 17.3 6.7 19.6l1.1-5.8-4.3-4.1 5.9-.8L12 3.5z" fill="currentColor"/></svg>`
        : "";
      const tags = (p.tags || []).slice(0, 3).join(", ");
      return `<button class="card${selected}" type="button" data-id="${escapeHtml(p.id)}" aria-pressed="${p.id === state.selectedId}">
  <span class="card-top"><h3 class="card-title">${escapeHtml(p.title)}</h3>${star}</span>
  <p class="card-snippet">${escapeHtml(p.body)}</p>
  <span class="card-bottom"><span class="card-cat">${escapeHtml((p.category || uncategorised()).trim() || uncategorised())}</span><span class="card-tags">${escapeHtml(tags)}</span><span class="card-uses">×${p.uses || 0}</span></span>
</button>`;
    })
    .join("");
}

function renderReader() {
  const emptyEl = $("#readerEmpty");
  const bodyEl = $("#readerBody");
  const p = state.prompts.find((x) => x.id === state.selectedId);

  if (!p) {
    emptyEl.hidden = false;
    bodyEl.hidden = true;
    return;
  }
  emptyEl.hidden = true;
  bodyEl.hidden = false;

  $("#readerTitle").textContent = p.title;
  $("#readerText").textContent = p.body;
  $("#readerUses").textContent = t("copiedTimes", p.uses || 0);

  const tagsEl = $("#readerTags");
  const chips = [];
  chips.push(`<span class="tag category">${escapeHtml((p.category || uncategorised()).trim() || uncategorised())}</span>`);
  for (const t of p.tags || []) chips.push(`<span class="tag">#${escapeHtml(t)}</span>`);
  tagsEl.innerHTML = chips.join("");

  const favBtn = $("#readerFav");
  favBtn.classList.toggle("is-on", !!p.favorite);
  favBtn.setAttribute("aria-pressed", String(!!p.favorite));
}

function renderAll() {
  applyStaticI18n();
  renderCounts();
  renderCategories();
  renderScopeNav();
  renderList();
  renderReader();
}

/* ── Mutations ─────────────────────────────────────────────── */

function selectPrompt(id) {
  state.selectedId = id;
  renderList();
  renderReader();
  const card = $(`.card[data-id="${CSS.escape(id)}"]`);
  if (card) card.scrollIntoView({ block: "nearest" });
}

function toggleFavorite(id) {
  const p = state.prompts.find((x) => x.id === id);
  if (!p) return;
  p.favorite = !p.favorite;
  p.updated = now();
  savePrompts();
  renderAll();
  toast(p.favorite ? t("addedFavorite") : t("removedFavorite"));
}

async function copyPrompt(id) {
  const p = state.prompts.find((x) => x.id === id);
  if (!p) return;

  let ok = false;
  try {
    await navigator.clipboard.writeText(p.body);
    ok = true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = p.body;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    ta.remove();
  }

  p.uses = (p.uses || 0) + 1;
  p.lastUsed = now();
  savePrompts();
  renderAll();
  toast(ok ? t("copied") : t("copyBlocked"));
}

function deletePrompt(id) {
  const p = state.prompts.find((x) => x.id === id);
  if (!p) return;
  const ok = window.confirm(t("confirmDelete", p.title));
  if (!ok) return;
  state.prompts = state.prompts.filter((x) => x.id !== id);
  if (state.selectedId === id) state.selectedId = null;
  savePrompts();
  renderAll();
  toast(t("promptDeleted"));
}

function upsertPrompt(fields, editingId) {
  const ts = now();
  if (editingId) {
    const p = state.prompts.find((x) => x.id === editingId);
    if (!p) return null;
    Object.assign(p, fields, { updated: ts });
    savePrompts();
    state.selectedId = p.id;
    return p;
  }
  const p = {
    id: uid(),
    title: fields.title,
    category: fields.category,
    tags: fields.tags,
    body: fields.body,
    favorite: !!fields.favorite,
    uses: 0,
    created: ts,
    updated: ts,
    lastUsed: null,
  };
  state.prompts.unshift(p);
  savePrompts();
  state.selectedId = p.id;
  return p;
}

/* ── Editor modal ──────────────────────────────────────────── */

function openEditor(prompt) {
  state.editingId = prompt ? prompt.id : null;
  $("#editorHeading").textContent = prompt ? t("editorEdit") : t("editorNew");
  $("#fTitle").value = prompt ? prompt.title : "";
  $("#fCategory").value = prompt ? (prompt.category || "") : "";
  $("#fTags").value = prompt ? (prompt.tags || []).join(", ") : "";
  $("#fBody").value = prompt ? prompt.body : "";
  $("#fFavorite").checked = prompt ? !!prompt.favorite : false;
  $("#editorModal").hidden = false;
  requestAnimationFrame(() => $("#fTitle").focus());
}

function closeEditor() {
  $("#editorModal").hidden = true;
  state.editingId = null;
}

function handleEditorSubmit(event) {
  event.preventDefault();
  const title = $("#fTitle").value.trim();
  const body = $("#fBody").value.trim();
  if (!title || !body) return;

  const tags = $("#fTags").value
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 12);

  const fields = {
    title,
    body,
    category: $("#fCategory").value.trim() || uncategorised(),
    tags: [...new Set(tags)],
    favorite: $("#fFavorite").checked,
  };

  upsertPrompt(fields, state.editingId);
  closeEditor();
  renderAll();
  toast(t("promptSaved"));
}

/* ── Import / Export ───────────────────────────────────────── */

async function exportJSON() {
  const payload = {
    app: "sextant",
    version: 1,
    exportedAt: new Date().toISOString(),
    prompts: state.prompts,
  };
  const content = JSON.stringify(payload, null, 2);
  const filename = `sextant-backup-${new Date().toISOString().slice(0, 10)}.json`;

  const tauriInvoke = window.__TAURI__?.core?.invoke;
  if (typeof tauriInvoke === "function") {
    try {
      const path = await tauriInvoke("export_json", { content, filename });
      toast(t("backupSaved", path));
      return;
    } catch (err) {
      console.error("Tauri export failed, falling back to download:", err);
    }
  }

  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast(t("backupDownloaded"));
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      const incoming = Array.isArray(data) ? data : data.prompts;
      if (!Array.isArray(incoming)) throw new Error("No prompts array found");

      const existingIds = new Set(state.prompts.map((p) => p.id));
      let added = 0;
      for (const raw of incoming) {
        if (!raw || typeof raw.title !== "string" || typeof raw.body !== "string") continue;
        const id = raw.id && !existingIds.has(raw.id) ? raw.id : uid();
        existingIds.add(id);
        state.prompts.push({
          id,
          title: String(raw.title).slice(0, 200),
          category: String(raw.category || uncategorised()).slice(0, 60),
          tags: Array.isArray(raw.tags) ? raw.tags.map((t) => String(t).toLowerCase().slice(0, 40)).slice(0, 12) : [],
          body: String(raw.body),
          favorite: !!raw.favorite,
          uses: Number.isFinite(raw.uses) ? raw.uses : 0,
          created: Number.isFinite(raw.created) ? raw.created : now(),
          updated: Number.isFinite(raw.updated) ? raw.updated : now(),
          lastUsed: Number.isFinite(raw.lastUsed) ? raw.lastUsed : null,
        });
        added += 1;
      }
      savePrompts();
      renderAll();
      toast(added ? t("imported", added) : t("nothingToImport"));
    } catch (err) {
      console.error("Import failed:", err);
      toast(t("importFailed"));
    }
  };
  reader.readAsText(file);
}

/* ── Toast ─────────────────────────────────────────────────── */

let toastTimer = null;
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

/* ── Language ──────────────────────────────────────────────── */

function setLang(lang) {
  if (lang !== "tr" && lang !== "en") return;
  localStorage.setItem(LANG_KEY, lang);
  renderAll();
}

/* ── Events ────────────────────────────────────────────────── */

function wireEvents() {
  $("#btnNew").addEventListener("click", () => openEditor(null));
  $("#btnExport").addEventListener("click", exportJSON);
  $("#importFile").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) importJSON(file);
    e.target.value = "";
  });
  $$(".lang-btn").forEach((btn) => btn.addEventListener("click", () => setLang(btn.dataset.lang)));

  $$(".nav-item").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.scope = btn.dataset.scope;
      renderAll();
    })
  );

  $("#categoryList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-category]");
    if (!btn) return;
    const cat = btn.dataset.category;
    state.category = state.category === cat ? null : cat;
    renderAll();
  });

  $("#searchInput").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderList();
    renderReader();
  });

  $$(".seg").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.sort = btn.dataset.sort;
      $$(".seg").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderList();
    })
  );

  $("#cardList").addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) selectPrompt(card.dataset.id);
  });

  $("#emptyState").addEventListener("click", (e) => {
    if (e.target.closest('[data-action="new"]')) openEditor(null);
  });

  $("#readerFav").addEventListener("click", () => state.selectedId && toggleFavorite(state.selectedId));
  $("#btnCopy").addEventListener("click", () => state.selectedId && copyPrompt(state.selectedId));
  $("#btnEdit").addEventListener("click", () => {
    const p = state.prompts.find((x) => x.id === state.selectedId);
    if (p) openEditor(p);
  });
  $("#btnDelete").addEventListener("click", () => state.selectedId && deletePrompt(state.selectedId));

  $("#btnCloseEditor").addEventListener("click", closeEditor);
  $("#btnCancelEdit").addEventListener("click", closeEditor);
  $("#editorForm").addEventListener("submit", handleEditorSubmit);
  $("#editorModal").addEventListener("click", (e) => {
    if (e.target.id === "editorModal") closeEditor();
  });

  document.addEventListener("keydown", (e) => {
    const tag = (e.target.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable;

    if (e.key === "Escape") {
      if (!$("#editorModal").hidden) closeEditor();
      else if (document.activeElement === $("#searchInput")) $("#searchInput").blur();
      else state.selectedId && (state.selectedId = null, renderList(), renderReader());
      return;
    }
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === "/") { e.preventDefault(); $("#searchInput").focus(); }
    else if (e.key === "n" || e.key === "N") { e.preventDefault(); openEditor(null); }
    else if (e.key === "f" || e.key === "F") { if (state.selectedId) toggleFavorite(state.selectedId); }
    else if (e.key === "c" || e.key === "C") { if (state.selectedId) copyPrompt(state.selectedId); }
  });
}

/* ── Boot ──────────────────────────────────────────────────── */

function init() {
  seedIfNeeded();
  state.prompts = loadPrompts();
  wireEvents();
  renderAll();
  // Pre-select the most recently used prompt so the reader isn't empty.
  const first = [...state.prompts].sort((a, b) => activityOf(b) - activityOf(a))[0];
  if (first) { state.selectedId = first.id; renderList(); renderReader(); }
}

init();
