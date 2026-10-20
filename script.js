'use strict';
/* ==========================================
   DATOS PRINCIPALES DE LA INVITACIÓN
========================================== */
const CONFIG = {
    whatsapp: '59167525973',
    graduado: 'Kevin Cristhian Guzman Javier',
    carrera: 'Licenciado en Contaduría Pública',
    fecha: '2026-10-23T09:00:00-04:00'
}
const $ = (selector) => document.querySelector(selector);
/* ==========================================
   ABRIR LA INVITACIÓN
========================================== */
const welcomeScreen = $('#welcomeScreen');
const openInvitationButton = $('#openInvitation');
const audio = $('#backgroundMusic');
const musicToggle = $('#musicToggle');
const musicState = $('#musicState');
function setMusicState(playing) {
    if (musicToggle) {
        musicToggle.textContent = playing ? 'Ⅱ' : '▶';
        musicToggle.setAttribute(
            'aria-label',
            playing ? 'Pausar música' : 'Reproducir música'
        );
    }
    if (musicState) {
        musicState.textContent = playing
            ? 'Reproduciendo'
            : 'Pulsa para reproducir';
    }
}
async function startMusic() {
    if (!audio) return false;
    try {
        await audio.play();
        setMusicState(true);
        return true;
    } catch (error) {
        setMusicState(false);
        if (musicState) {
            musicState.textContent = 'Pulsa para reproducir';
        }
        console.warn('No se pudo iniciar la música:', error);
        return false;
    }
}
openInvitationButton?.addEventListener('click', () => {
    // Oculta la pantalla inicial.
    if (welcomeScreen) {
        welcomeScreen.classList.add('is-hidden');
    }
    // Inicia la música con la interacción del usuario.
    startMusic();
    // Activa las animaciones de las secciones visibles.
    document.querySelectorAll('.reveal').forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (
            rect.top < window.innerHeight &&
            rect.bottom > 0
        ) {
            element.classList.add('visible');
        }
    });
});
/* ==========================================
   MENÚ PARA CELULARES
========================================== */
const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');
menuToggle?.addEventListener('click', () => {
    if (!mainNav) return;
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute(
        'aria-expanded',
        String(isOpen)
    );
    menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'Cerrar menú' : 'Abrir menú'
    );
    menuToggle.textContent = isOpen ? '×' : '☰';
});
mainNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Abrir menú');
            menuToggle.textContent = '☰';
        }
    });
});
/* ==========================================
   ANIMACIÓN AL DESPLAZARSE
========================================== */
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );
    revealElements.forEach((element) => {
        observer.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add('visible');
    });
}
/* ==========================================
   CUENTA REGRESIVA
========================================== */
function updateCountdown() {
    const target = new Date(CONFIG.fecha).getTime();
    const difference = target - Date.now();
    const message = $('#countdownMessage');
    if (difference <= 0) {
        [
            '#days',
            '#hours',
            '#minutes',
            '#seconds'
        ].forEach((selector) => {
            const node = $(selector);
            if (node) {
                node.textContent = '00';
            }
        });
        if (message) {
            message.textContent =
                difference > -24 * 60 * 60 * 1000
                    ? '¡Hoy celebramos este gran logro!'
                    : 'La celebración ya tuvo lugar. ¡Gracias por ser parte de este recuerdo!';
        }
        return;
    }
    const values = {
        '#days': Math.floor(difference / 86400000),
        '#hours': Math.floor(
            (difference % 86400000) / 3600000
        ),
        '#minutes': Math.floor(
            (difference % 3600000) / 60000
        ),
        '#seconds': Math.floor(
            (difference % 60000) / 1000
        )
    };
    Object.entries(values).forEach(([selector, value]) => {
        const node = $(selector);

        if (node) {
            node.textContent = String(value).padStart(2, '0');
        }
    });
    if (message) {
        message.textContent =
            'Cada segundo nos acerca a este momento especial.';
    }
}
updateCountdown();
window.setInterval(updateCountdown, 1000);
/* ==========================================
   CONFIRMACIÓN POR WHATSAPP
========================================== */
function makeWhatsAppLink(message) {
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}
const yesLink = $('#confirmYes');
const noLink = $('#confirmNo');
if (yesLink) {
    yesLink.href = makeWhatsAppLink(
        `¡Hola! Confirmo mi asistencia a la graduación de ${CONFIG.graduado}. ¡Muchas felicidades!`
    );
    yesLink.target = '_blank';
    yesLink.rel = 'noopener noreferrer';
}
if (noLink) {
    noLink.href = makeWhatsAppLink(
        `¡Hola! Muchas gracias por la invitación a la graduación de ${CONFIG.graduado}. Lamentablemente no podré asistir. ¡Muchas felicidades por este logro!`
    );
    noLink.target = '_blank';
    noLink.rel = 'noopener noreferrer';
}
/* ==========================================
   REPRODUCTOR DE MÚSICA
========================================== */
musicToggle?.addEventListener('click', async () => {
    if (!audio) return;
    if (audio.paused) {
        await startMusic();
    } else {
        audio.pause();
        setMusicState(false);
    }
});
audio?.addEventListener('play', () => {
    setMusicState(true);
});
audio?.addEventListener('pause', () => {
    setMusicState(false);
});
audio?.addEventListener('ended', () => {
    setMusicState(false);
});
audio?.addEventListener('error', () => {
    if (musicState) {
        musicState.textContent = 'Revisa el archivo de música';
    }
});
/* ==========================================
   GALERÍA DE FOTOGRAFÍAS
========================================== */
const lightbox = $('#lightbox');
const lightboxImage = $('#lightboxImage');
const lightboxClose = $('#lightboxClose');
document.querySelectorAll('.gallery-tile').forEach((tile) => {
    const photoPath = tile.dataset.photo;
    if (!photoPath) return;
    const image = new Image();
    image.className = 'gallery-image';
    image.alt = 'Fotografía de Kevin Cristhian Guzman Javier';
    image.onload = () => {
        tile.classList.add('has-photo');
        if (!image.isConnected) {
            tile.prepend(image);
        }
    };
    image.onerror = () => {
        // Conserva el marcador visual si no existe la fotografía.
        tile.classList.remove('has-photo');
    };
    image.src = photoPath;
    tile.addEventListener('click', () => {
        if (
            !tile.classList.contains('has-photo') ||
            !lightbox ||
            !lightboxImage
        ) {
            return;
        }
        lightboxImage.src = photoPath;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        lightboxClose?.focus();
    });
});
function closeLightbox() {
    if (lightbox) {
        lightbox.hidden = true;
    }
    if (lightboxImage) {
        lightboxImage.removeAttribute('src');
    }
    document.body.style.overflow = '';
}
lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});
document.addEventListener('keydown', (event) => {
    if (
        event.key === 'Escape' &&
        lightbox &&
        !lightbox.hidden
    ) {
        closeLightbox();
    }
});
/* ==========================================
   GENERADOR DE CÓDIGO QR
========================================== */
const generateQRButton = $('#generateQR');
const downloadQRButton = $('#downloadQR');
const qrContainer = $('#qrcode');
const qrStatus = $('#qrStatus');
let qrReady = false;
generateQRButton?.addEventListener('click', () => {
    const pageUrl = window.location.href;
    const isPublicHttp =
        (
            pageUrl.startsWith('https://') ||
            pageUrl.startsWith('http://')
        ) &&
        !/localhost|127\.0\.0\.1/i.test(window.location.hostname);
    if (!isPublicHttp) {
        if (qrStatus) {
            qrStatus.textContent =
                'La invitación todavía no está publicada en una dirección pública. Publícala en Netlify y vuelve a intentarlo.';
        }
        return;
    }
    if (typeof window.QRCode !== 'function') {
        if (qrStatus) {
            qrStatus.textContent =
                'No se pudo cargar el generador de QR. Comprueba tu conexión a Internet.';
        }
        return;
    }
    if (!qrContainer) return;
    qrContainer.innerHTML = '';
    try {
        new window.QRCode(qrContainer, {
            text: pageUrl,
            width: 220,
            height: 220,
            colorDark: '#071629',
            colorLight: '#ffffff',
            correctLevel: window.QRCode.CorrectLevel.H
        });
        qrReady = true;
        if (downloadQRButton) {
            downloadQRButton.disabled = false;
        }
        if (qrStatus) {
            qrStatus.textContent =
                '¡Código QR creado! Escanéalo con otro teléfono para comprobar que abre la invitación.';
        }
    } catch (error) {
        qrReady = false;
        if (qrStatus) {
            qrStatus.textContent =
                'No se pudo crear el código QR. Inténtalo nuevamente.';
        }
        console.error('Error al generar el QR:', error);
    }
});
downloadQRButton?.addEventListener('click', () => {
    if (!qrReady || !qrContainer) return;
    const canvas = qrContainer.querySelector('canvas');
    const image = qrContainer.querySelector('img');
    let dataUrl = null;
    if (canvas) {
        dataUrl = canvas.toDataURL('image/png');
    } else if (image) {
        dataUrl = image.src;
    }
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'QR-Invitacion-Kevin-Guzman.png';
    document.body.appendChild(link);
    link.click();
    link.remove();
});
/* ==========================================
   EFECTO DE CONFETI
========================================== */
const closingStar = $('.closing-star');
const confettiCanvas = $('#confettiCanvas');
const ctx = confettiCanvas?.getContext('2d');
let confettiPieces = [];
let confettiFrame = null;
function resizeConfettiCanvas() {
    if (!confettiCanvas || !ctx) return;
    const ratio = window.devicePixelRatio || 1;
    confettiCanvas.width = window.innerWidth * ratio;
    confettiCanvas.height = window.innerHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
resizeConfettiCanvas();
window.addEventListener('resize', resizeConfettiCanvas);
function launchConfetti() {
    if (
        !ctx ||
        !confettiCanvas ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
        return;
    }
    confettiPieces = Array.from(
        { length: 110 },
        () => ({
            x: Math.random() * window.innerWidth,
            y: -20 - Math.random() * window.innerHeight * 0.4,
            vx: (Math.random() - 0.5) * 3,
            vy: 2 + Math.random() * 3,
            size: 3 + Math.random() * 5,
            angle: Math.random() * 6,
            spin: (Math.random() - 0.5) * 0.12,
            color: [
                '#83c1ff',
                '#dbe8f5',
                '#4d9be8',
                '#ffffff'
            ][Math.floor(Math.random() * 4)]
        })
    );
    if (confettiFrame) {
        cancelAnimationFrame(confettiFrame);
    }
    const draw = () => {
        if (!ctx) return;
        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );
        confettiPieces.forEach((piece) => {
            piece.x += piece.vx;
            piece.y += piece.vy;
            piece.angle += piece.spin;
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate(piece.angle);
            ctx.fillStyle = piece.color;
            ctx.fillRect(
                -piece.size / 2,
                -piece.size / 2,
                piece.size,
                piece.size * 1.7
            );
            ctx.restore();
        });
        confettiPieces = confettiPieces.filter(
            (piece) => piece.y < window.innerHeight + 20
        );
        if (confettiPieces.length) {
            confettiFrame = requestAnimationFrame(draw);
        } else {
            ctx.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );
            confettiFrame = null;
        }
    };
    draw();
}
closingStar?.addEventListener('click', launchConfetti);
closingStar?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        launchConfetti();
    }
});
if (closingStar) {
    closingStar.setAttribute('role', 'button');
    closingStar.setAttribute('tabindex', '0');
    closingStar.setAttribute(
        'aria-label',
        'Lanzar confeti'
    );
}
