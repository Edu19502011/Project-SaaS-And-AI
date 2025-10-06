// InsightAI - Main JavaScript
class InsightAI {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.initializeAnimations();
    }

    init() {
        this.currentPage = this.getCurrentPage();
        this.isLoggedIn = false;
        this.userData = null;
        this.charts = {};
        this.aiModels = {
            'text-davinci-003': 'GPT-3.5 Turbo',
            'gpt-4': 'GPT-4',
            'claude-v1': 'Claude v1',
            'gemini-pro': 'Gemini Pro'
        };
        
        // Dados mockados para demonstração
        this.mockData = {
            analytics: {
                totalUsers: 12543,
                activeUsers: 8921,
                revenue: 485720,
                growth: 23.5
            },
            chartData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun'],
                datasets: [
                    {
                        label: 'Usuários',
                        data: [1200, 1900, 3000, 5000, 4200, 6100],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Receita',
                        data: [24000, 38000, 60000, 100000, 84000, 122000],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                    }
                ]
            }
        };
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('dashboard')) return 'dashboard';
        if (path.includes('ai-text')) return 'ai-text';
        if (path.includes('data-analysis')) return 'data-analysis';
        if (path.includes('reports')) return 'reports';
        if (path.includes('pricing')) return 'pricing';
        if (path.includes('settings')) return 'settings';
        return 'index';
    }

    setupEventListeners() {
        // Navegação móvel
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Botões de ação
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action]')) {
                this.handleAction(e.target.dataset.action, e.target);
            }
        });

        // Scroll suave
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-scroll]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.dataset.scroll);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        // Animações ao rolar
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);

        // Observar elementos com animação
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    initializeAnimations() {
        // Animações iniciais da página
        anime({
            targets: '.animate-fade-in',
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeOutQuad'
        });

        // Animação de digitação
        const typedElement = document.getElementById('typed-text');
        if (typedElement && typeof Typed !== 'undefined') {
            new Typed('#typed-text', {
                strings: ['insights inteligentes', 'decisões estratégicas', 'resultados excepcionais'],
                typeSpeed: 80,
                backSpeed: 50,
                backDelay: 2000,
                loop: true
            });
        }

        // Animação de números
        this.animateNumbers();
    }

    animateNumbers() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        });
    }

    handleAction(action, element) {
        switch (action) {
            case 'login':
                this.showLogin();
                break;
            case 'register':
                this.showRegister();
                break;
            case 'logout':
                this.logout();
                break;
            case 'generate-text':
                this.generateText();
                break;
            case 'analyze-data':
                this.analyzeData();
                break;
            case 'export-report':
                this.exportReport();
                break;
            case 'save-settings':
                this.saveSettings();
                break;
            default:
                console.log('Ação não reconhecida:', action);
        }
    }

    // Sistema de autenticação
    showLogin() {
        this.showModal('login-modal', this.getLoginHTML());
    }

    showRegister() {
        this.showModal('register-modal', this.getRegisterHTML());
    }

    logout() {
        this.isLoggedIn = false;
        this.userData = null;
        this.showNotification('Logout realizado com sucesso!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    // Modal system
    showModal(id, content) {
        const existingModal = document.getElementById(id);
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = content;
        document.body.appendChild(modal);

        // Animação de entrada
        anime({
            targets: modal,
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });

        anime({
            targets: modal.querySelector('.modal-content'),
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 400,
            easing: 'easeOutBack'
        });
    }

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            anime({
                targets: modal,
                opacity: [1, 0],
                duration: 200,
                easing: 'easeInQuad',
                complete: () => modal.remove()
            });
        }
    }

    // IA Texto functionality
    async generateText() {
        const prompt = document.getElementById('text-prompt')?.value;
        const style = document.querySelector('.style-card.selected')?.dataset.style || 'professional';
        const model = document.getElementById('model-select')?.value || 'text-davinci-003';

        if (!prompt) {
            this.showNotification('Por favor, insira um prompt!', 'error');
            return;
        }

        const generateBtn = document.querySelector('[data-action="generate-text"]');
        const originalText = generateBtn.textContent;
        generateBtn.textContent = 'Gerando...';
        generateBtn.disabled = true;

        // Mostrar indicador de carregamento
        this.showLoadingIndicator();

        try {
            // Simular chamada à API da IA
            await this.simulateAPICall(2000);
            
            const generatedText = this.generateMockText(prompt, style);
            this.displayGeneratedText(generatedText);
            this.showNotification('Texto gerado com sucesso!', 'success');
        } catch (error) {
            this.showNotification('Erro ao gerar texto. Tente novamente.', 'error');
        } finally {
            generateBtn.textContent = originalText;
            generateBtn.disabled = false;
            this.hideLoadingIndicator();
        }
    }

    generateMockText(prompt, style) {
        const templates = {
            professional: `Analisando o contexto fornecido, é fundamental abordar esta questão com a devida profissionalidade e rigor metodológico. ${prompt} requer uma análise cuidadosa considerando todos os fatores envolvidos e as melhores práticas do setor.`,
            
            casual: `E aí! Sobre ${prompt}, achei super interessante! Acho que vale a pena explorar mais esse tema, né? Tem muito potencial e pode ser abordado de várias formas criativas.`,
            
            technical: `Do ponto de vista técnico, ${prompt} apresenta características complexas que requerem análise detalhada. Os parâmetros envolvidos incluem: métricas de performance, indicadores de qualidade e requisitos de implementação.`,
            
            creative: `Em um mundo onde ${prompt} se transforma em possibilidade infinita, cada palavra dança ao ritmo da imaginação. A criatividade flui como rio de inspiração, moldando realidades e construindo sonhos.`,
            
            academic: `A presente análise aborda ${prompt} sob a perspectiva teórica e empírica, considerando as contribuições da literatura especializada e as evidências disponíveis. O estudo revela aspectos significativos que merecem atenção acadêmica.`
        };

        return templates[style] || templates.professional;
    }

    displayGeneratedText(text) {
        const output = document.getElementById('generated-text');
        if (output) {
            output.innerHTML = `
                <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="text-sm font-semibold text-slate-300">Texto Gerado</h4>
                        <button onclick="insightAI.copyToClipboard()" class="text-blue-400 hover:text-blue-300 text-sm">
                            <i class="fas fa-copy mr-1"></i> Copiar
                        </button>
                    </div>
                    <p class="text-slate-200 leading-relaxed">${text}</p>
                </div>
            `;
            output.classList.remove('hidden');
        }
    }

    // Dashboard functionality
    initializeDashboard() {
        this.createCharts();
        this.updateDashboardStats();
        this.setupRealTimeUpdates();
    }

    createCharts() {
        // Gráfico de linha
        const ctx1 = document.getElementById('analytics-chart');
        if (ctx1 && typeof Chart !== 'undefined') {
            this.charts.analytics = new Chart(ctx1, {
                type: 'line',
                data: this.mockData.chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#ffffff' }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#94a3b8' },
                            grid: { color: '#334155' }
                        },
                        y: {
                            ticks: { color: '#94a3b8' },
                            grid: { color: '#334155' }
                        }
                    }
                }
            });
        }

        // Gráfico de pizza
        const ctx2 = document.getElementById('pie-chart');
        if (ctx2 && typeof Chart !== 'undefined') {
            this.charts.pie = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['Desktop', 'Mobile', 'Tablet'],
                    datasets: [{
                        data: [65, 25, 10],
                        backgroundColor: ['#6366f1', '#3b82f6', '#8b5cf6']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#ffffff' }
                        }
                    }
                }
            });
        }
    }

    updateDashboardStats() {
        const stats = this.mockData.analytics;
        
        // Atualizar contadores
        const elements = {
            'total-users': stats.totalUsers,
            'active-users': stats.activeUsers,
            'total-revenue': `R$ ${stats.revenue.toLocaleString()}`,
            'growth-rate': `${stats.growth}%`
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    setupRealTimeUpdates() {
        // Simular atualizações em tempo real
        setInterval(() => {
            this.updateRealTimeData();
        }, 5000);
    }

    updateRealTimeData() {
        // Atualizar dados aleatórios para demonstração
        const activeUsers = document.getElementById('active-users');
        if (activeUsers) {
            const currentValue = parseInt(activeUsers.textContent.replace(/,/g, ''));
            const variation = Math.floor(Math.random() * 20) - 10;
            const newValue = Math.max(0, currentValue + variation);
            activeUsers.textContent = newValue.toLocaleString();
        }
    }

    // Utilitários
    copyToClipboard() {
        const text = document.querySelector('#generated-text p')?.textContent;
        if (text && navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Texto copiado para a área de transferência!', 'success');
            });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
            type === 'success' ? 'bg-green-600' :
            type === 'error' ? 'bg-red-600' :
            type === 'warning' ? 'bg-yellow-600' :
            'bg-blue-600'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        anime({
            targets: notification,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });

        setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, 300],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuad',
                complete: () => notification.remove()
            });
        }, 3000);
    }

    showLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'loading-indicator';
        indicator.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        indicator.innerHTML = `
            <div class="bg-slate-800 rounded-lg p-6 flex items-center space-x-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span class="text-white">Processando...</span>
            </div>
        `;
        document.body.appendChild(indicator);
    }

    hideLoadingIndicator() {
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    async simulateAPICall(delay = 1000) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // Modal HTML templates
    getLoginHTML() {
        return `
            <div class="modal-content bg-slate-800 rounded-lg p-8 max-w-md w-full mx-4">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold gradient-text-primary">Entrar</h2>
                    <button onclick="insightAI.closeModal('login-modal')" class="text-slate-400 hover:text-white">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form onsubmit="event.preventDefault(); insightAI.handleLogin();">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <input type="email" id="login-email" class="input-modern w-full px-4 py-3 rounded-lg" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Senha</label>
                            <input type="password" id="login-password" class="input-modern w-full px-4 py-3 rounded-lg" required>
                        </div>
                        <button type="submit" class="btn-primary w-full py-3 rounded-lg font-semibold">
                            Entrar
                        </button>
                    </div>
                </form>
                <p class="text-center text-slate-400 mt-4">
                    Não tem uma conta? 
                    <button onclick="insightAI.closeModal('login-modal'); insightAI.showRegister();" class="text-blue-400 hover:text-blue-300">
                        Cadastre-se
                    </button>
                </p>
            </div>
        `;
    }

    getRegisterHTML() {
        return `
            <div class="modal-content bg-slate-800 rounded-lg p-8 max-w-md w-full mx-4">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold gradient-text-primary">Cadastrar</h2>
                    <button onclick="insightAI.closeModal('register-modal')" class="text-slate-400 hover:text-white">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form onsubmit="event.preventDefault(); insightAI.handleRegister();">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Nome</label>
                            <input type="text" id="register-name" class="input-modern w-full px-4 py-3 rounded-lg" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <input type="email" id="register-email" class="input-modern w-full px-4 py-3 rounded-lg" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Senha</label>
                            <input type="password" id="register-password" class="input-modern w-full px-4 py-3 rounded-lg" required>
                        </div>
                        <button type="submit" class="btn-primary w-full py-3 rounded-lg font-semibold">
                            Cadastrar
                        </button>
                    </div>
                </form>
                <p class="text-center text-slate-400 mt-4">
                    Já tem uma conta? 
                    <button onclick="insightAI.closeModal('register-modal'); insightAI.showLogin();" class="text-blue-400 hover:text-blue-300">
                        Entre
                    </button>
                </p>
            </div>
        `;
    }

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simular autenticação
        if (email && password) {
            this.isLoggedIn = true;
            this.userData = { email, name: 'Usuário' };
            this.closeModal('login-modal');
            this.showNotification('Login realizado com sucesso!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
    }

    handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        if (name && email && password) {
            this.closeModal('register-modal');
            this.showNotification('Cadastro realizado com sucesso!', 'success');
            setTimeout(() => {
                this.showLogin();
            }, 1500);
        }
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
        }
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.insightAI = new InsightAI();
    
    // Inicializar funcionalidades específicas da página
    if (window.insightAI.currentPage === 'dashboard') {
        window.insightAI.initializeDashboard();
    }
});

// Funções globais para uso nos HTMLs
function showLogin() {
    window.insightAI.showLogin();
}

function showRegister() {
    window.insightAI.showRegister();
}

function scrollToDemo() {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleMobileMenu() {
    window.insightAI.toggleMobileMenu();
}