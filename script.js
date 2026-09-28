// ==========================================
// 0. ANIMASI LOADING "I LOVE YOU" MEMBENTUK HATI
// ==========================================
(function () {
    const PARTICLE_COUNT = 80;
    const LOVE_TEXTS = ['I love you', 'i love u', 'love', 'ily', '♡', 'luv u', 'sayang', 'cinta'];

    // Parametric heart shape formula
    function heartX(t) {
        return 16 * Math.pow(Math.sin(t), 3);
    }
    function heartY(t) {
        return -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    }

    function mulaiAnimasiLoading() {
        const container = document.getElementById('love-particles-container');
        const loadingScreen = document.getElementById('love-loading-screen');
        const tapText = document.getElementById('loading-tap-text');
        if (!container || !loadingScreen) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const centerX = vw / 2;
        const centerY = vh / 2;
        const scale = Math.min(vw, vh) * 0.018;

        const particles = [];

        // Generate heart shape target positions (relative to center)
        const heartPoints = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const t = (i / PARTICLE_COUNT) * Math.PI * 2;
            heartPoints.push({
                x: heartX(t) * scale,
                y: heartY(t) * scale - 20
            });
        }

        // Build all particles in a document fragment (single DOM insert)
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const el = document.createElement('span');
            el.classList.add('love-particle');
            el.textContent = LOVE_TEXTS[Math.floor(Math.random() * LOVE_TEXTS.length)];

            const fontSize = 8 + Math.random() * 6;
            el.style.fontSize = fontSize + 'px';

            // All particles start at center, use transform for positioning
            el.style.left = centerX + 'px';
            el.style.top = centerY + 'px';

            // Scatter offset from center (bottom area)
            const scatterX = -centerX + Math.random() * vw;
            const scatterY = vh * 0.1 + Math.random() * vh * 0.4;
            const rotation = -30 + Math.random() * 60;

            // Random color
            const colors = [
                'rgba(255, 182, 193, 0.9)',
                'rgba(255, 150, 180, 0.85)',
                'rgba(255, 200, 220, 0.8)',
                'rgba(220, 160, 255, 0.7)',
                'rgba(255, 255, 255, 0.6)',
                'rgba(255, 130, 170, 0.9)'
            ];
            el.style.color = colors[Math.floor(Math.random() * colors.length)];

            fragment.appendChild(el);
            particles.push({
                el: el,
                scatterX: scatterX,
                scatterY: scatterY,
                rotation: rotation,
                heartX: heartPoints[i].x,
                heartY: heartPoints[i].y
            });
        }

        container.appendChild(fragment);

        // Phase 1: Show scattered particles with staggered fade-in
        requestAnimationFrame(() => {
            particles.forEach((p, i) => {
                setTimeout(() => {
                    p.el.style.transform = 'translate(' + p.scatterX + 'px, ' + p.scatterY + 'px) rotate(' + p.rotation + 'deg)';
                    p.el.classList.add('scattered');
                }, 50 + i * 12);
            });
        });

        // Phase 2: Float particles upward slightly (1.5s)
        setTimeout(() => {
            particles.forEach(p => {
                const driftX = p.scatterX + (-40 + Math.random() * 80);
                const driftY = p.scatterY - (20 + Math.random() * 60);
                p.el.style.transform = 'translate(' + driftX + 'px, ' + driftY + 'px) rotate(' + (p.rotation * 0.5) + 'deg)';
            });
        }, 1500);

        // Phase 3: Form the heart shape (3s)
        setTimeout(() => {
            particles.forEach((p, i) => {
                const staggerDelay = (i / PARTICLE_COUNT) * 1000;
                p.el.style.transitionDuration = '2.5s';
                p.el.style.transitionDelay = staggerDelay + 'ms';

                setTimeout(() => {
                    p.el.style.transform = 'translate(' + p.heartX + 'px, ' + p.heartY + 'px) rotate(0deg) scale(1)';
                    p.el.classList.remove('scattered');
                    p.el.classList.add('formed');
                }, 30);
            });
        }, 3000);

        // Phase 4: Add glow pulse & sparkles after heart is formed (6.5s)
        setTimeout(() => {
            particles.forEach((p, i) => {
                p.el.classList.add('glow-pulse');
            });

            buatSparkles(container, heartPoints, centerX, centerY);
            if (tapText) tapText.classList.add('show');
        }, 6500);

        // Click/tap to dismiss with planet transition
        let bisaDismiss = false;
        setTimeout(() => { bisaDismiss = true; }, 6000);
        loadingScreen.addEventListener('click', function () {
            if (!bisaDismiss) return;
            bisaDismiss = false;

            if (tapText) tapText.classList.remove('show');

            // Phase A: SUCK particles into the center
            particles.forEach((p) => {
                p.el.style.transitionDuration = '0.8s';
                p.el.style.transitionDelay = (Math.random() * 150) + 'ms';
                p.el.style.transitionTimingFunction = 'cubic-bezier(0.5, 0, 1, 0.5)';
                p.el.style.transform = 'translate(0px, 0px) scale(0) rotate(180deg)';
                p.el.style.opacity = '0';
            });

            // Phase B: Fade out screen
            setTimeout(() => {
                loadingScreen.style.transition = 'opacity 1s ease';
                loadingScreen.style.opacity = '0';
            }, 800);

            // Phase C: Show PIN screen instead of landing page
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                const pinScreen = document.getElementById('pin-screen');
                if (pinScreen) {
                    pinScreen.style.display = 'flex';
                    // Delay sedikit agar transisi CSS jalan
                    setTimeout(() => {
                        pinScreen.classList.add('active');
                    }, 50);
                }
            }, 1800);
        });

        // ==========================================
        // PIN VALIDATION LOGIC (Pop-Up Notifikasi)
        // ==========================================
        const pinInput = document.getElementById('pin-input');
        const pinPopupOverlay = document.getElementById('pin-popup-overlay');
        const pinPopupBox = document.getElementById('pin-popup-box');
        const pinPopupImg = document.getElementById('pin-popup-img');
        const pinPopupEmoji = document.getElementById('pin-popup-emoji');
        const pinPopupMsg = document.getElementById('pin-popup-msg');
        const pinPopupClose = document.getElementById('pin-popup-close');

        // DEFAULT PIN: Silakan ubah angka ini jika ingin PIN lain
        const SECRET_PIN = "0410";

        let pinAttempt = 0;
        let popupTimeout = null;

        // Konfigurasi pesan & tampilan setiap percobaan salah
        const wrongConfigs = [
            {
                // Percobaan pertama: tampilkan foto kucing
                showCat: true,
                emoji: '',
                message: 'How could you forget our special date?',
                buttonText: 'I’m sorry.. 😭'
            },
            {
                // Percobaan kedua: foto kucing marah
                showCat: true,
                catSrc: 'img/cat-angry.png',
                emoji: '',
                message: 'Seriously, you forgot?!!\nAlright, let’s try again.',
                buttonText: 'Once Again, Please!'
            },
            {
                // Percobaan ketiga+: foto kucing thumbs up
                showCat: true,
                catSrc: 'img/cat-thumbsup.png',
                emoji: '',
                message: 'If you still get it wrong,\nthat’s just too much.',
                buttonText: 'I’m sorry..😭'
            }
        ];

        function showPinPopup(config, isSuccess) {
            // Bersihkan timeout sebelumnya
            if (popupTimeout) clearTimeout(popupTimeout);

            // Reset semua state
            pinPopupBox.classList.remove('popup-success', 'shake-popup');
            pinPopupImg.classList.remove('wiggle-cat', 'hidden-img');
            pinPopupEmoji.classList.remove('show-emoji');
            pinPopupEmoji.textContent = '';

            if (isSuccess) {
                // Tampilan sukses — pakai foto kucing senang
                pinPopupImg.src = 'img/cat-success.png';
                pinPopupImg.classList.remove('hidden-img');
                pinPopupBox.classList.add('popup-success');
                pinPopupMsg.textContent = config.message;
                pinPopupClose.textContent = config.buttonText;
                setTimeout(() => {
                    pinPopupImg.classList.add('wiggle-cat');
                }, 400);
            } else {
                // Tampilan salah
                if (config.showCat) {
                    // Tampilkan gambar kucing + animasi wiggle
                    pinPopupImg.src = config.catSrc || 'img/cat-warning.png';
                    pinPopupImg.classList.remove('hidden-img');
                    setTimeout(() => {
                        pinPopupImg.classList.add('wiggle-cat');
                    }, 400);
                } else {
                    // Sembunyikan gambar, tampilkan emoji
                    pinPopupImg.classList.add('hidden-img');
                    pinPopupEmoji.textContent = config.emoji;
                    pinPopupEmoji.classList.add('show-emoji');
                    // Tambah padding atas karena tidak ada gambar yang menonjol
                    pinPopupBox.style.paddingTop = '30px';
                }

                pinPopupMsg.textContent = config.message;
                pinPopupClose.textContent = config.buttonText;

                // Shake animation setelah muncul
                setTimeout(() => {
                    pinPopupBox.classList.add('shake-popup');
                }, 500);
            }

            // Tampilkan pop-up
            pinPopupOverlay.classList.add('show-popup');
        }

        function closePinPopup() {
            pinPopupOverlay.classList.remove('show-popup');
            if (popupTimeout) clearTimeout(popupTimeout);
            // Reset padding
            pinPopupBox.style.paddingTop = '';
        }

        // Event listener untuk tombol tutup
        if (pinPopupClose) {
            pinPopupClose.addEventListener('click', closePinPopup);
        }

        // Tutup pop-up dengan klik overlay (di luar box)
        if (pinPopupOverlay) {
            pinPopupOverlay.addEventListener('click', function (e) {
                if (e.target === pinPopupOverlay) {
                    closePinPopup();
                }
            });
        }

        if (pinInput) {
            pinInput.addEventListener('input', function () {
                if (pinInput.value.length === 4) {
                    // Delay sedikit agar digit terakhir terasa diketik
                    setTimeout(() => {
                        if (pinInput.value === SECRET_PIN) {
                            // PIN BENAR
                            showPinPopup({
                                message: 'Valid!\nLet’s continue, babe~',
                                buttonText: 'Continue 💕'
                            }, true);

                            // Auto-close dan lanjut setelah 2 detik
                            popupTimeout = setTimeout(() => {
                                closePinPopup();
                                setTimeout(() => {
                                    const pinScreen = document.getElementById('pin-screen');
                                    pinScreen.classList.remove('active');

                                    setTimeout(() => {
                                        pinScreen.style.display = 'none';
                                        // Show mini game instead of landing page
                                        const miniGameScreen = document.getElementById('mini-game-screen');
                                        if (miniGameScreen) {
                                            miniGameScreen.style.display = 'flex';
                                            setTimeout(() => miniGameScreen.classList.add('active'), 50);
                                            initMiniGame();
                                        }
                                    }, 1000);
                                }, 300);
                            }, 2000);

                            // Juga lanjut saat tombol diklik
                            pinPopupClose.onclick = function () {
                                closePinPopup();
                                setTimeout(() => {
                                    const pinScreen = document.getElementById('pin-screen');
                                    pinScreen.classList.remove('active');

                                    setTimeout(() => {
                                        pinScreen.style.display = 'none';
                                        const miniGameScreen = document.getElementById('mini-game-screen');
                                        if (miniGameScreen) {
                                            miniGameScreen.style.display = 'flex';
                                            setTimeout(() => miniGameScreen.classList.add('active'), 50);
                                            initMiniGame();
                                        }
                                    }, 1000);
                                }, 300);
                            };
                        } else {
                            // PIN SALAH
                            const configIndex = Math.min(pinAttempt, wrongConfigs.length - 1);
                            showPinPopup(wrongConfigs[configIndex], false);
                            pinAttempt++;

                            pinInput.classList.add('shake-animation');
                            setTimeout(() => pinInput.classList.remove('shake-animation'), 400);
                            pinInput.value = '';

                            // Reset tombol close ke default
                            pinPopupClose.onclick = closePinPopup;
                        }
                    }, 150);
                }
            });
        }
    }

    function buatSparkles(container, heartPoints, centerX, centerY) {
        const sparkleInterval = setInterval(() => {
            const sparkle = document.createElement('div');
            sparkle.classList.add('heart-sparkle');

            const randomPoint = heartPoints[Math.floor(Math.random() * heartPoints.length)];
            const offsetX = -15 + Math.random() * 30;
            const offsetY = -15 + Math.random() * 30;

            sparkle.style.left = (centerX + randomPoint.x + offsetX) + 'px';
            sparkle.style.top = (centerY + randomPoint.y + offsetY) + 'px';
            sparkle.style.animation = 'sparkleFloat ' + (1.5 + Math.random() * 1.5) + 's ease-out forwards';

            container.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 3000);
        }, 400);

        document.getElementById('love-loading-screen').addEventListener('click', () => {
            clearInterval(sparkleInterval);
        }, { once: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mulaiAnimasiLoading);
    } else {
        mulaiAnimasiLoading();
    }
})();

