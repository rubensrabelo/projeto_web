document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return window.location.href = "../../index.html"; // Redireciona se não houver token
    }

    // Opcional: Obter o ID da tarefa/envio da URL
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskId'); // Exemplo de parâmetro

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

        // --- Carregar Dados da Tarefa/Envio (Simulação) ---
        // Você faria uma requisição ao seu backend para obter os dados da tarefa
        // Ex: const taskRes = await fetch(`http://localhost:3000/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
        // const taskData = await taskRes.json();

        // Dados de exemplo (substitua pela chamada ao backend)
        const taskData = {
            statusEnvio: "Aguardando envio...",
            statusAvaliacao: "Não há notas.",
            dataEntrega: "Quinta, 13 Jul 2025, 23:58",
            tempoRestante: "7 dias, 2 horas e 41 minutos",
            ultimaModificacao: "Há 2 horas atrás",
            arquivoEnvio: "tarefa_02.pdf",
            comentarios: "Nenhum comentário"
        };

        // Preencher os campos no HTML
        document.querySelector('.info-item:nth-child(1) .info-value').textContent = taskData.statusEnvio;
        document.querySelector('.info-item:nth-child(2) .info-value').textContent = taskData.statusAvaliacao;
        document.querySelector('.info-item:nth-child(3) .info-value').textContent = taskData.dataEntrega;
        document.querySelector('.info-item:nth-child(4) .info-value').textContent = taskData.tempoRestante;
        document.querySelector('.info-item:nth-child(5) .info-value').textContent = taskData.ultimaModificacao;
        document.querySelector('.info-item:nth-child(6) .info-value').textContent = taskData.arquivoEnvio;
        document.querySelector('.info-item:nth-child(7) .info-value').textContent = taskData.comentarios;

        // Adicionar listener para o link do arquivo (se clicável)
        const fileLink = document.querySelector('.info-value.file-link');
        if (fileLink) {
            fileLink.addEventListener('click', () => {
                alert(`Baixando arquivo: ${taskData.arquivoEnvio}`);
                // Implementar lógica de download aqui (ex: window.open(url_do_arquivo, '_blank');)
            });
        }

    } catch (err) {
        console.error("Erro ao carregar dados da visualização de envio:", err);
        alert("Erro ao carregar detalhes do envio.");
    }
});

function logout() {
    localStorage.removeItem("token");
    window.location.href = "../../index.html";
}

// Funções para os botões inferiores (Acompanhar entregas, Modificar tópico)
// Elas devem ser implementadas com a lógica de navegação ou ação real
// O onclick no HTML já chama alert para fins de demonstração