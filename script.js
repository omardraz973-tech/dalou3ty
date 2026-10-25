
const $ = (id) => document.getElementById(id);

// أسماء الصور والتعليقات — غيّر التعليقات براحتك
const captions = [
  "أحلى ذكرى ❤️",
  "ضحكتك اللي بحبها",
  "لحظة من عالمنا",
  "يوم مميز لينا",
  "تفصيلة مش بنساها",
  "أحلى صدفة",
  "وقت حلو سوا",
  "ضحكة من القلب",
  "ذكرى بحب أرجعلها",
  "حاجة صغيرة وغالية",
  "لحظتنا الحلوة",
  "إنتِ الحكاية"
];

const photos = captions.map((caption, i) => ({
  src: `assets/images/photo-${String(i + 1).padStart(2, "0")}.jpeg`,
  caption
}));

let currentPhoto = 0;
let lightboxIndex = 0;

// التنقل بين الشاشات
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.toggle("active", screen.id === id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function enterOurWorld() {
    showScreen("home");

    const audio = document.getElementById("ourSong");

    audio.play()
        .then(() => {
            console.log("الأغنية اشتغلت ❤️");
        })
        .catch((error) => {
            console.log("التشغيل التلقائي للصوت مرفوض:", error);
        });
}

$("enterButton").addEventListener("click", enterOurWorld);
$("enterTextButton").addEventListener("click", enterOurWorld);

$("openLetter").addEventListener("click", () => {
  showScreen("letterScreen");
});

$("backToHome").addEventListener("click", () => showScreen("home"));
$("backFromLetter").addEventListener("click", () => showScreen("home"));

// عنصر بديل يظهر لو الصورة مش موجودة
function makePlaceholder(index) {
  const div = document.createElement("div");
  div.className = "placeholder";

  const heart = document.createElement("span");
  heart.textContent = "♡";

  const title = document.createElement("strong");
  title.textContent = "صورتنا هنا";

  const number = document.createElement("small");
  number.textContent = `الصورة ${index + 1}`;

  div.append(heart, title, number);
  return div;
}

// إنشاء صورة مع بديل في حالة عدم وجود الملف
function makePhoto(index) {
  const photo = photos[index];
  const img = document.createElement("img");

  img.src = photo.src;
  img.alt = photo.caption;
  img.loading = "lazy";

  img.addEventListener("error", () => {
    if (img.parentElement) {
      img.replaceWith(makePlaceholder(index));
    }
  }, { once: true });

  return img;
}

// حيطة الذكريات: أول خمس صور
function renderMemoryWall() {
  const wall = $("memoryWall");
  wall.replaceChildren();

  photos.slice(0, 5).forEach((photo, index) => {
    const card = document.createElement("button");
    card.className = "polaroid";
    card.type = "button";
    card.setAttribute("aria-label", `افتحي ${photo.caption}`);

    card.append(makePhoto(index));

    const caption = document.createElement("p");
    caption.className = "caption";
    caption.textContent = photo.caption;

    card.append(caption);
    card.addEventListener("click", () => openLightbox(index));

    wall.append(card);
  });
}

// ألبوم الصور التفاعلي
function renderAlbum() {
  const frame = $("albumPhoto");
  frame.replaceChildren(makePhoto(currentPhoto));

  $("albumCaption").textContent = photos[currentPhoto].caption;

  $("albumCounter").textContent =
    `${String(currentPhoto + 1).padStart(2, "0")} / ` +
    `${String(photos.length).padStart(2, "0")}`;

  const dots = $("albumDots");
  dots.replaceChildren();

  photos.forEach((photo, index) => {
    const dot = document.createElement("button");
    dot.className = "dot";

    if (index === currentPhoto) {
      dot.classList.add("active");
    }

    dot.setAttribute("aria-label", `الصورة ${index + 1}`);

    dot.addEventListener("click", () => {
      currentPhoto = index;
      renderAlbum();
    });

    dots.append(dot);
  });
}

function movePhoto(direction) {
  currentPhoto =
    (currentPhoto + direction + photos.length) % photos.length;

  renderAlbum();
}

$("prevPhoto").addEventListener("click", () => movePhoto(-1));
$("nextPhoto").addEventListener("click", () => movePhoto(1));

$("albumPhoto").addEventListener("click", () => {
  openLightbox(currentPhoto);
});

// عرض الصورة بحجم كبير
function openLightbox(index) {
  lightboxIndex = index;
  renderLightbox();
  $("lightbox").classList.remove("hidden");
}

function renderLightbox() {
  const image = $("lightboxImage");
  image.src = photos[lightboxIndex].src;
  image.alt = photos[lightboxIndex].caption;

  $("lightboxCaption").textContent = photos[lightboxIndex].caption;
}

function closeLightbox() {
  $("lightbox").classList.add("hidden");
}

$("closeLightbox").addEventListener("click", closeLightbox);

$("lightbox").addEventListener("click", event => {
  if (event.target.id === "lightbox") {
    closeLightbox();
  }
});

$("lightPrev").addEventListener("click", () => {
  lightboxIndex =
    (lightboxIndex - 1 + photos.length) % photos.length;
  renderLightbox();
});

$("lightNext").addEventListener("click", () => {
  lightboxIndex = (lightboxIndex + 1) % photos.length;
  renderLightbox();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeLightbox();

  if (!$("lightbox").classList.contains("hidden")) {
    if (event.key === "ArrowLeft") {
      lightboxIndex = (lightboxIndex + 1) % photos.length;
      renderLightbox();
    }

    if (event.key === "ArrowRight") {
      lightboxIndex =
        (lightboxIndex - 1 + photos.length) % photos.length;
      renderLightbox();
    }
  }
});

// فتح الظرف والرسالة
$("openEnvelope").addEventListener("click", () => {
  const envelope = $("envelope");
  const button = $("openEnvelope");

  envelope.classList.add("open");
  button.disabled = true;
  button.textContent = "رسالة من قلبي ليكي...";

  setTimeout(() => {
    envelope.classList.add("hidden");
    $("openEnvelope").classList.add("hidden");
    $("letterPaper").classList.remove("hidden");
  }, 850);
});

// مشغل الأغنية
const audio = $("ourSong");
const playButton = $("playSong");

function toggleMusic() {
  if (audio.paused) {
    audio.play().catch(() => {
      $("audioHint").textContent =
        "مش قادر أشغل الأغنية. اتأكد إن ملف song.mp3 موجود.";
    });
  } else {
    audio.pause();
  }
}

playButton.addEventListener("click", toggleMusic);
$("topMusic").addEventListener("click", toggleMusic);

audio.addEventListener("play", () => {
  playButton.textContent = "Ⅱ";
  $("topMusic").textContent = "♫ الأغنية شغالة";
});

audio.addEventListener("pause", () => {
  playButton.textContent = "▶";
  $("topMusic").textContent = "♫ أغنيتنا";
});

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);

  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