// ==========================================
// 1. FUNGSI FOTO MEMBESAR (LIGHTBOX) & PEMUTAR MUSIK
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const daftarFoto = document.querySelectorAll('.gallery-scroll img, .polaroid, .planet-card');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalIframe = document.getElementById('modal-iframe'); // Panggil elemen iframe
    const modalCaption = document.getElementById('modal-caption');

    if (daftarFoto.length > 0 && modal && modalImg) {
        daftarFoto.forEach(foto => {
            foto.addEventListener('click', function () {

                // Reset layar setiap kali diklik
                if (modalCaption) modalCaption.innerText = "";
                modalImg.style.display = 'block'; // Tampilkan foto sebagai default
                modalIframe.style.display = 'none'; // Sembunyikan musik sebagai default
                modalIframe.src = ""; // Kosongkan lagu sebelumnya

                // A. JIKA YANG DIKLIK ADALAH KARTU LAGU/VIDEO (Punya data-embed)
                if (this.classList.contains('planet-card') && this.hasAttribute('data-embed')) {
                    modalImg.style.display = 'none'; // Sembunyikan foto
                    modalIframe.style.display = 'block'; // Tampilkan alat musik/video

                    const embedUrl = this.getAttribute('data-embed');
                    modalIframe.src = embedUrl; // Masukkan link

                    // Hapus class lama
                    modalIframe.classList.remove('iframe-spotify', 'iframe-youtube', 'iframe-facebook');

                    // Deteksi platform untuk penyesuaian rasio (16:9 untuk YouTube, Kotak untuk Spotify, 9:16 untuk Facebook)
                    if (embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be')) {
                        modalIframe.classList.add('iframe-youtube');
                    } else if (embedUrl.includes('spotify.com')) {
                        modalIframe.classList.add('iframe-spotify');
                    } else if (embedUrl.includes('facebook.com')) {
                        modalIframe.classList.add('iframe-facebook');
                    }

                    const customCaption = this.getAttribute('data-caption');
                    const teksCaption = customCaption ? customCaption : this.querySelector('.planet-caption').innerText;
                    if (modalCaption) modalCaption.innerText = teksCaption;
                }
                // B. JIKA YANG DIKLIK ADALAH KARTU 3D BIASA (Bukan Lagu)
                else if (this.classList.contains('planet-card')) {
                    modalImg.src = this.querySelector('img').src;
                    modalImg.style.aspectRatio = "3 / 4";

                    const customCaption = this.getAttribute('data-caption');
                    const teksCaption = customCaption ? customCaption : this.querySelector('.planet-caption').innerText;
                    if (modalCaption) modalCaption.innerText = teksCaption;
                }
                // C. JIKA YANG DIKLIK ADALAH POLAROID
                else if (this.classList.contains('polaroid')) {
                    modalImg.src = this.querySelector('img').src;
                    modalImg.style.aspectRatio = "1 / 1";
                }
                // D. JIKA YANG DIKLIK ADALAH GALERI CINTA
                else {
                    modalImg.src = this.src;
                    modalImg.style.aspectRatio = "9 / 16";
                }

                modal.classList.add('show-modal');
            });
        });
    }

    const semuaTeksKetikan = document.querySelectorAll('.typing-text');
    semuaTeksKetikan.forEach(el => {
        el.setAttribute('data-teks', el.innerHTML);
        el.innerHTML = '';
    });
});

