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

    // --- Lógica de Dropzone de Arquivos ---
    const fileUploadDropzone = document.getElementById("fileUploadDropzone");
    const fileUploadInput = document.getElementById("fileUpload");
    let selectedFiles = []; // Para armazenar os arquivos selecionados

    // Abre o seletor de arquivos ao clicar no dropzone
    fileUploadDropzone.addEventListener('click', () => {
        fileUploadInput.click();
    });

    // Lida com a seleção de arquivos através do input
    fileUploadInput.addEventListener('change', (event) => {
        handleFiles(event.target.files);
    });

    // Lida com o arrastar sobre o dropzone
    fileUploadDropzone.addEventListener('dragover', (event) => {
        event.preventDefault();
        fileUploadDropzone.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-blue'); // Usa variável CSS
    });

    // Lida com a saída do arrastar do dropzone
    fileUploadDropzone.addEventListener('dragleave', () => {
        fileUploadDropzone.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--medium-gray-border'); // Usa variável CSS
    });

    // Lida com o soltar de arquivos no dropzone
    fileUploadDropzone.addEventListener('drop', (event) => {
        event.preventDefault();
        fileUploadDropzone.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--medium-gray-border'); // Usa variável CSS
        handleFiles(event.dataTransfer.files);
    });

    function handleFiles(files) {
        selectedFiles = [...files];
        if (selectedFiles.length > 0) {
            fileUploadDropzone.querySelector('p').textContent = `${selectedFiles.length} arquivo(s) selecionado(s)`;
        } else {
            fileUploadDropzone.querySelector('p').textContent = `Solte o arquivo aqui...`;
        }
        console.log("Arquivos selecionados para upload:", selectedFiles);
    }


    // --- Lógica de Submissão do Formulário de Criação de Sessão ---
    const createSessionForm = document.getElementById("createSessionForm"); // ID ajustado
    createSessionForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const sessionName = document.getElementById("sessionName").value.trim(); // ID ajustado
        const submissionLimit = document.getElementById("submissionLimit").value;
        const sessionType = document.getElementById("sessionType").value; // ID ajustado
        const submissionSize = document.getElementById("submissionSize").value.trim();
        const defineSchedule = document.getElementById("defineSchedule").value;
        const startDate = document.getElementById("startDate").value;
        const conclusionDate = document.getElementById("conclusionDate").value;
        const emailNotifications = document.getElementById("emailNotifications").checked;

        // Validação básica
        if (!sessionName || !sessionType || !defineSchedule || !startDate || !conclusionDate) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const formData = new FormData();
        formData.append('name', sessionName); // Nome ajustado
        formData.append('type', sessionType); // Tipo ajustado
        formData.append('schedule', defineSchedule);
        formData.append('startDate', startDate);
        formData.append('conclusionDate', conclusionDate);
        formData.append('submissionLimit', submissionLimit);
        formData.append('submissionSize', submissionSize);
        formData.append('emailNotifications', emailNotifications);

        selectedFiles.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });
        
        // Obter o ID da disciplina da URL para associar a sessão
        const urlParams = new URLSearchParams(window.location.search);
        const disciplineId = urlParams.get('disciplineId');

        if (!disciplineId) {
            alert("ID da disciplina não encontrado na URL. Não é possível criar a sessão.");
            return;
        }
        formData.append('disciplineId', disciplineId); // Adiciona o ID da disciplina ao payload

        try {
            // Endpoint para criar uma nova sessão
            const res = await fetch("http://localhost:3000/sessions", { // Exemplo: POST para /sessions
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                alert("Sessão criada com sucesso!");
                createSessionForm.reset();
                selectedFiles = [];
                fileUploadDropzone.querySelector('p').textContent = `Solte o arquivo aqui...`;
                window.location.href = `secoes.html?disciplineId=${disciplineId}`; // Volta para a lista de seções da disciplina
            } else {
                const errorData = await res.json();
                alert(`Erro ao criar sessão: ${errorData.message || res.statusText}`);
            }

        } catch (err) {
            console.error("Erro na requisição de criação de sessão:", err);
            alert("Erro de comunicação com o servidor ao criar sessão.");
        }
    });

}); // Fim do DOMContentLoaded

function logout() {
    localStorage.removeItem("token");
    window.location.href = "../../index.html";
}