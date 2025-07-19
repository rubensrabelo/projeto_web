document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "../../index.html";
    return;
  }

  try {
    const resUser = await fetch("http://localhost:3000/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = await resUser.json();
    document.getElementById("boasVindas").textContent = `Bem-vindo, ${user.firstname}!`;
  } catch {
    alert("Erro ao carregar usuário.");
  }
});

document.getElementById("formSecao").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "../../index.html";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");
  if (!courseId) {
    alert("ID da disciplina não fornecido.");
    window.location.href = "home.html";
    return;
  }

  const titulo = document.getElementById("titulo").value.trim();
  const tipo = document.getElementById("tipo").value;
  const dueDateTimeInput = document.getElementById("dueDateTime").value;
  const submissionLimitInput = document.getElementById("submissionLimit").value;

  if (!titulo || !tipo) {
    alert("Por favor, preencha os campos obrigatórios.");
    return;
  }

  const payload = {
    title: titulo,
    type: tipo,
    course: courseId,
  };

  if (dueDateTimeInput) payload.dueDateTime = new Date(dueDateTimeInput).toISOString();
  if (submissionLimitInput) payload.submissionLimit = parseInt(submissionLimitInput);

  try {
    const res = await fetch(`http://localhost:3000/topics/${courseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erro ao criar seção.");
    }

    alert("Seção criada com sucesso!");
    window.location.href = `secoes.html?id=${courseId}`;
  } catch (err) {
    alert("Erro: " + err.message);
  }
});

function voltar() {
  const courseId = new URLSearchParams(window.location.search).get("id");
  window.location.href = `secoes.html?id=${courseId}`;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}