// Fungsi Menutup Layar & Mematikan Lagu
function tutupModal() {
    const modal = document.getElementById('image-modal');
    const modalIframe = document.getElementById('modal-iframe');

    if (modal) {
        modal.classList.remove('show-modal');
        // KUNCI PENTING: Mengosongkan src agar lagu berhenti berputar saat ditutup
        if (modalIframe) {
            modalIframe.src = "";
        }
    }
}

// ==========================================
// 2. FUNGSI KADO & PEMUTAR MUSIK LATAR
// ==========================================
function bukaKado() {
    buatHujanBunga();

    const flash = document.getElementById('flash-light');
    if (flash) flash.classList.add('flash-active');

    // --- MULAI MUSIK & MUNCULKAN POP-UP ---
    const bgMusic = document.getElementById('bg-music');
    const musicPopup = document.getElementById('music-popup');

    // Putar musiknya
    if (bgMusic) {
        bgMusic.play().catch(error => {
            console.log("Browser memblokir autoplay, tidak masalah.");
        });
    }

    // Munculkan notifikasi pop-up dari bawah layar
    if (musicPopup) {
        setTimeout(() => {
            musicPopup.classList.add('show-music');
        }, 1000);
    }
    // --------------------------------------

    setTimeout(() => {
        const landingPage = document.getElementById('landing-page');
        const mainContent = document.getElementById('main-content');

        if (landingPage) landingPage.style.display = 'none';
        if (mainContent) mainContent.classList.remove('hidden');

        jalankanAnimasiScroll();
    }, 450);
}

function buatHujanBunga() {
    const container = document.getElementById('flower-rain');
    if (!container) return;

    const bungaPilihan = ['🌸', '🌺', '🌷', '✨', '💖'];

    for (let i = 0; i < 40; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        petal.innerText = bungaPilihan[Math.floor(Math.random() * bungaPilihan.length)];
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
        petal.style.animationDelay = (Math.random() * 1) + 's';

        container.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, 6000);
    }
}

// ==========================================
// 3. FUNGSI SENSOR SCROLL & MESIN TIK BERURUTAN
// ==========================================
function jalankanAnimasiScroll() {
    const elemenScroll = document.querySelectorAll('.show-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (!entry.target.classList.contains('is-visible')) {
                    entry.target.classList.add('is-visible');
                    mulaiKetikanBerurutan(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -35% 0px"
    });

    elemenScroll.forEach((el) => observer.observe(el));
}

async function mulaiKetikanBerurutan(slideTarget) {
    const teksKetikan = slideTarget.querySelectorAll('.typing-text');

    await new Promise(resolve => setTimeout(resolve, 3500));

    for (let i = 0; i < teksKetikan.length; i++) {
        const el = teksKetikan[i];
        const teksAsli = el.getAttribute('data-teks');

        if (teksAsli) {
            await ketikTeks(el, teksAsli);
            await new Promise(resolve => setTimeout(resolve, 400));
        }
    }
}

function ketikTeks(elemen, teks) {
    return new Promise(resolve => {
        let index = 0;
        elemen.innerHTML = '';

        function ketik() {
            if (index < teks.length) {
                elemen.innerHTML += teks.charAt(index);
                index++;
                setTimeout(ketik, 35);
            } else {
                elemen.classList.add('typing-done');
                resolve();
            }
        }

        ketik();
    });
}

// ==========================================
// 4. FUNGSI TOGGLE PLAY/PAUSE MUSIK (SPOTIFY STYLE)
// ==========================================
function toggleMusic() {
    const bgMusic = document.getElementById('bg-music');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');

    if (!bgMusic) return;

    if (bgMusic.paused) {
        bgMusic.play().catch(console.error);
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
    } else {
        bgMusic.pause();
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
    }
}

// ==========================================
// 5. FUNGSI MENYEMBUNYIKAN POP-UP MUSIK SAAT SCROLL
// ==========================================
function hideMusicPopup() {
    const musicPopup = document.getElementById('music-popup');
    const showMusicBtn = document.getElementById('show-music-btn');
    if (musicPopup) {
        musicPopup.classList.remove('show-music');
    }
    if (showMusicBtn) {
        showMusicBtn.classList.add('show-btn');
    }
}

function showMusicPopup() {
    const musicPopup = document.getElementById('music-popup');
    const showMusicBtn = document.getElementById('show-music-btn');
    if (musicPopup) {
        musicPopup.classList.add('show-music');
    }
    if (showMusicBtn) {
        showMusicBtn.classList.remove('show-btn');
    }
}

// Auto-hide pop-up musik saat user mulai scroll
(function () {
    let sudahDisembunyikan = false;

    window.addEventListener('scroll', function () {
        const musicPopup = document.getElementById('music-popup');

        // Hanya sembunyikan jika pop-up sedang tampil dan belum pernah disembunyikan oleh scroll
        if (!sudahDisembunyikan && musicPopup && musicPopup.classList.contains('show-music')) {
            hideMusicPopup();
            sudahDisembunyikan = true;
        }
    });

    // Reset flag saat pop-up ditampilkan kembali lewat tombol 🎵
    const originalShowMusicPopup = showMusicPopup;
    showMusicPopup = function () {
        sudahDisembunyikan = false;
        originalShowMusicPopup();
    };
    // Pasang ulang ke window agar onclick di HTML tetap berfungsi
    window.showMusicPopup = showMusicPopup;
})();

