document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return window.location.href = "../../index.html"; // Redireciona se não houver token
    }

    // --- Obter ID da Disciplina da URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const disciplinaId = urlParams.get('id'); // Este é o ID passado
    window.currentDisciplineId = disciplinaId; // Torna o ID globalmente acessível

    // Defina um objeto de dados padrão para a disciplina
    let disciplinaData = {
        name: 'Disciplina Desconhecida', // Título padrão
        // Outras propriedades padrão se necessário
    };

    if (!disciplinaId) {
        console.warn("ID da disciplina não encontrado na URL. Carregando página com dados padrão.");
        // Não redirecionamos ou damos alert aqui, apenas usamos o padrão.
    }

    try {
        // --- Carregar informações do usuário (para "Olá, Professor(a)!") ---
        const userRes = await fetch("http://localhost:3000/users/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userRes.json();
        const nomeProf = userData.firstname || "Professor(a)";
        
        const userNameHeaderSpan = document.querySelector('.user-info span');
        if (userNameHeaderSpan) {
            userNameHeaderSpan.innerText = `Olá, ${nomeProf}!`;
        }

        // --- Tentar Carregar dados da Disciplina Específica ---
        if (disciplinaId) { // Só tenta buscar se um ID foi fornecido
            const disciplinaRes = await fetch(`http://localhost:3000/courses/${disciplinaId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (disciplinaRes.ok) { // Se a resposta for OK (200-299)
                disciplinaData = await disciplinaRes.json(); // Atribui os dados reais
            } else {
                console.error(`Erro ao carregar disciplina (Status: ${disciplinaRes.status}):`, await disciplinaRes.text());
                // Permite que o código continue usando disciplinaData padrão
                // alert("Erro ao carregar detalhes da disciplina. Exibindo dados padrão."); // Opcional: manter um alert mais suave
            }
        }

    } catch (err) {
        console.error("Erro na requisição de dados da disciplina ou usuário:", err);
        // Permite que o código continue usando disciplinaData padrão
        // alert("Erro de comunicação. Exibindo dados padrão."); // Opcional: manter um alert mais suave
    } finally {
        // Este bloco 'finally' garante que o preenchimento do HTML sempre aconteça
        // independentemente de erros no fetch.

        // Preencher o nome da disciplina no HTML
        const backButton = document.querySelector('.discipline-detail-header .back-button');
        if (backButton) {
            backButton.innerHTML = `
                <i class="fas fa-chevron-left"></i> ${disciplinaData.name || 'Disciplina'}
            `;
        }
        
        const mainTitle = document.querySelector('.discipline-main-title');
        if (mainTitle) {
            mainTitle.textContent = disciplinaData.name || 'Disciplina';
        }

        // --- (Opcional) Lógica para carregar e renderizar Avisos, Assuntos, Tópicos ---
        // Se você tiver dados aninhados em 'disciplinaData' ou quiser chamar outras funções de fetch aqui,
        // use 'disciplinaData' ou 'disciplinaId' para carregar esses dados.
        // Se não houver dados reais, as seções ficarão vazias ou mostrarão os exemplos estáticos do HTML.

        // Exemplo: Renderizar tópicos dinamicamente (se você tiver essa lógica e dados no 'disciplinaData')
        /*
        const topicSectionCard = document.querySelector('.detail-section-card:nth-of-type(3) .section-items-list');
        if (topicSectionCard) {
            topicSectionCard.innerHTML = ''; // Limpar conteúdo estático
            if (disciplinaData.topics && disciplinaData.topics.length > 0) {
                disciplinaData.topics.forEach(topic => {
                    const listItem = document.createElement('li');
                    listItem.className = 'section-item';
                    listItem.innerHTML = `
                        <div class="item-info">
                            <i class="${topic.iconClass || 'fas fa-file'} section-item-icon"></i>
                            <span class="item-text">${topic.title}</span>
                        </div>
                        <button class="item-action-button" onclick="goToTopicDetail('${topic._id}')">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    `;
                    topicSectionCard.appendChild(listItem);
                });
            } else {
                topicSectionCard.innerHTML = '<li class="section-item"><span class="item-text" style="color:#666;">Nenhum tópico adicionado ainda.</span></li>';
            }
        }
        */
    }
}); // Fim do DOMContentLoaded

// Funções de navegação (já existentes)
function goToTopicDetail(topicId) {
    console.log(`Navigating to topic detail for ID: ${topicId}`);
    alert(`Você clicou no tópico com ID: ${topicId}`);
    // window.location.href = `topico-detalhe.html?id=${topicId}`;
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "../../index.html";
}