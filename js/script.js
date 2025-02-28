document.querySelectorAll('.btn-gradient-1').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left; // Posição X do cursor dentro do botão
        const y = e.clientY - rect.top;  // Posição Y do cursor dentro do botão
        button.style.setProperty('--mouse-x', `${x}px`);
        button.style.setProperty('--mouse-y', `${y}px`);
    });
});

const menuIcon = document.getElementById('menu-icon');
const menu = document.getElementById('menu');
const closeIcon = document.getElementById('close-icon');
const btnProjetos = document.querySelector('.btn-gradient-1');

function toggleMenu(isOpen) {
    menu.classList.toggle('active', isOpen);
    closeIcon.style.display = isOpen ? 'block' : 'none';
    menuIcon.style.display = isOpen ? 'none' : 'flex';
    
    // Adiciona ou remove a classe 'hidden' para o botão
    if (isOpen) {
        btnProjetos.classList.add('hidden');
    } else {
        setTimeout(() => {
            btnProjetos.classList.remove('hidden');
        }, 100); // O tempo deve corresponder à duração da transição
    }
}

menuIcon.addEventListener('click', () => toggleMenu(true));
closeIcon.addEventListener('click', () => toggleMenu(false));

document.addEventListener('DOMContentLoaded', () => {
    const aboutText = document.getElementById('about-text');
    const text = aboutText.textContent; // Captura o texto original
    aboutText.textContent = ''; // Limpa o texto para começar a digitar

    let index = 0;
    let isDeleting = false;
    let animationCompleted = false; // Variável para controlar se a animação já foi completada
    let isAnimating = false; // Variável para controlar se a animação está em andamento

    function debounce(func, delay) {
        let timer; // Variável para armazenar o ID do temporizador
        return function(...args) {
            clearTimeout(timer); // Limpa o temporizador anterior
            timer = setTimeout(() => {
                func.apply(this, args); // Chama a função original com o contexto e argumentos corretos
            }, delay);
        };
    }

    const debouncedTypeText = debounce(() => {
        if (index < text.length) {
            aboutText.textContent = text.substring(0, index + 1); // Adiciona uma letra
            index++;
            setTimeout(debouncedTypeText, 25); // Tempo para digitar
        } else {
            isDeleting = true; // Muda para modo de apagar
            setTimeout(debouncedDeleteText, 50); // Pausa antes de começar a apagar
        }
    }, 100); // Debounce para digitar

    const debouncedDeleteText = debounce(() => {
        if (index > 0) {
            aboutText.textContent = text.substring(0, index - 1); // Remove uma letra
            index--;
            setTimeout(debouncedDeleteText, 25); // Tempo para apagar
        } else {
            isDeleting = false; // Muda para modo de digitação
            animationCompleted = true; // Marca a animação como completada
            isAnimating = false; // Reseta o estado de animação
        }
    }, 100); // Debounce para apagar

    // Função para iniciar a animação
    function startAnimation() {
        if (isAnimating || animationCompleted) return; // Evita iniciar uma nova animação se já estiver em andamento ou se já foi completada
        isAnimating = true; // Marca a animação como em andamento
        index = 0; // Reseta o índice para reiniciar a animação
        debouncedTypeText(); // Inicia a digitação
    }

    // Inicia a digitação quando a seção about estiver visível
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            startAnimation(); // Inicia a animação ao entrar na seção
        }
    });

    observer.observe(aboutText); // Observa o elemento
});