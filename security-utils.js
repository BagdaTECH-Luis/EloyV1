/**
 * Eloy AI - Security Utilities
 * Funções compartilhadas de segurança para proteção contra XSS, validação de inputs, etc.
 */

// ===== SANITIZAÇÃO DE HTML =====
/**
 * Remove tags HTML potencialmente perigosas de uma string
 * @param {string} input - String potencialmente contendo HTML
 * @returns {string} String sanitizada
 */
function sanitizeHTML(input) {
    if (typeof input !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Escapa caracteres especiais HTML
 * @param {string} text - Texto a ser escapado
 * @returns {string} Texto com caracteres HTML escapados
 */
function escapeHTML(text) {
    if (typeof text !== 'string') return '';
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, char => map[char]);
}

// ===== VALIDAÇÃO DE EMAIL =====
/**
 * Valida formato de email (RFC 5322 simplificado)
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se válido
 */
function validateEmail(email) {
    if (typeof email !== 'string') return false;
    
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    return regex.test(email) && email.length <= 254;
}

// ===== VALIDAÇÃO DE SENHA =====
/**
 * Valida força de senha
 * @param {string} password - Senha a ser validada
 * @returns {object} { valid: boolean, message: string }
 */
function validatePassword(password) {
    if (typeof password !== 'string') {
        return { valid: false, message: 'Senha inválida' };
    }
    
    if (password.length < 8) {
        return { valid: false, message: 'A senha deve ter no mínimo 8 caracteres' };
    }
    
    if (!/[a-zA-Z]/.test(password)) {
        return { valid: false, message: 'A senha deve conter pelo menos uma letra' };
    }
    
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'A senha deve conter pelo menos um número' };
    }
    
    return { valid: true, message: 'Senha válida' };
}

// ===== VALIDAÇÃO GENÉRICA DE INPUT =====
/**
 * Valida comprimento e conteúdo de input genérico
 * @param {string} input - Input a ser validado
 * @param {number} maxLength - Comprimento máximo permitido
 * @returns {object} { valid: boolean, message: string, sanitized: string }
 */
function validateInput(input, maxLength = 2000) {
    if (typeof input !== 'string') {
        return { valid: false, message: 'Input inválido', sanitized: '' };
    }
    
    const trimmed = input.trim();
    
    if (trimmed.length === 0) {
        return { valid: false, message: 'Campo não pode estar vazio', sanitized: '' };
    }
    
    if (trimmed.length > maxLength) {
        return { 
            valid: false, 
            message: `Texto muito longo (máximo ${maxLength} caracteres)`, 
            sanitized: trimmed.substring(0, maxLength) 
        };
    }
    
    const sanitized = sanitizeHTML(trimmed);
    
    return { valid: true, message: 'Input válido', sanitized };
}

// ===== RATE LIMITING =====
/**
 * Implementação simples de rate limiting (lado cliente)
 * @param {string} key - Chave única para o rate limit
 * @param {number} maxAttempts - Número máximo de tentativas
 * @param {number} windowMs - Janela de tempo em milissegundos
 * @returns {object} { allowed: boolean, remainingAttempts: number, resetTime: number }
 */
function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
    const now = Date.now();
    const storageKey = `rateLimit_${key}`;
    
    try {
        let data = localStorage.getItem(storageKey);
        
        if (!data) {
            data = { attempts: 0, firstAttempt: now };
        } else {
            data = JSON.parse(data);
        }
        
        // Reset se a janela expirou
        if (now - data.firstAttempt > windowMs) {
            data = { attempts: 0, firstAttempt: now };
        }
        
        // Incrementa tentativas
        data.attempts++;
        
        const allowed = data.attempts <= maxAttempts;
        const remainingAttempts = Math.max(0, maxAttempts - data.attempts);
        const resetTime = data.firstAttempt + windowMs;
        
        // Salva estado
        localStorage.setItem(storageKey, JSON.stringify(data));
        
        return { allowed, remainingAttempts, resetTime };
        
    } catch (error) {
        // Fallback se localStorage não estiver disponível
        console.warn('Rate limiting não disponível (localStorage inacessível)');
        return { allowed: true, remainingAttempts: maxAttempts, resetTime: now + windowMs };
    }
}

/**
 * Reseta o rate limit para uma chave específica
 * @param {string} key - Chave do rate limit a ser resetada
 */
function resetRateLimit(key) {
    const storageKey = `rateLimit_${key}`;
    try {
        localStorage.removeItem(storageKey);
    } catch (error) {
        console.warn('Não foi possível resetar rate limit');
    }
}

// ===== CSRF TOKEN (Básico) =====
/**
 * Gera um token CSRF simples para requisições
 * @returns {string} Token CSRF
 */
function generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Armazena token CSRF no sessionStorage
 * @param {string} token - Token a ser armazenado
 */
function storeCSRFToken(token) {
    try {
        sessionStorage.setItem('csrfToken', token);
    } catch (error) {
        console.warn('Não foi possível armazenar CSRF token');
    }
}

/**
 * Recupera token CSRF do sessionStorage
 * @returns {string|null} Token armazenado ou null
 */
function getCSRFToken() {
    try {
        return sessionStorage.getItem('csrfToken');
    } catch (error) {
        console.warn('Não foi possível recuperar CSRF token');
        return null;
    }
}

// ===== DEBOUNCE =====
/**
 * Função debounce para limitar execuções
 * @param {Function} func - Função a ser debounced
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função debounced
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== SAFE LOCALSTORAGE =====
/**
 * Wrapper seguro para localStorage com fallback
 * @param {string} key - Chave
 * @param {any} value - Valor (será stringificado)
 * @returns {boolean} True se armazenado com sucesso
 */
function safeLocalStorageSet(key, value) {
    try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn(`Não foi possível salvar no localStorage: ${key}`, error);
        return false;
    }
}

/**
 * Recupera valor do localStorage com fallback
 * @param {string} key - Chave
 * @param {any} defaultValue - Valor padrão se não encontrado
 * @returns {any} Valor recuperado ou padrão
 */
function safeLocalStorageGet(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        if (value === null) return defaultValue;
        
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    } catch (error) {
        console.warn(`Não foi possível recuperar do localStorage: ${key}`, error);
        return defaultValue;
    }
}

// Exportar funções (se usando módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sanitizeHTML,
        escapeHTML,
        validateEmail,
        validatePassword,
        validateInput,
        checkRateLimit,
        resetRateLimit,
        generateCSRFToken,
        storeCSRFToken,
        getCSRFToken,
        debounce,
        safeLocalStorageSet,
        safeLocalStorageGet
    };
}
