/**
 * Eloy AI - Site-wide Logic
 * Consolidates Theme Switching and Background Effects
 */

// Prevenir múltiplas execuções
if (!window.eloyInitialized) {
    window.eloyInitialized = true;

    document.addEventListener('DOMContentLoaded', () => {
        const html = document.documentElement;
        const toggleBtn = document.getElementById('theme-toggle');
        const effectsContainer = document.getElementById('effects-container');
        const icon = toggleBtn ? toggleBtn.querySelector('i') : null;

        // --- 1. THEME MANAGEMENT ---
        // Safe localStorage com fallback
        let savedTheme = 'dark';
        try {
            savedTheme = localStorage.getItem('theme') || 'dark';
        } catch (error) {
            console.warn('localStorage não disponível, usando tema padrão');
        }

        setTheme(savedTheme);

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const current = html.getAttribute('data-theme');
                const newTheme = current === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
            });
        }

        function setTheme(theme) {
            html.setAttribute('data-theme', theme);

            // Salvar com tratamento de erro
            try {
                localStorage.setItem('theme', theme);
            } catch (error) {
                console.warn('Não foi possível salvar preferência de tema');
            }

            if (icon) {
                icon.className = theme === 'dark' ? 'bi bi-moon-stars-fill' : 'bi bi-brightness-high-fill';
            }
            updateEffects(theme);
        }

        // --- 2. BACKGROUND EFFECTS (CHUVA vs PIXEL) ---
        function updateEffects(theme) {
            // Fallback se container não existir
            if (!effectsContainer) {
                console.warn('Effects container não encontrado');
                return;
            }

            effectsContainer.innerHTML = '';

            if (theme === 'dark') {
                // Rain Drops
                for (let i = 0; i < 30; i++) {
                    const el = document.createElement('div');
                    el.className = 'rain-drop';
                    el.style.left = Math.random() * 100 + '%';
                    el.style.animationDuration = (Math.random() * 1.5 + 1) + 's';
                    el.style.animationDelay = Math.random() * 2 + 's';
                    el.style.height = (Math.random() * 40 + 20) + 'px';
                    effectsContainer.appendChild(el);
                }
                // Glow Orbs
                for (let i = 0; i < 10; i++) {
                    const el = document.createElement('div');
                    el.className = 'glow-orb';
                    const size = Math.random() * 100 + 50;
                    el.style.width = size + 'px';
                    el.style.height = size + 'px';
                    el.style.left = Math.random() * 100 + '%';
                    el.style.top = Math.random() * 100 + '%';
                    el.style.animationDuration = (Math.random() * 4 + 4) + 's';
                    el.style.animationDelay = (Math.random() * -5) + 's';
                    effectsContainer.appendChild(el);
                }
            } else {
                // Pixel Patches
                for (let i = 0; i < 15; i++) {
                    const el = document.createElement('div');
                    el.className = 'pixel-patch';
                    el.style.left = Math.random() * 95 + '%';
                    el.style.top = Math.random() * 95 + '%';
                    const size = Math.random() * 15 + 10;
                    el.style.width = size + 'px';
                    el.style.height = size + 'px';
                    el.style.animationDuration = (Math.random() * 4 + 4) + 's';
                    el.style.animationDelay = (Math.random() * -5) + 's';
                    effectsContainer.appendChild(el);
                }
                // Floating Squares
                for (let i = 0; i < 8; i++) {
                    const el = document.createElement('div');
                    el.className = 'floating-square';
                    const size = Math.random() * 30 + 20;
                    el.style.width = size + 'px';
                    el.style.height = size + 'px';
                    el.style.left = Math.random() * 100 + '%';
                    el.style.top = Math.random() * 100 + '%';
                    el.style.animationDuration = (Math.random() * 6 + 4) + 's';
                    el.style.animationDelay = (Math.random() * -5) + 's';
                    effectsContainer.appendChild(el);
                }
            }
        }
    });
}