// ==========================================
// SCRATCH CARD (ERASER EFFECT) + GALLERY UNLOCK LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const canvases = document.querySelectorAll('.scratch-canvas');
    const galleryScroll = document.querySelector('.gallery-scroll');
    const galleryHint = document.getElementById('gallery-hint');
    const gallerySlider = document.getElementById('gallery-slider');
    const gallerySliderThumb = document.getElementById('gallery-slider-thumb');

    const totalCanvases = canvases.length;
    const clearedSet = new Set();
    let galleryUnlocked = false;

    function updateSlider() {
        if (!gallerySliderThumb || !galleryScroll) return;
        const maxScroll = galleryScroll.scrollWidth - galleryScroll.clientWidth;
        if (maxScroll > 0) {
            const scrollPercent = galleryScroll.scrollLeft / maxScroll;
            const trackWidth = gallerySliderThumb.parentElement.clientWidth;
            const thumbWidth = gallerySliderThumb.clientWidth;
            const maxLeft = trackWidth - thumbWidth;
            gallerySliderThumb.style.left = (scrollPercent * maxLeft) + 'px';
        }
    }

    function scrollToCard(cardIndex) {
        if (!galleryScroll) return;
        const cards = galleryScroll.querySelectorAll('.scratch-card');
        if (cardIndex < cards.length) {
            const card = cards[cardIndex];
            // Hitung posisi scroll secara manual agar card berada di tengah container
            // Ini menghindari scrollIntoView yang bisa menggeser seluruh halaman di HP
            const containerWidth = galleryScroll.clientWidth;
            const cardLeft = card.offsetLeft;
            const cardWidth = card.offsetWidth;
            const targetScroll = cardLeft - (containerWidth / 2) + (cardWidth / 2);

            // Sementara aktifkan scroll agar bisa geser
            galleryScroll.style.overflowX = 'auto';
            galleryScroll.scrollTo({ left: targetScroll, behavior: 'smooth' });
            // Kunci lagi setelah scroll selesai
            setTimeout(() => {
                if (!galleryUnlocked) {
                    galleryScroll.style.overflowX = 'hidden';
                }
                updateSlider();
            }, 600);
        }
    }

    // Tampilkan slider dari awal
    if (gallerySlider) {
        gallerySlider.classList.add('slider-visible');
    }

    function checkCanvasCleared(canvas, index) {
        if (clearedSet.has(index)) return;

        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentCount = 0;
        let sampledCount = 0;

        for (let i = 3; i < pixels.length; i += 8) {
            sampledCount++;
            if (pixels[i] === 0) transparentCount++;
        }

        const ratio = transparentCount / sampledCount;
        if (ratio > 0.45) {
            clearedSet.add(index);
            // Fade out sisa canvas
            canvas.style.transition = 'opacity 0.5s ease';
            canvas.style.opacity = '0';
            setTimeout(() => {
                canvas.style.pointerEvents = 'none';
            }, 500);

            // Update hint
            if (galleryHint) {
                galleryHint.textContent = '✨ Pict ' + clearedSet.size + ' from ' + totalCanvases + ' opened ✨';
            }

            // Cek apakah semua sudah dibersihkan
            if (clearedSet.size >= totalCanvases) {
                // Semua selesai — unlock untuk geser bebas
                galleryUnlocked = true;
                if (galleryScroll) {
                    galleryScroll.classList.add('gallery-unlocked');
                    galleryScroll.style.overflowX = 'auto';
                    galleryScroll.style.touchAction = 'pan-x pan-y';
                    // Sync slider saat scroll bebas
                    galleryScroll.addEventListener('scroll', updateSlider);
                }
                if (galleryHint) {
                    galleryHint.textContent = 'All pics unlocked! Swipe through to see them all';
                    galleryHint.classList.add('hint-unlocked');
                }
            } else {
                // Auto-scroll ke foto berikutnya
                setTimeout(() => {
                    scrollToCard(index + 1);
                }, 700);
            }
        }
    }

    canvases.forEach((canvas, index) => {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let brushRadius = 25;
        let drawMoveCount = 0;

        setTimeout(() => {
            canvas.width = 220;
            canvas.height = Math.round(220 * 16 / 9);

            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < 200; i++) {
                ctx.beginPath();
                ctx.arc(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    Math.random() * 1.5,
                    0, Math.PI * 2
                );
                ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.8)' : 'rgba(255,182,193,0.8)';
                ctx.fill();
            }

            ctx.globalCompositeOperation = 'destination-out';

            const startPosition = (e) => {
                isDrawing = true;
                drawMoveCount = 0;
                draw(e);
            };

            const endPosition = () => {
                isDrawing = false;
                ctx.beginPath();
                // Cek setiap kali selesai menggosok
                checkCanvasCleared(canvas, index);
            };

            const draw = (e) => {
                if (!isDrawing) return;

                let clientX, clientY;
                if (e.type.includes('touch')) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }

                const canvasRect = canvas.getBoundingClientRect();
                // Scale koordinat dari ukuran tampilan CSS ke ukuran internal canvas
                const scaleX = canvas.width / canvasRect.width;
                const scaleY = canvas.height / canvasRect.height;
                const x = (clientX - canvasRect.left) * scaleX;
                const y = (clientY - canvasRect.top) * scaleY;

                ctx.lineWidth = brushRadius * 2;
                ctx.lineCap = 'round';
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x, y);

                // Juga cek selama menggosok setiap 15 gerakan
                drawMoveCount++;
                if (drawMoveCount % 15 === 0) {
                    checkCanvasCleared(canvas, index);
                }
            };

            canvas.addEventListener('mousedown', startPosition);
            canvas.addEventListener('mouseup', endPosition);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseleave', endPosition);

            canvas.addEventListener('touchstart', startPosition, { passive: true });
            canvas.addEventListener('touchend', endPosition);
            canvas.addEventListener('touchmove', (e) => {
                if (isDrawing) e.preventDefault();
                draw(e);
            }, { passive: false });

        }, 500);
    });
});

// ==========================================
// FITUR TIUP LILIN 🎂 (Press & Hold)
// ==========================================
let holdTime = 0;
let holdInterval = null;
let holdCurrentStage = 0;
let holdListenersAttached = false;
let holdStartFn = null;
let holdStopFn = null;

const STAGE_1_DURATION = 6000;  // 6 detik untuk tahap 1
const STAGE_2_DURATION = 13000; // 13 detik total (7 detik tambahan) untuk tahap 2

function bukaHalamanLilin() {
    const candlePage = document.getElementById('candle-page');
    if (!candlePage) return;

    // Reset state
    holdTime = 0;
    holdCurrentStage = 0;
    holdListenersAttached = false;

    // Tampilkan halaman
    candlePage.classList.add('active');

    // Buat sparkle background
    buatSparkleBackground(candlePage);

    // Fade in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            candlePage.classList.add('visible');
        });
    });
}

function tutupHalamanLilin() {
    const candlePage = document.getElementById('candle-page');
    const msg = document.getElementById('candle-message');
    const btn = document.getElementById('btn-mulai-tiup');
    const tapHint = document.getElementById('tap-hint');
    const flames = document.querySelectorAll('.candle-flame');
    const progressBar = document.getElementById('hold-progress-bar');
    const progressFill = document.getElementById('hold-progress-fill');
    const cakeContainer = document.querySelector('.cake-container');

    if (!candlePage) return;

    // Stop hold interval
    if (holdInterval) {
        clearInterval(holdInterval);
        holdInterval = null;
    }

    // Hapus event listeners
    hapusHoldListeners(candlePage);

    // Fade out
    candlePage.classList.remove('visible');

    setTimeout(() => {
        candlePage.classList.remove('active');

        // Reset semua state
        holdTime = 0;
        holdCurrentStage = 0;

        if (msg) {
            msg.textContent = '';
            msg.className = 'candle-message';
        }

        if (btn) btn.classList.remove('hidden-btn');

        if (tapHint) {
            tapHint.textContent = '';
            tapHint.className = 'tap-hint';
        }

        if (progressBar) progressBar.classList.remove('show-bar');
        if (progressFill) progressFill.style.width = '0%';
        if (cakeContainer) cakeContainer.classList.remove('holding');

        // Reset api lilin
        flames.forEach(flame => {
            flame.classList.remove('dimming', 'extinguished');
            flame.style.animationDuration = '';
        });

        // Hapus sparkle elements
        const sparkles = candlePage.querySelectorAll('.candle-sparkle');
        sparkles.forEach(s => s.remove());
    }, 800);
}

