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