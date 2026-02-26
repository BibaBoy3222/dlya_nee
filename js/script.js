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

    // ----- Инициализация музыки: попытка автозапуска (muted) -----
    let musicEnabled = false;      // была ли музыка включена (со звуком) до открытия видео
    let musicPlaying = false;      // играет ли сейчас (с учётом muted)
    let userInteracted = false;    // был ли первый клик

    if (bgMusic) {
        // Убедимся, что звук отключён (muted) для автозапуска
        bgMusic.muted = true;
        // Пытаемся запустить воспроизведение
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Воспроизведение началось (без звука)
                musicPlaying = true;
                musicIcon.textContent = '🔇';
                console.log('Музыка запущена (без звука)');
            }).catch(error => {
                // Автозапуск не удался — возможно, браузер заблокировал
                console.log('Автозапуск музыки не удался:', error);
                musicIcon.textContent = '🔇';
                musicPlaying = false;
            });
        }
    }

    // Функция для включения звука (unmute) при первом взаимодействии
    function enableSound() {
        if (!bgMusic) return;
        if (bgMusic.muted) {
            bgMusic.muted = false;
            musicIcon.textContent = '🔊';
            musicPlaying = true;
            userInteracted = true;
        }
    }

    // Функция воспроизведения (если музыка на паузе) с учётом muted
    function playMusic() {
        if (!bgMusic) return;
        bgMusic.play().then(() => {
            musicIcon.textContent = bgMusic.muted ? '🔇' : '🔊';
            musicPlaying = true;
        }).catch(e => {
            console.log('Не удалось воспроизвести музыку:', e);
            musicIcon.textContent = '🔇';
            musicPlaying = false;
        });
    }

    function pauseMusic() {
        if (bgMusic && !bgMusic.paused) {
            bgMusic.pause();
            musicPlaying = false;
            musicIcon.textContent = '🔇';
        }
    }

    // При первом клике на страницу включаем звук (unmute)
    document.body.addEventListener('click', function() {
        if (!userInteracted) {
            enableSound();
        }
    }, { once: true });

    // Управление музыкой по кнопке (вкл/выкл звук)
    if (musicControl && bgMusic) {
        musicControl.addEventListener('click', function(e) {
            e.stopPropagation();
            if (bgMusic.muted) {
                bgMusic.muted = false;
                if (bgMusic.paused) {
                    playMusic();
                } else {
                    musicIcon.textContent = '🔊';
                }
            } else {
                bgMusic.muted = true;
                musicIcon.textContent = '🔇';
            }
        });
    }

// ---- Приветственное окно ----
const welcomeModal = document.getElementById('welcomeModal');
const startMusicBtn = document.getElementById('startMusicBtn');

// Показываем окно при загрузке (если музыка ещё не была активирована)
if (welcomeModal) {
    welcomeModal.style.display = 'flex';
}

if (startMusicBtn && bgMusic) {
    startMusicBtn.addEventListener('click', function() {
        // Снимаем mute и запускаем музыку, если она на паузе
        bgMusic.muted = false;
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicIcon.textContent = '🔊';
                musicPlaying = true;
                console.log('Музыка запущена по кнопке');
            }).catch(e => console.log('Ошибка запуска музыки', e));
        } else {
            musicIcon.textContent = '🔊';
        }
        // Закрываем окно
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

    // Закрытие по крестику
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Закрытие по клику на фон
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

    // Закрытие письма
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
});

// ---- Карта наших мест (Leaflet) ----
if (document.getElementById('map')) {
    // Координаты центра карты (можно выставить примерно по середине ваших мест)
    var map = L.map('map').setView([55.751244, 37.618423], 10); // Москва, замени на свой город

    // Бесплатные тайлы OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // ---- Добавляй свои маркеры сюда ----
    // Пример: место первой встречи
    L.marker([45.01392772756214, 38.92922389718127]).addTo(map)
        .bindPopup('<b>❤️ Здесь мы встретились</b><br>Тот самый день')
        .openPopup();

    // Пример: любимое кафе
    L.marker([44.89864480237702, 37.30580103119168]).addTo(map)
        .bindPopup('☕ Где-то тут мы гуляли и я влюблялся');

    // Пример: парк, где гуляли
    L.marker([43.89988513065413, 39.33981843673775]).addTo(map)
        .bindPopup('🌳 Место где мы провели лето');

    // Пример: парк, где гуляли
    L.marker([43.687691582244916, 40.25022306150212]).addTo(map)
        .bindPopup('Сюда я приехал и мы снова влюбились');

    // Пример: парк, где гуляли
    L.marker([43.274022728132685, 40.26985700117345]).addTo(map)
        .bindPopup('Тут я совершил ошибки, о которых жалел, но я так сильно любил');

    // Добавь столько маркеров, сколько нужно
    // Координаты можно найти, например, в Google Maps: клик правой кнопкой по месту → "Что здесь?" → скопировать числа
}