function hapusHoldListeners(candlePage) {
    if (holdListenersAttached && holdStartFn && holdStopFn) {
        candlePage.removeEventListener('mousedown', holdStartFn);
        candlePage.removeEventListener('mouseup', holdStopFn);
        candlePage.removeEventListener('mouseleave', holdStopFn);
        candlePage.removeEventListener('touchstart', holdStartFn);
        candlePage.removeEventListener('touchend', holdStopFn);
        candlePage.removeEventListener('touchcancel', holdStopFn);
        holdListenersAttached = false;
    }
}

function buatSparkleBackground(container) {
    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('candle-sparkle');
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = (Math.random() * 3) + 's';
        sparkle.style.animationDuration = (1.5 + Math.random() * 2) + 's';
        container.appendChild(sparkle);
    }
}

function mulaiTiupLilin() {
    const btn = document.getElementById('btn-mulai-tiup');
    const tapHint = document.getElementById('tap-hint');
    const candlePage = document.getElementById('candle-page');
    const progressBar = document.getElementById('hold-progress-bar');

    if (!btn || !candlePage) return;

    // Sembunyikan tombol
    btn.classList.add('hidden-btn');

    // Tampilkan progress bar & hint
    if (progressBar) progressBar.classList.add('show-bar');
    if (tapHint) {
        tapHint.textContent = 'Press and hold again to blow up!';
        tapHint.className = 'tap-hint show-hint';
    }

    // Reset hold state
    holdTime = 0;
    holdCurrentStage = 0;

    // Setup hold event listeners
    holdStartFn = function (e) {
        // Jangan proses jika klik tombol kembali
        if (e.target.closest('.btn-back-candle')) return;
        // Jangan proses jika sudah selesai
        if (holdCurrentStage >= 3) return;

        e.preventDefault();
        startHolding();
    };

    holdStopFn = function () {
        if (holdCurrentStage >= 3) return;
        stopHolding();
    };

    candlePage.addEventListener('mousedown', holdStartFn);
    candlePage.addEventListener('mouseup', holdStopFn);
    candlePage.addEventListener('mouseleave', holdStopFn);
    candlePage.addEventListener('touchstart', holdStartFn, { passive: false });
    candlePage.addEventListener('touchend', holdStopFn);
    candlePage.addEventListener('touchcancel', holdStopFn);
    holdListenersAttached = true;
}

function startHolding() {
    const cakeContainer = document.querySelector('.cake-container');
    const tapHint = document.getElementById('tap-hint');

    if (cakeContainer) cakeContainer.classList.add('holding');
    if (tapHint) tapHint.className = 'tap-hint'; // Sembunyikan hint saat menekan

    // Jika belum masuk tahap 1, langsung masuk
    if (holdCurrentStage === 0) {
        holdCurrentStage = 1;
        tampilkanTahap1();
    }

    // Mulai interval untuk menambah holdTime
    if (holdInterval) clearInterval(holdInterval);
    holdInterval = setInterval(() => {
        holdTime += 50;
        updateProgress();
        cekTransisiTahap();
    }, 50);
}

function stopHolding() {
    const cakeContainer = document.querySelector('.cake-container');
    const tapHint = document.getElementById('tap-hint');

    if (cakeContainer) cakeContainer.classList.remove('holding');

    // Stop interval
    if (holdInterval) {
        clearInterval(holdInterval);
        holdInterval = null;
    }

    // Tampilkan hint untuk menekan lagi (jika belum selesai)
    if (holdCurrentStage > 0 && holdCurrentStage < 3 && tapHint) {
        tapHint.textContent = '🌬️ Press and hold again to continue';
        tapHint.className = 'tap-hint show-hint';
    }
}

function updateProgress() {
    const progressFill = document.getElementById('hold-progress-fill');
    if (!progressFill) return;

    const percent = Math.min((holdTime / STAGE_2_DURATION) * 100, 100);
    progressFill.style.width = percent + '%';
}

function cekTransisiTahap() {
    // Transisi dari tahap 1 ke tahap 2
    if (holdCurrentStage === 1 && holdTime >= STAGE_1_DURATION) {
        holdCurrentStage = 2;
        tampilkanTahap2();
    }

    // Transisi dari tahap 2 ke tahap 3 (selesai)
    if (holdCurrentStage === 2 && holdTime >= STAGE_2_DURATION) {
        holdCurrentStage = 3;
        stopHolding();
        tampilkanTahap3();
    }
}

function tampilkanTahap1() {
    const msg = document.getElementById('candle-message');
    const flames = document.querySelectorAll('.candle-flame');

    if (msg) {
        msg.textContent = 'Candle time..';
        msg.className = 'candle-message show-msg';
    }

    // Api bergoyang lebih kencang tapi belum mati
    flames.forEach(flame => {
        flame.style.animationDuration = '0.15s';
    });
}

function tampilkanTahap2() {
    const msg = document.getElementById('candle-message');
    const flames = document.querySelectorAll('.candle-flame');

    if (msg) {
        msg.className = 'candle-message'; // fade out dulu
        setTimeout(() => {
            msg.textContent = 'Time to make a wish.. ';
            msg.className = 'candle-message show-msg';
        }, 400);
    }

    // Api mulai redup
    flames.forEach(flame => {
        flame.classList.add('dimming');
    });
}

function tampilkanTahap3() {
    const msg = document.getElementById('candle-message');
    const tapHint = document.getElementById('tap-hint');
    const flames = document.querySelectorAll('.candle-flame');
    const candlePage = document.getElementById('candle-page');
    const progressBar = document.getElementById('hold-progress-bar');

    // Sembunyikan hint & progress
    if (tapHint) {
        tapHint.textContent = '';
        tapHint.className = 'tap-hint';
    }
    if (progressBar) {
        setTimeout(() => { progressBar.classList.remove('show-bar'); }, 500);
    }

    // Fade out pesan sebelumnya
    if (msg) msg.className = 'candle-message';

    // Matikan api satu per satu
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.classList.remove('dimming');
            flame.classList.add('extinguished');
        }, index * 400);
    });

    // Setelah semua api mati
    setTimeout(() => {
        buatConfetti();

        setTimeout(() => {
            if (msg) {
                msg.textContent = 'I hope everything you’ve been praying and wishing for comes true soon. Ameen 🤍';
                msg.className = 'candle-message show-msg final-msg';
            }
        }, 600);
    }, flames.length * 400 + 500);

    // Hapus event listeners karena sudah selesai
    if (candlePage) hapusHoldListeners(candlePage);
}

