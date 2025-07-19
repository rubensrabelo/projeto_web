document.getElementById("formDisciplina").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "../../index.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: nome })
    });

    if (!res.ok) throw new Error("Erro ao criar disciplina.");

    alert("Disciplina criada com sucesso!");
    window.location.href = "home.html";
  } catch (err) {
    alert("Erro ao criar disciplina.");
  }
});

function voltar() {
  window.location.href = "home.html";
}
