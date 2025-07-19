document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const boasVindas = document.getElementById("boasVindas");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "../../index.html";
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id || payload.userId;

    const res = await fetch("http://localhost:3000/users/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Erro ao buscar usuário.");

    const user = await res.json();
    const nome = user.name || "Professor";

    if (boasVindas) {
      boasVindas.textContent = `Bem-vindo, ${nome}!`;
    }
  } catch (err) {
    console.error("Erro ao buscar nome do professor:", err);
  }

 const form = document.getElementById("formDisciplina");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

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

      window.location.href = "home.html";
    } catch (err) {
      alert("Erro: " + err.message);
    }
  });
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}