function buatConfetti() {
    const colors = [
        '#ff6b81', '#ffb6c1', '#a55eea', '#6c5ce7', '#ffd700',
        '#ff9ff3', '#f368e0', '#ffffff', '#00d2d3', '#ff6348',
        '#7bed9f', '#ffa502', '#ff4757', '#2ed573', '#eccc68',
        '#ff7eb3', '#c56cf0', '#17c0eb', '#ffc312'
    ];
    const shapes = ['circle', 'rect', 'star', 'heart', 'ribbon'];
    const animStyles = ['', 'confetti-swirl', 'confetti-zigzag'];

    function burstWave(count, delayBase) {
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');

            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const animStyle = animStyles[Math.floor(Math.random() * animStyles.length)];
            const size = 5 + Math.random() * 10;

            if (animStyle) confetti.classList.add(animStyle);

            if (shape === 'star') {
                confetti.classList.add('confetti-star');
                confetti.textContent = '⭐';
                confetti.style.fontSize = (10 + Math.random() * 8) + 'px';
            } else if (shape === 'heart') {
                confetti.classList.add('confetti-heart');
                confetti.textContent = '💖';
                confetti.style.fontSize = (8 + Math.random() * 8) + 'px';
            } else if (shape === 'ribbon') {
                confetti.classList.add('confetti-ribbon');
                confetti.style.width = (3 + Math.random() * 4) + 'px';
                confetti.style.height = (14 + Math.random() * 12) + 'px';
                confetti.style.background = color;
                confetti.style.borderRadius = '1px';
            } else if (shape === 'rect') {
                confetti.style.width = size + 'px';
                confetti.style.height = (size * 0.5) + 'px';
                confetti.style.background = color;
                confetti.style.borderRadius = '2px';
            } else {
                confetti.style.width = size + 'px';
                confetti.style.height = size + 'px';
                confetti.style.background = color;
                confetti.style.borderRadius = '50%';
            }

            // Wider spread across the entire screen
            confetti.style.left = (5 + Math.random() * 90) + 'vw';
            confetti.style.top = '-15px';
            confetti.style.animationDuration = (2.5 + Math.random() * 3) + 's';
            confetti.style.animationDelay = (delayBase + Math.random() * 1.2) + 's';

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 8000 + delayBase * 1000);
        }
    }

    // Gelombang 1: Ledakan utama
    burstWave(60, 0);

    // Gelombang 2: Ledakan kedua setelah 0.8 detik
    setTimeout(() => burstWave(50, 0), 800);

    // Gelombang 3: Hujan confetti lanjutan
    setTimeout(() => burstWave(40, 0), 2000);
}

