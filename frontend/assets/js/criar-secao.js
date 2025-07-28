document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return window.location.href = "../../index.html";
  }

  // Carregar dados do usuário para o cabeçalho
  try {
    const userRes = await fetch("http://localhost:3000/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (userRes.ok) {
      const userData = await userRes.json();
      const nomeProf = userData.firstname || "Professor(a)";
      const userNameSpan = document.querySelector('.user-info span');
      if (userNameSpan) userNameSpan.textContent = `Olá, ${nomeProf}!`;
    }
  } catch (err) {
    console.error("Erro ao carregar dados do usuário:", err);
  }

  // Submissão do formulário
  const form = document.getElementById("createSectionForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("sectionName").value.trim();
    const submissionLimitRaw = document.getElementById("submissionLimit").value;
    const type = document.getElementById("sectionType").value;
    const dueDateTimeRaw = document.getElementById("dueDateTime").value;

    if (!title || !type) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Ajusta submissionLimit: 0 significa sem limite, que pode ser tratado como Infinity ou null no backend
    const submissionLimit = submissionLimitRaw === "0" ? 0 : Number(submissionLimitRaw);

    // Converte a data de string para objeto Date ou undefined se vazio
    const dueDateTime = dueDateTimeRaw ? new Date(dueDateTimeRaw) : undefined;

    // Obter ID da disciplina da URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("disciplineId");
    if (!courseId) {
      alert("ID da disciplina não encontrado na URL. Não é possível criar a seção.");
      return;
    }

    // Monta o payload
    const payload = {
      title,
      type,
      submissionLimit,
      course: courseId,
    };
    if (dueDateTime) {
      payload.dueDateTime = dueDateTime.toISOString();
    }

    try {
      const res = await fetch(`http://localhost:3000/topics/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Seção criada com sucesso!");
        form.reset();
        window.location.href = `disciplina-detalhe-home.html?id=${courseId}`;
      } else {
        const errorData = await res.json();
        alert(`Erro ao criar seção: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      console.error("Erro na requisição de criação de seção:", err);
      alert("Erro de comunicação com o servidor ao criar seção.");
    }
  });
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}
