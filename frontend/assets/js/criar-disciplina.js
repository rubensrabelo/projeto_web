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

    // --- Lógica de Submissão do Formulário de Criação de Disciplina ---
    const createDisciplineForm = document.getElementById("createDisciplineForm");
    createDisciplineForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const disciplineName = document.getElementById("disciplineName").value.trim();
        const weeklyClasses = document.getElementById("weeklyClasses").value;
        const disciplineCode = document.getElementById("disciplineCode").value;
        const selectProfessor = document.getElementById("selectProfessor").value;
        const professorEmail = document.getElementById("professorEmail").value.trim();
        const classSchedule = document.getElementById("classSchedule").value;

        // Validação básica (você pode adicionar mais validações)
        if (!disciplineName || !weeklyClasses || !disciplineCode || !selectProfessor || !professorEmail || !classSchedule) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const newDisciplineData = {
            name: disciplineName,
            weeklyClasses: parseInt(weeklyClasses), // Converter para número
            code: disciplineCode,
            professorId: selectProfessor, // Assumindo que o selectProfessor te dá um ID
            professorEmail: professorEmail,
            classSchedule: classSchedule
            // Você pode adicionar mais campos aqui, como a descrição, se adicionar um textarea no HTML
        };

        try {
            // Endpoint para criar uma nova disciplina
            const res = await fetch("http://localhost:3000/courses", { // Exemplo: POST para /courses
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newDisciplineData)
            });

            if (res.ok) {
                alert("Disciplina criada com sucesso!");
                // Opcional: Limpar o formulário ou redirecionar para a lista de disciplinas
                createDisciplineForm.reset(); // Limpa todos os campos do formulário
                window.location.href = "pesquisar-disciplina.html"; // Redireciona para a lista
            } else {
                const errorData = await res.json();
                alert(`Erro ao criar disciplina: ${errorData.message || res.statusText}`);
            }

        } catch (err) {
            console.error("Erro na requisição de criação de disciplina:", err);
            alert("Erro de comunicação com o servidor ao criar disciplina.");
        }
    });

    // --- Funções Auxiliares (Ex: Carregar Professores, Horários, etc.) ---
    // Você pode ter funções aqui para popular os selects dinamicamente
    async function loadProfessors() {
      // Ex: fetch('http://localhost:3000/professors') e preencher #selectProfessor
    }
    // loadProfessors(); // Chame esta função se precisar popular o select de professores

}); // Fim do DOMContentLoaded

function logout() {
    localStorage.removeItem("token");
    window.location.href = "../../index.html";
}