// ==========================================
// MINI GAME: BOUQUET DELIVERY QUEST
// ==========================================
(function () {
    let gameCanvas, gameCtx;
    let gameRunning = false;
    let gameAnimFrame = null;
    let gameLives = 3;
    let gameWon = false;

    // Images
    let bouquetImg = new Image();
    let catImg = new Image();
    let monster1Img = new Image();
    let monster2Img = new Image();
    let imagesLoaded = 0;
    const totalImages = 4;

    bouquetImg.src = 'img/Bouquet.png';
    catImg.src = 'img/Cat.png';
    monster1Img.src = 'img/monster1.jpg';
    monster2Img.src = 'img/monster2.jpg';

    [bouquetImg, catImg, monster1Img, monster2Img].forEach(img => {
        img.onload = () => { imagesLoaded++; };
    });

    // Game entities
    let bouquet = { x: 0, y: 0, size: 50, isDragging: false };
    let cat = { x: 0, y: 0, size: 60 };
    let monsters = [];
    let pathPoints = [];
    let pathProgress = 0; // 0 to 1
    let particles = [];
    let trailParticles = [];

    // Canvas dimensions
    let cw = 0, ch = 0;

    function generatePath() {
        pathPoints = [];
        const segments = 8;
        const startX = 50;
        const startY = ch - 70;
        const endX = cw - 60;
        const endY = 70;

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = startX + (endX - startX) * t;
            // Create a winding path with sine waves
            const baseY = startY + (endY - startY) * t;
            const amplitude = cw * 0.18;
            const waveOffset = Math.sin(t * Math.PI * 3) * amplitude;
            const y = baseY + waveOffset;
            pathPoints.push({ x, y });
        }

        // Smooth the path using Catmull-Rom spline interpolation
        const smoothed = [];
        const resolution = 100; // total interpolated points
        for (let i = 0; i < resolution; i++) {
            const t = i / (resolution - 1);
            const totalSeg = pathPoints.length - 1;
            const seg = Math.min(Math.floor(t * totalSeg), totalSeg - 1);
            const localT = (t * totalSeg) - seg;

            const p0 = pathPoints[Math.max(seg - 1, 0)];
            const p1 = pathPoints[seg];
            const p2 = pathPoints[Math.min(seg + 1, pathPoints.length - 1)];
            const p3 = pathPoints[Math.min(seg + 2, pathPoints.length - 1)];

            const x = catmullRom(p0.x, p1.x, p2.x, p3.x, localT);
            const y = catmullRom(p0.y, p1.y, p2.y, p3.y, localT);
            smoothed.push({ x, y });
        }
        pathPoints = smoothed;
    }

    function catmullRom(p0, p1, p2, p3, t) {
        const t2 = t * t;
        const t3 = t2 * t;
        return 0.5 * (
            (2 * p1) +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t3
        );
    }

    function setupMonsters() {
        monsters = [
            {
                x: cw * 0.35,
                y: ch * 0.35,
                size: 55,
                speed: 1.5,
                minY: ch * 0.1,
                maxY: ch * 0.6,
                direction: 1,
                img: monster1Img
            },
            {
                x: cw * 0.7,
                y: ch * 0.55,
                size: 55,
                speed: 2.0,
                minY: ch * 0.3,
                maxY: ch * 0.8,
                direction: -1,
                img: monster2Img
            }
        ];
    }

    function resetGame() {
        gameLives = 3;
        gameWon = false;
        pathProgress = 0;
        particles = [];
        trailParticles = [];

        generatePath();
        setupMonsters();

        // Place bouquet at start of path
        bouquet.x = pathPoints[0].x;
        bouquet.y = pathPoints[0].y;
        bouquet.isDragging = false;

        // Place cat at end of path
        const lastPt = pathPoints[pathPoints.length - 1];
        cat.x = lastPt.x;
        cat.y = lastPt.y;

        updateLivesDisplay();
    }

    function updateLivesDisplay() {
        const el = document.getElementById('game-lives-text');
        if (el) {
            let hearts = '';
            for (let i = 0; i < 3; i++) {
                hearts += i < gameLives ? '❤️ ' : '🖤 ';
            }
            el.textContent = hearts.trim();
        }
    }

    function drawPath() {
        if (pathPoints.length < 2) return;

        // Draw path glow
        gameCtx.save();
        gameCtx.shadowColor = 'rgba(255, 182, 193, 0.5)';
        gameCtx.shadowBlur = 15;
        gameCtx.strokeStyle = 'rgba(255, 182, 193, 0.25)';
        gameCtx.lineWidth = 30;
        gameCtx.lineCap = 'round';
        gameCtx.lineJoin = 'round';
        gameCtx.beginPath();
        gameCtx.moveTo(pathPoints[0].x, pathPoints[0].y);
        for (let i = 1; i < pathPoints.length; i++) {
            gameCtx.lineTo(pathPoints[i].x, pathPoints[i].y);
        }
        gameCtx.stroke();
        gameCtx.restore();

        // Draw dotted path
        gameCtx.save();
        gameCtx.setLineDash([8, 12]);
        gameCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        gameCtx.lineWidth = 3;
        gameCtx.lineCap = 'round';
        gameCtx.beginPath();
        gameCtx.moveTo(pathPoints[0].x, pathPoints[0].y);
        for (let i = 1; i < pathPoints.length; i++) {
            gameCtx.lineTo(pathPoints[i].x, pathPoints[i].y);
        }
        gameCtx.stroke();
        gameCtx.restore();

        // Draw progress line (solid colored line showing how far user has gone)
        if (pathProgress > 0) {
            const progIndex = Math.floor(pathProgress * (pathPoints.length - 1));
            gameCtx.save();
            gameCtx.strokeStyle = 'rgba(255, 105, 180, 0.8)';
            gameCtx.lineWidth = 4;
            gameCtx.lineCap = 'round';
            gameCtx.lineJoin = 'round';
            gameCtx.shadowColor = 'rgba(255, 105, 180, 0.6)';
            gameCtx.shadowBlur = 8;
            gameCtx.beginPath();
            gameCtx.moveTo(pathPoints[0].x, pathPoints[0].y);
            for (let i = 1; i <= progIndex && i < pathPoints.length; i++) {
                gameCtx.lineTo(pathPoints[i].x, pathPoints[i].y);
            }
            gameCtx.stroke();
            gameCtx.restore();
        }
    }

    function drawBouquet() {
        gameCtx.save();
        const size = bouquet.size;
        // Glow effect
        gameCtx.shadowColor = 'rgba(255, 182, 193, 0.8)';
        gameCtx.shadowBlur = bouquet.isDragging ? 25 : 12;

        if (bouquetImg.complete && bouquetImg.naturalWidth > 0) {
            gameCtx.drawImage(bouquetImg, bouquet.x - size / 2, bouquet.y - size / 2, size, size);
        } else {
            // Fallback circle
            gameCtx.fillStyle = '#ff69b4';
            gameCtx.beginPath();
            gameCtx.arc(bouquet.x, bouquet.y, size / 2, 0, Math.PI * 2);
            gameCtx.fill();
            gameCtx.fillStyle = 'white';
            gameCtx.font = '20px Arial';
            gameCtx.textAlign = 'center';
            gameCtx.textBaseline = 'middle';
            gameCtx.fillText('💐', bouquet.x, bouquet.y);
        }
        gameCtx.restore();
    }

    function drawCat() {
        gameCtx.save();
        const size = cat.size;
        const pulse = Math.sin(Date.now() * 0.005) * 5;

        // Glow
        gameCtx.shadowColor = 'rgba(255, 215, 0, 0.6)';
        gameCtx.shadowBlur = 15 + pulse;

        // Draw finish circle
        gameCtx.fillStyle = 'rgba(255, 215, 0, 0.15)';
        gameCtx.beginPath();
        gameCtx.arc(cat.x, cat.y, size / 2 + 15 + pulse, 0, Math.PI * 2);
        gameCtx.fill();

        if (catImg.complete && catImg.naturalWidth > 0) {
            gameCtx.drawImage(catImg, cat.x - size / 2, cat.y - size / 2, size, size);
        } else {
            gameCtx.fillStyle = '#ffd700';
            gameCtx.beginPath();
            gameCtx.arc(cat.x, cat.y, size / 2, 0, Math.PI * 2);
            gameCtx.fill();
            gameCtx.fillStyle = 'white';
            gameCtx.font = '24px Arial';
            gameCtx.textAlign = 'center';
            gameCtx.textBaseline = 'middle';
            gameCtx.fillText('🐱', cat.x, cat.y);
        }

        // "FINISH" label
        gameCtx.shadowBlur = 0;
        gameCtx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        gameCtx.font = 'bold 11px Outfit, sans-serif';
        gameCtx.textAlign = 'center';
        gameCtx.fillText('FINISH', cat.x, cat.y + size / 2 + 16);
        gameCtx.restore();
    }

    function drawMonsters(time) {
        monsters.forEach(m => {
            // Move up and down
            m.y += m.speed * m.direction;
            if (m.y >= m.maxY || m.y <= m.minY) {
                m.direction *= -1;
            }

            gameCtx.save();
            // Danger glow
            gameCtx.shadowColor = 'rgba(255, 50, 50, 0.6)';
            gameCtx.shadowBlur = 15 + Math.sin(time * 0.008) * 5;

            if (m.img.complete && m.img.naturalWidth > 0) {
                // Draw circular clipped monster
                gameCtx.beginPath();
                gameCtx.arc(m.x, m.y, m.size / 2, 0, Math.PI * 2);
                gameCtx.closePath();
                gameCtx.clip();
                gameCtx.drawImage(m.img, m.x - m.size / 2, m.y - m.size / 2, m.size, m.size);
            } else {
                gameCtx.fillStyle = '#ff4444';
                gameCtx.beginPath();
                gameCtx.arc(m.x, m.y, m.size / 2, 0, Math.PI * 2);
                gameCtx.fill();
            }
            gameCtx.restore();

            // Draw danger ring around monster
            gameCtx.save();
            gameCtx.strokeStyle = 'rgba(255, 80, 80, ' + (0.4 + Math.sin(time * 0.006) * 0.3) + ')';
            gameCtx.lineWidth = 2;
            gameCtx.beginPath();
            gameCtx.arc(m.x, m.y, m.size / 2 + 5, 0, Math.PI * 2);
            gameCtx.stroke();
            gameCtx.restore();
        });
    }

    function addTrailParticle() {
        if (!bouquet.isDragging) return;
        trailParticles.push({
            x: bouquet.x + (Math.random() - 0.5) * 15,
            y: bouquet.y + (Math.random() - 0.5) * 15,
            size: 2 + Math.random() * 4,
            alpha: 0.8,
            color: Math.random() > 0.5 ? 'rgba(255,182,193,' : 'rgba(255,105,180,',
            life: 30
        });
    }

    function updateAndDrawTrail() {
        for (let i = trailParticles.length - 1; i >= 0; i--) {
            const p = trailParticles[i];
            p.alpha -= 0.025;
            p.size *= 0.97;
            p.y -= 0.3;
            p.life--;
            if (p.alpha <= 0 || p.life <= 0) {
                trailParticles.splice(i, 1);
                continue;
            }
            gameCtx.fillStyle = p.color + p.alpha + ')';
            gameCtx.beginPath();
            gameCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            gameCtx.fill();
        }
    }

    function addExplosionParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = 2 + Math.random() * 4;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3 + Math.random() * 5,
                alpha: 1,
                color: color,
                life: 40 + Math.random() * 20
            });
        }
    }

    function updateAndDrawParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.alpha -= 0.02;
            p.life--;
            if (p.alpha <= 0 || p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            gameCtx.fillStyle = p.color.replace('1)', p.alpha + ')');
            gameCtx.beginPath();
            gameCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            gameCtx.fill();
        }
    }

    function drawStars() {
        // Ambient floating sparkles
        const time = Date.now() * 0.001;
        for (let i = 0; i < 20; i++) {
            const sx = (Math.sin(time + i * 3.7) * 0.5 + 0.5) * cw;
            const sy = (Math.cos(time * 0.7 + i * 2.1) * 0.5 + 0.5) * ch;
            const alpha = (Math.sin(time * 2 + i) * 0.5 + 0.5) * 0.4;
            const size = 1 + Math.sin(time + i) * 1;
            gameCtx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
            gameCtx.beginPath();
            gameCtx.arc(sx, sy, size, 0, Math.PI * 2);
            gameCtx.fill();
        }
    }

    function checkMonsterCollision() {
        for (const m of monsters) {
            const dx = bouquet.x - m.x;
            const dy = bouquet.y - m.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const collisionDist = (bouquet.size / 2 + m.size / 2) * 0.7;
            if (dist < collisionDist) {
                return true;
            }
        }
        return false;
    }

    function checkWinCondition() {
        const dx = bouquet.x - cat.x;
        const dy = bouquet.y - cat.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < (bouquet.size / 2 + cat.size / 2);
    }

    function onMonsterHit() {
        gameLives--;
        updateLivesDisplay();

        addExplosionParticles(bouquet.x, bouquet.y, 'rgba(255, 80, 80, 1)', 20);

        // Flash screen red
        gameCtx.save();
        gameCtx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        gameCtx.fillRect(0, 0, cw, ch);
        gameCtx.restore();

        if (gameLives <= 0) {
            gameRunning = false;
            setTimeout(() => {
                document.getElementById('game-overlay-lose').style.display = 'flex';
            }, 500);
        } else {
            // Reset bouquet to start
            pathProgress = 0;
            bouquet.x = pathPoints[0].x;
            bouquet.y = pathPoints[0].y;
            bouquet.isDragging = false;
        }
    }

    function onWin() {
        gameWon = true;
        gameRunning = false;

        addExplosionParticles(cat.x, cat.y, 'rgba(255, 215, 0, 1)', 30);
        addExplosionParticles(cat.x, cat.y, 'rgba(255, 105, 180, 1)', 20);

        setTimeout(() => {
            document.getElementById('game-overlay-win').style.display = 'flex';
        }, 800);
    }

    function findClosestPathIndex(x, y) {
        let closestIdx = 0;
        let closestDist = Infinity;
        for (let i = 0; i < pathPoints.length; i++) {
            const dx = x - pathPoints[i].x;
            const dy = y - pathPoints[i].y;
            const d = dx * dx + dy * dy;
            if (d < closestDist) {
                closestDist = d;
                closestIdx = i;
            }
        }
        return { idx: closestIdx, dist: Math.sqrt(closestDist) };
    }

    function getInputPos(e) {
        const rect = gameCanvas.getBoundingClientRect();
        const scaleX = cw / rect.width;
        const scaleY = ch / rect.height;
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    function handleStart(e) {
        if (!gameRunning) return;
        e.preventDefault();
        const pos = getInputPos(e);
        const dx = pos.x - bouquet.x;
        const dy = pos.y - bouquet.y;
        if (Math.sqrt(dx * dx + dy * dy) < bouquet.size * 1.2) {
            bouquet.isDragging = true;
        }
    }

    function handleMove(e) {
        if (!gameRunning || !bouquet.isDragging) return;
        e.preventDefault();
        const pos = getInputPos(e);

        // Find closest point on path that is ahead of current progress
        const { idx, dist } = findClosestPathIndex(pos.x, pos.y);
        const newProgress = idx / (pathPoints.length - 1);

        // Allow some leniency for path following (distance from path)
        const maxDistFromPath = 60;

        if (dist < maxDistFromPath) {
            // Only allow forward movement or small backward movement
            if (newProgress >= pathProgress - 0.05) {
                pathProgress = Math.max(pathProgress, newProgress);
                const pt = pathPoints[Math.floor(pathProgress * (pathPoints.length - 1))];
                bouquet.x = pt.x;
                bouquet.y = pt.y;
            }
        }

        addTrailParticle();
    }

    function handleEnd(e) {
        bouquet.isDragging = false;
    }

    function gameLoop(timestamp) {
        if (!gameRunning && !gameWon) {
            // Still draw the final frame for particles
            if (particles.length > 0) {
                gameCtx.clearRect(0, 0, cw, ch);
                drawBackground();
                drawStars();
                drawPath();
                drawCat();
                drawMonsters(timestamp);
                drawBouquet();
                updateAndDrawParticles();
                gameAnimFrame = requestAnimationFrame(gameLoop);
            }
            return;
        }

        gameCtx.clearRect(0, 0, cw, ch);

        // Draw background
        drawBackground();
        drawStars();

        // Draw path
        drawPath();

        // Draw and update trail
        updateAndDrawTrail();

        // Draw cat (finish)
        drawCat();

        // Draw monsters
        drawMonsters(timestamp);

        // Draw bouquet
        drawBouquet();

        // Draw particles
        updateAndDrawParticles();

        // Check collisions
        if (bouquet.isDragging) {
            if (checkMonsterCollision()) {
                onMonsterHit();
            }
            if (checkWinCondition()) {
                onWin();
            }
        }

        // "START" label at beginning
        if (pathProgress < 0.05) {
            gameCtx.fillStyle = 'rgba(255, 182, 193, 0.9)';
            gameCtx.font = 'bold 11px Outfit, sans-serif';
            gameCtx.textAlign = 'center';
            gameCtx.fillText('START', pathPoints[0].x, pathPoints[0].y + bouquet.size / 2 + 16);
        }

        gameAnimFrame = requestAnimationFrame(gameLoop);
    }

    function drawBackground() {
        // Gradient background
        const grad = gameCtx.createLinearGradient(0, 0, 0, ch);
        grad.addColorStop(0, '#0a0015');
        grad.addColorStop(0.5, '#150025');
        grad.addColorStop(1, '#0a0015');
        gameCtx.fillStyle = grad;
        gameCtx.fillRect(0, 0, cw, ch);
    }

    // ---- PUBLIC FUNCTIONS ----

    window.initMiniGame = function () {
        gameCanvas = document.getElementById('game-canvas');
        if (!gameCanvas) return;
        gameCtx = gameCanvas.getContext('2d');

        // Set canvas size based on container
        const wrapper = gameCanvas.parentElement;
        const rect = wrapper.getBoundingClientRect();
        // Use higher DPR for sharper rendering
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cw = rect.width;
        ch = rect.height;
        gameCanvas.width = cw * dpr;
        gameCanvas.height = ch * dpr;
        gameCanvas.style.width = rect.width + 'px';
        gameCanvas.style.height = rect.height + 'px';
        gameCtx.scale(dpr, dpr);

        resetGame();

        // Show start overlay
        document.getElementById('game-overlay-start').style.display = 'flex';
        document.getElementById('game-overlay-win').style.display = 'none';
        document.getElementById('game-overlay-lose').style.display = 'none';

        // Draw initial state
        drawBackground();
        drawStars();
        drawPath();
        drawCat();
        drawBouquet();
    };

    window.startMiniGame = function () {
        document.getElementById('game-overlay-start').style.display = 'none';
        gameRunning = true;

        // Attach input listeners
        gameCanvas.addEventListener('mousedown', handleStart);
        gameCanvas.addEventListener('mousemove', handleMove);
        gameCanvas.addEventListener('mouseup', handleEnd);
        gameCanvas.addEventListener('mouseleave', handleEnd);
        gameCanvas.addEventListener('touchstart', handleStart, { passive: false });
        gameCanvas.addEventListener('touchmove', handleMove, { passive: false });
        gameCanvas.addEventListener('touchend', handleEnd);
        gameCanvas.addEventListener('touchcancel', handleEnd);

        // Start game loop
        gameAnimFrame = requestAnimationFrame(gameLoop);
    };

    window.restartMiniGame = function () {
        document.getElementById('game-overlay-lose').style.display = 'none';
        resetGame();
        gameRunning = true;
        if (!gameAnimFrame) {
            gameAnimFrame = requestAnimationFrame(gameLoop);
        }
    };

    window.exitMiniGame = function () {
        gameRunning = false;
        if (gameAnimFrame) {
            cancelAnimationFrame(gameAnimFrame);
            gameAnimFrame = null;
        }

        // Remove listeners
        if (gameCanvas) {
            gameCanvas.removeEventListener('mousedown', handleStart);
            gameCanvas.removeEventListener('mousemove', handleMove);
            gameCanvas.removeEventListener('mouseup', handleEnd);
            gameCanvas.removeEventListener('mouseleave', handleEnd);
            gameCanvas.removeEventListener('touchstart', handleStart);
            gameCanvas.removeEventListener('touchmove', handleMove);
            gameCanvas.removeEventListener('touchend', handleEnd);
            gameCanvas.removeEventListener('touchcancel', handleEnd);
        }

        // Hide game screen, show landing page
        const miniGameScreen = document.getElementById('mini-game-screen');
        if (miniGameScreen) {
            miniGameScreen.classList.remove('active');
            setTimeout(() => {
                miniGameScreen.style.display = 'none';
                const landingPage = document.getElementById('landing-page');
                if (landingPage) landingPage.style.display = '';
            }, 600);
        }
    };

})();