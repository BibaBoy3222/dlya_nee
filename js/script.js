// Ждём полной загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    // ----- Элементы для фото/видео модалки -----
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    const modalVideo = document.getElementById('modal-video');
    const closeBtn = document.querySelector('.close');

    // ----- Элементы для модалки письма -----
    const letterModal = document.getElementById('letterModal');
    const openLetterBtn = document.getElementById('openLetterBtn');
    const closeLetter = document.querySelector('.close-letter');

    // ----- Элементы для музыки -----
    const bgMusic = document.getElementById('bgMusic');
    const musicControl = document.getElementById('musicControl');
    const musicIcon = document.getElementById('musicIcon');

    // ----- Инициализация музыки -----
    let musicEnabled = false;
    let musicPlaying = false;
    let userInteracted = false;

    if (bgMusic) {
        bgMusic.muted = true;
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicPlaying = true;
                musicIcon.textContent = '🔇';
                console.log('Музыка запущена (без звука)');
            }).catch(error => {
                console.log('Автозапуск музыки не удался:', error);
                musicIcon.textContent = '🔇';
                musicPlaying = false;
            });
        }
    }

    function enableSound() {
        if (!bgMusic) return;
        if (bgMusic.muted) {
            bgMusic.muted = false;
            musicIcon.textContent = '🔊';
            musicPlaying = true;
            userInteracted = true;
            musicControl.classList.add('playing');
        }
    }

    function playMusic() {
        if (!bgMusic) return;
        bgMusic.play().then(() => {
            musicIcon.textContent = bgMusic.muted ? '🔇' : '🔊';
            musicPlaying = true;
            if (!bgMusic.muted) musicControl.classList.add('playing');
        }).catch(e => {
            console.log('Не удалось воспроизвести музыку:', e);
            musicIcon.textContent = '🔇';
            musicPlaying = false;
            musicControl.classList.remove('playing');
        });
    }

    function pauseMusic() {
        if (bgMusic && !bgMusic.paused) {
            bgMusic.pause();
            musicPlaying = false;
            musicIcon.textContent = '🔇';
            musicControl.classList.remove('playing');
        }
    }

    // При первом клике на страницу включаем звук
    document.body.addEventListener('click', function() {
        if (!userInteracted) {
            enableSound();
        }
    }, { once: true });

    // Управление музыкой по кнопке
    if (musicControl && bgMusic) {
        musicControl.addEventListener('click', function(e) {
            e.stopPropagation();
            if (bgMusic.muted) {
                bgMusic.muted = false;
                if (bgMusic.paused) {
                    playMusic();
                } else {
                    musicIcon.textContent = '🔊';
                    musicControl.classList.add('playing');
                }
            } else {
                bgMusic.muted = true;
                musicIcon.textContent = '🔇';
                musicControl.classList.remove('playing');
            }
        });
    }

    // ---- Приветственное окно ----
    const welcomeModal = document.getElementById('welcomeModal');
    const startMusicBtn = document.getElementById('startMusicBtn');

    if (welcomeModal) {
        welcomeModal.style.display = 'flex';
    }

    if (startMusicBtn && bgMusic) {
        startMusicBtn.addEventListener('click', function() {
            bgMusic.muted = false;
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    musicIcon.textContent = '🔊';
                    musicPlaying = true;
                    musicControl.classList.add('playing');
                    console.log('Музыка запущена по кнопке');
                }).catch(e => console.log('Ошибка запуска музыки', e));
            } else {
                musicIcon.textContent = '🔊';
                musicControl.classList.add('playing');
            }
            welcomeModal.style.display = 'none';
        });
    }

    // ---- Функция закрытия фото/видео модалки ----
    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.currentTime = 0;
            }
            if (musicEnabled && bgMusic && bgMusic.paused) {
                playMusic();
            }
        }
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // ---- Обработка фото-карточек ----
    const photoCards = document.querySelectorAll('.memory-card img');
    photoCards.forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            if (modal && modalImg && modalVideo) {
                musicEnabled = (bgMusic && !bgMusic.paused && !bgMusic.muted);
                pauseMusic();

                modal.style.display = 'flex';
                modalVideo.style.display = 'none';
                modalVideo.pause();
                modalImg.style.display = 'block';
                modalImg.src = this.src;
            }
        });
    });

    // ---- Обработка видео-карточек ----
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoSrc = this.dataset.video;
            if (videoSrc && modal && modalImg && modalVideo) {
                musicEnabled = (bgMusic && !bgMusic.paused && !bgMusic.muted);
                pauseMusic();

                modal.style.display = 'flex';
                modalImg.style.display = 'none';
                modalVideo.style.display = 'block';
                modalVideo.src = videoSrc;
                modalVideo.load();
            }
        });
    });

    // ---- Обработка кнопки письма ----
    if (openLetterBtn && letterModal) {
        openLetterBtn.addEventListener('click', function() {
            letterModal.style.display = 'flex';
        });
    }

    if (closeLetter && letterModal) {
        closeLetter.addEventListener('click', function() {
            letterModal.style.display = 'none';
        });

        letterModal.addEventListener('click', function(e) {
            if (e.target === letterModal) {
                letterModal.style.display = 'none';
            }
        });
    }

    // ---- Карта с кастомными маркерами (сердечки) ----
    if (document.getElementById('map')) {
        // Кастомная иконка-сердечко
        var heartIcon = L.divIcon({
            className: 'custom-heart-icon',
            html: '❤️',
            iconSize: [30, 30],
            popupAnchor: [0, -15]
        });

        var map = L.map('map').setView([44.5, 39.0], 8); // центр Краснодарского края

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Массив с местами
        var places = [
            { coords: [45.0139, 38.9292], text: '<b>❤️ Здесь мы встретились</b><br>Тот самый день' },
            { coords: [44.8986, 37.3058], text: '☕ Где-то тут мы гуляли и я влюблялся' },
            { coords: [43.8999, 39.3398], text: '🌳 Место где мы провели лето' },
            { coords: [43.6877, 40.2502], text: 'Сюда я приехал и мы снова влюбились' },
            { coords: [43.2740, 40.2699], text: 'Тут я совершил ошибки, о которых жалел, но я так сильно любил' }
        ];

        places.forEach(place => {
            L.marker(place.coords, { icon: heartIcon }).addTo(map)
                .bindPopup(place.text, {
                    className: 'heart-popup',
                    closeButton: false
                });
        });

        // Стили для попапов (можно добавить в CSS, но оставлю здесь для наглядности)
        const style = document.createElement('style');
        style.innerHTML = `
            .heart-popup .leaflet-popup-content-wrapper {
                background: #fff0f5;
                color: #b91c4b;
                border-radius: 20px;
                border: 2px solid #f9a8d4;
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.2rem;
                text-align: center;
                box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            }
            .heart-popup .leaflet-popup-tip {
                background: #f9a8d4;
            }
        `;
        document.head.appendChild(style);
    }
});

