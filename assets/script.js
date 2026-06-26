// ====== MOBILE MENU ====== 
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.backgroundColor = '#2c3e50';
        navMenu.style.flexDirection = 'column';
        navMenu.style.width = '100%';
        navMenu.style.zIndex = '999';
    });
}

// ====== SMOOTH SCROLLING FOR LINKS ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ====== NAVBAR ACTIVE LINK ======
function setActiveNavLink() {
    const currentLocation = location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });
}

setActiveNavLink();

// ====== FORM HANDLING ======
const denunciaForm = document.getElementById('denunciaForm');

if (denunciaForm) {
    denunciaForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            tipoAbuso: Array.from(document.querySelectorAll('input[name="tipoAbuso"]:checked'))
                .map(cb => cb.value),
            quando: document.getElementById('quando').value,
            frequencia: document.getElementById('frequencia').value,
            setor: document.getElementById('setor').value,
            descricao: document.getElementById('descricao').value,
            impactos: document.getElementById('impactos').value,
            testemunhas: document.getElementById('testemunhas').value,
            denunciaAnterior: document.getElementById('denunciaAnterior').value,
            tipoEmpresa: document.getElementById('tipoEmpresa').value,
            setorEconomia: document.getElementById('setorEconomia').value,
            timestamp: new Date().toISOString(),
        };
        
        // Validation
        if (formData.tipoAbuso.length === 0) {
            alert('Por favor, selecione pelo menos um tipo de abuso.');
            return;
        }
        
        if (!formData.descricao.trim()) {
            alert('Por favor, descreva o que aconteceu.');
            return;
        }
        
        // Generate unique ID
        const denunciaId = generateDenunciaId();
        
        // Store in localStorage with anonymity
        try {
            let denuncias = JSON.parse(localStorage.getItem('denuncias') || '[]');
            
            // Add the report
            denuncias.push({
                id: denunciaId,
                ...formData,
                anonimo: true,
                recevidoEm: new Date().toLocaleString('pt-BR')
            });
            
            // Keep only last 1000 reports to manage storage
            if (denuncias.length > 1000) {
                denuncias = denuncias.slice(-1000);
            }
            
            localStorage.setItem('denuncias', JSON.stringify(denuncias));
            
            // Show success message
            showSuccessMessage(denunciaId);
            
            // Log anonymously (for demo purposes)
            console.log('Denúncia registrada com sucesso!');
            
        } catch (error) {
            // Storage quota exceeded or localStorage disabled
            if (error.name === 'QuotaExceededError') {
                alert('Não há espaço suficiente para armazenar sua denúncia. Tente novamente mais tarde.');
            } else {
                alert('Sua denúncia foi registrada. ID: ' + denunciaId);
            }
        }
    });
}

// ====== GENERATE UNIQUE DENUNCIA ID ======
function generateDenunciaId() {
    return 'DEN-' + Date.now().toString(36).toUpperCase() + 
           Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ====== SHOW SUCCESS MESSAGE ======
function showSuccessMessage(denunciaId) {
    const form = document.getElementById('denunciaForm');
    const successMessage = document.getElementById('successMessage');
    const denunciaIdElement = document.getElementById('denunciaId');
    
    if (successMessage && denunciaIdElement) {
        denunciaIdElement.textContent = denunciaId;
        successMessage.style.display = 'block';
        
        // Hide form
        form.style.display = 'none';
        
        // Scroll to message
        successMessage.scrollIntoView({ behavior: 'smooth' });
        
        // Add button to return to home
        const returnBtn = document.createElement('button');
        returnBtn.className = 'btn btn-secondary';
        returnBtn.textContent = 'Voltar para Início';
        returnBtn.onclick = () => window.location.href = 'index.html';
        successMessage.appendChild(returnBtn);
    }
}

// ====== STATISTICS DASHBOARD ======
function displayStatistics() {
    try {
        const denuncias = JSON.parse(localStorage.getItem('denuncias') || '[]');
        
        if (denuncias.length === 0) return;
        
        // Calculate statistics
        const stats = {
            total: denuncias.length,
            tipoAbusoCount: {},
            frequenciaCount: {},
            tipoEmpresaCount: {},
            setorEconomiaCount: {}
        };
        
        denuncias.forEach(denuncia => {
            // Type of abuse
            if (denuncia.tipoAbuso && Array.isArray(denuncia.tipoAbuso)) {
                denuncia.tipoAbuso.forEach(tipo => {
                    stats.tipoAbusoCount[tipo] = (stats.tipoAbusoCount[tipo] || 0) + 1;
                });
            }
            
            // Frequency
            if (denuncia.frequencia) {
                stats.frequenciaCount[denuncia.frequencia] = 
                    (stats.frequenciaCount[denuncia.frequencia] || 0) + 1;
            }
            
            // Company type
            if (denuncia.tipoEmpresa) {
                stats.tipoEmpresaCount[denuncia.tipoEmpresa] = 
                    (stats.tipoEmpresaCount[denuncia.tipoEmpresa] || 0) + 1;
            }
            
            // Economic sector
            if (denuncia.setorEconomia) {
                stats.setorEconomiaCount[denuncia.setorEconomia] = 
                    (stats.setorEconomiaCount[denuncia.setorEconomia] || 0) + 1;
            }
        });
        
        return stats;
    } catch (error) {
        console.error('Erro ao calcular estatísticas:', error);
        return null;
    }
}

// ====== FORM FIELD VALIDATION ======
const requiredFields = document.querySelectorAll('[required]');

requiredFields.forEach(field => {
    field.addEventListener('blur', function () {
        if (!this.value.trim()) {
            this.style.borderColor = '#e74c3c';
            this.style.backgroundColor = '#fadbd8';
        } else {
            this.style.borderColor = '#bdc3c7';
            this.style.backgroundColor = 'white';
        }
    });
});

// ====== COPY TO CLIPBOARD FUNCTIONALITY ======
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copiado para a área de transferência!');
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Copiado para a área de transferência!');
}

