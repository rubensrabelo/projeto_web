document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return window.location.href = "../../index.html"; // Redireciona se não houver token
    }

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

    // --- Obter ID da Tarefa/Tópico da URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskId'); // ID da tarefa/tópico
    
    if (!taskId) {
        alert("ID da tarefa não encontrado na URL. Não é possível acompanhar entregas.");
        return window.location.href = "disciplina-detalhe-home.html"; // Volta para a home da disciplina
    }

    let deliveriesData = []; // Para armazenar os dados das entregas

    // --- Carregar e Renderizar Entregas ---
    async function loadDeliveries() {
        const deliveriesListBody = document.getElementById("deliveriesList");
        deliveriesListBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666;">Carregando entregas...</td></tr>';

        try {
            // Supondo um endpoint para buscar entregas de uma tarefa específica
            // Ex: GET /tasks/:taskId/deliveries
            const res = await fetch(`http://localhost:3000/tasks/${taskId}/deliveries`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                if (res.status === 404) {
                    deliveriesListBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666;">Nenhuma entrega encontrada para esta tarefa.</td></tr>';
                    return;
                }
                throw new Error("Erro ao carregar entregas.");
            }

            deliveriesData = await res.json(); // Armazena os dados para manipulação
            renderDeliveriesTable(deliveriesData);

        } catch (err) {
            console.error("Erro ao carregar entregas:", err);
            deliveriesListBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #dc3545;">Erro ao carregar entregas.</td></tr>';
            alert("Erro ao carregar entregas.");
        }
    }

    function renderDeliveriesTable(deliveries) {
        const deliveriesListBody = document.getElementById("deliveriesList");
        deliveriesListBody.innerHTML = '';

        if (deliveries.length === 0) {
            deliveriesListBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666;">Nenhuma entrega encontrada.</td></tr>';
            return;
        }

        deliveries.forEach(delivery => {
            const row = document.createElement("tr");
            row.dataset.deliveryId = delivery._id; // Armazena o ID da entrega na linha

            row.innerHTML = `
                <td>${delivery.studentName || 'Aluno(a)'}</td>
                <td>${delivery.evaluationStatus || 'Não avaliado'}</td>
                <td><a href="${delivery.fileUrl || '#'}" class="file-link" target="_blank">${delivery.fileName || 'N/A'}</a></td>
                <td>${delivery.comment || 'Nenhum comentário'}</td>
                <td class="grade-cell">
                    <span class="grade-value">${delivery.finalGrade !== undefined ? `${delivery.finalGrade}/10` : '0/10'}</span> 
                    <input type="number" class="grade-input" value="${delivery.finalGrade || ''}" min="0" max="10" style="display: none;">
                    <button class="edit-grade-button"><i class="fas fa-pencil-alt"></i></button>
                </td>
            `;
            deliveriesListBody.appendChild(row);
        });

        // Adiciona listeners para os botões de edição de nota
        addGradeEditListeners();
    }

    function addGradeEditListeners() {
        document.querySelectorAll('.edit-grade-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const gradeCell = event.target.closest('.grade-cell');
                const gradeValueSpan = gradeCell.querySelector('.grade-value');
                const gradeInput = gradeCell.querySelector('.grade-input');
                
                gradeValueSpan.style.display = 'none';
                gradeInput.style.display = 'inline-block';
                gradeInput.focus();
                button.style.display = 'none'; // Esconde o lápis ao editar
            });
        });

        document.querySelectorAll('.grade-input').forEach(input => {
            input.addEventListener('blur', (event) => { // Quando o input perde o foco
                const gradeCell = event.target.closest('.grade-cell');
                const gradeValueSpan = gradeCell.querySelector('.grade-value');
                const gradeInput = gradeCell.querySelector('.grade-input');
                const editButton = gradeCell.querySelector('.edit-grade-button');

                const newGrade = parseFloat(gradeInput.value);
                // Atualiza o valor no span e no dado em memória (deliveryData)
                const deliveryId = gradeCell.closest('tr').dataset.deliveryId;
                const delivery = deliveriesData.find(d => d._id === deliveryId);
                if (delivery) {
                    delivery.finalGrade = isNaN(newGrade) ? undefined : newGrade; // Armazena o número
                }
                
                gradeValueSpan.textContent = isNaN(newGrade) ? '0/10' : `${newGrade}/10`;
                
                gradeValueSpan.style.display = 'inline-block';
                gradeInput.style.display = 'none';
                editButton.style.display = 'inline-block'; // Mostra o lápis
            });

            input.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Evita que o formulário seja submetido
                    event.target.blur(); // Tira o foco do input, acionando o blur
                }
            });
        });
    }

    // --- Lógica de Salvar Notas ---
    const saveButton = document.querySelector('.form-actions-bottom-right .save-button');
    saveButton.addEventListener('click', async () => {
        // Coleta apenas as entregas que tiveram a nota modificada
        const modifiedDeliveries = deliveriesData.filter(delivery => {
            // Adicione uma lógica para verificar se a nota realmente mudou
            // Ex: delivery.finalGrade !== delivery.originalGrade
            return delivery.finalGrade !== undefined && delivery.originalGrade !== delivery.finalGrade; // Comparação simplificada
        });

        if (modifiedDeliveries.length === 0) {
            alert("Nenhuma nota foi modificada para salvar.");
            return;
        }

        try {
            // Iterar sobre as entregas modificadas e enviar para o backend
            // Pode ser um PUT para cada entrega ou um endpoint que aceite um array
            const updatePromises = modifiedDeliveries.map(delivery => {
                return fetch(`http://localhost:3000/deliveries/${delivery._id}/grade`, { // Ex: PATCH para /deliveries/:id/grade
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ finalGrade: delivery.finalGrade })
                });
            });

            const responses = await Promise.all(updatePromises);
            const allSuccess = responses.every(res => res.ok);

            if (allSuccess) {
                alert("Notas salvas com sucesso!");
                loadDeliveries(); // Recarrega para mostrar as notas atualizadas
            } else {
                alert("Algumas notas não puderam ser salvas. Verifique o console para detalhes.");
                responses.forEach(async (res, index) => {
                    if (!res.ok) {
                        const errorData = await res.json();
                        console.error(`Erro ao salvar nota para ${modifiedDeliveries[index].studentName}:`, errorData);
                    }
                });
            }

        } catch (error) {
            console.error("Erro ao salvar notas:", error);
            alert("Erro de comunicação ao salvar notas.");
        }
    });

    // Iniciar o carregamento das entregas
    loadDeliveries();
});

function logout() {
    localStorage.removeItem("token");
    window.location.href = "../../index.html";
}