audio.addEventListener("loadedmetadata", () => {
  $("duration").textContent = formatTime(audio.duration);
  $("audioHint").textContent = "اضغط تشغيل علشان تسمعوا أغنيتكم ❤️";
});

audio.addEventListener("timeupdate", () => {
  $("currentTime").textContent = formatTime(audio.currentTime);

  const progress = audio.duration
    ? (audio.currentTime / audio.duration) * 100
    : 0;

  $("progress").style.width = `${progress}%`;
});

audio.addEventListener("error", () => {
  $("audioHint").textContent =
    "ضيف ملف الأغنية باسم song.mp3 داخل assets/audio.";
});

// قلوب صغيرة متحركة في الخلفية
function addFloatingHeart() {
  const heart = document.createElement("span");

  heart.className = "float-heart";
  heart.textContent = Math.random() > 0.5 ? "♡" : "♥";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${12 + Math.random() * 15}px`;
  heart.style.animationDuration = `${8 + Math.random() * 7}s`;

  $("floatingHearts").append(heart);

  setTimeout(() => heart.remove(), 16000);
}

// تجهيز الموقع عند الفتح
renderMemoryWall();
renderAlbum();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  for (let i = 0; i < 5; i++) {
    setTimeout(addFloatingHeart, i * 900);
  }

  setInterval(addFloatingHeart, 2400);
}
