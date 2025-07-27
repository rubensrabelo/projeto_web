document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return window.location.href = "../../index.html";
    }

    const urlParams = new URLSearchParams(window.location.search);
    const disciplinaId = urlParams.get('id');
    window.currentDisciplineId = disciplinaId;

    let disciplinaData = {
        name: 'Disciplina Desconhecida',
    };

    if (!disciplinaId) {
        console.warn("ID da disciplina não encontrado na URL. Carregando página com dados padrão.");
    }

    try {
        // Carregar informações do usuário
        const userRes = await fetch("http://localhost:3000/users/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userRes.json();
        const nomeProf = userData.firstname || "Professor(a)";
        const userNameHeaderSpan = document.querySelector('.user-info span');
        if (userNameHeaderSpan) {
            userNameHeaderSpan.innerText = `Olá, ${nomeProf}!`;
        }

        // Carregar dados da disciplina
        if (disciplinaId) {
            const disciplinaRes = await fetch(`http://localhost:3000/courses/${disciplinaId}/teacher`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (disciplinaRes.ok) {
                disciplinaData = await disciplinaRes.json();
            } else {
                console.error(`Erro ao carregar disciplina (Status: ${disciplinaRes.status}):`, await disciplinaRes.text());
            }

            // Carregar avisos
            try {
                const avisosRes = await fetch(`http://localhost:3000/courses/${disciplinaId}/notices`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (avisosRes.ok) {
                    disciplinaData.notices = await avisosRes.json();
                } else {
                    disciplinaData.notices = [];
                }
            } catch (e) {
                disciplinaData.notices = [];
            }

            // Carregar assuntos
            try {
                const assuntosRes = await fetch(`http://localhost:3000/courses/${disciplinaId}/subjects`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (assuntosRes.ok) {
                    disciplinaData.subjects = await assuntosRes.json();
                } else {
                    disciplinaData.subjects = [];
                }
            } catch (e) {
                disciplinaData.subjects = [];
            }
        }

    } catch (err) {
        console.error("Erro na requisição de dados da disciplina ou usuário:", err);
    } finally {
        // Preencher o nome da disciplina
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

        // Renderizar avisos
        const noticeSectionCard = document.querySelector('.detail-section-card:nth-of-type(1) .section-items-list');
        if (noticeSectionCard) {
            noticeSectionCard.innerHTML = '';
            if (disciplinaData.notices && disciplinaData.notices.length > 0) {
                disciplinaData.notices.forEach(notice => {
                    const listItem = document.createElement('li');
                    listItem.className = 'section-item';
                    listItem.innerHTML = `
                        <div class="item-info">
                            <i class="fas fa-bullhorn section-item-icon"></i>
                            <span class="item-text">${notice.title || 'Aviso'}</span>
                        </div>
                    `;
                    noticeSectionCard.appendChild(listItem);
                });
            } else {
                noticeSectionCard.innerHTML = '<li class="section-item"><span class="item-text" style="color:#666;">Nenhum aviso adicionado ainda.</span></li>';
            }
        }

        // Renderizar assuntos
        const subjectSectionCard = document.querySelector('.detail-section-card:nth-of-type(2) .section-items-list');
        if (subjectSectionCard) {
            subjectSectionCard.innerHTML = '';
            if (disciplinaData.subjects && disciplinaData.subjects.length > 0) {
                disciplinaData.subjects.forEach(subject => {
                    const listItem = document.createElement('li');
                    listItem.className = 'section-item';
                    listItem.innerHTML = `
                        <div class="item-info">
                            <i class="fas fa-book section-item-icon"></i>
                            <span class="item-text">${subject.title || 'Assunto'}</span>
                        </div>
                    `;
                    subjectSectionCard.appendChild(listItem);
                });
            } else {
                subjectSectionCard.innerHTML = '<li class="section-item"><span class="item-text" style="color:#666;">Nenhum assunto adicionado ainda.</span></li>';
            }
        }

        // Renderizar tópicos
        const topicSectionCard = document.querySelector('.detail-section-card:nth-of-type(3) .section-items-list');
        if (topicSectionCard) {
            topicSectionCard.innerHTML = '';
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
    }
});

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