// ====== EXPORT DATA (FOR DEMO) ======
function exportDenuncias() {
    try {
        const denuncias = JSON.parse(localStorage.getItem('denuncias') || '[]');
        const dataStr = JSON.stringify(denuncias, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'denuncias_' + new Date().toISOString().split('T')[0] + '.json';
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Erro ao exportar dados:', error);
    }
}

// ====== PREVENT ACCIDENTAL NAVIGATION ======
let formModified = false;

if (denunciaForm) {
    denunciaForm.addEventListener('change', () => {
        formModified = true;
    });
    
    window.addEventListener('beforeunload', (e) => {
        if (formModified && denunciaForm.style.display !== 'none') {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });
}

// ====== ACCESSIBILITY IMPROVEMENTS ======
document.addEventListener('keydown', (e) => {
    // Skip to main content (Alt+M)
    if (e.altKey && e.code === 'KeyM') {
        const mainContent = document.querySelector('.content') || document.querySelector('main');
        if (mainContent) {
            mainContent.tabIndex = -1;
            mainContent.focus();
        }
    }
});

// ====== PERFORMANCE: LAZY LOAD IMAGES ======
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ====== INITIALIZE ======
document.addEventListener('DOMContentLoaded', () => {
    console.log('Segurança do Trabalho - Site carregado com sucesso');
    
    // Check if localStorage is available
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
    } catch (e) {
        console.warn('LocalStorage não disponível. Dados não serão persistidos.');
    }
});

// ====== ANALYTICS (SIMPLE) ======
function trackPageView() {
    try {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageViews = JSON.parse(localStorage.getItem('pageViews') || '{}');
        pageViews[currentPage] = (pageViews[currentPage] || 0) + 1;
        localStorage.setItem('pageViews', JSON.stringify(pageViews));
    } catch (error) {
        // Silent fail
    }
}

trackPageView();

// ====== PASSWORD STRENGTH INDICATOR (IF NEEDED) ======
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return strength;
}

// ====== MESSAGE DISPLAY UTILITY ======
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// ====== ADD ANIMATION STYLES ======
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ====== DARKMODE TOGGLE (OPTIONAL) ======
function initDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (prefersDark.matches) {
        // Optional: Add dark mode styles
        console.log('Dark mode preferred by user');
    }
}

initDarkMode();

// ====== SOCIAL SHARE FUNCTIONALITY ======
function shareOnSocialMedia(platform, message) {
    const encodedMessage = encodeURIComponent(message);
    let url = '';
    
    switch(platform) {
        case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${window.location.href}`;
            break;
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
            break;
        case 'whatsapp':
            url = `https://wa.me/?text=${encodedMessage}`;
            break;
    }
    
    if (url) {
        window.open(url, '_blank', 'width=600,height=400');
    }
}
