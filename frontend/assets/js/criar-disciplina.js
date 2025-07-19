document.getElementById("formDisciplina").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "../../index.html";
    return;
  }

  const nome = document.getElementById("nome").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const horario = document.getElementById("horario").value.trim();
  const quantidade = document.getElementById("quantidade").value.trim();

  const payload = {
    name: nome,
    description: descricao || undefined,
    classSchedule: horario || undefined,
    classQuantity: quantidade ? parseInt(quantidade) : undefined,
  };

  try {
    const res = await fetch("http://localhost:3000/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erro ao criar disciplina.");
    }

    alert("Disciplina criada com sucesso!");
    window.location.href = "home.html";
  } catch (err) {
    alert("Erro: " + err.message);
  }
});

function voltar() {
  window.location.href = "home.html";
}
