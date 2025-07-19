document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "../../index.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const user = await res.json();
    document.getElementById("boasVindas").textContent = `Bem-vindo, ${user.firstname}!`;

    buscarDisciplinas();
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar dados do usuário.");
  }
});

async function buscarDisciplinas() {
  const termo = document.getElementById("campoBusca").value.trim();
  const token = localStorage.getItem("token");
  const container = document.getElementById("resultados");

  container.innerHTML = "<p>Carregando...</p>";

  try {
    const res = await fetch(`http://localhost:3000/courses/search${termo ? `?name=${encodeURIComponent(termo)}` : ""}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Erro ao buscar disciplinas.");

    const cursos = await res.json();

    if (!cursos.length) {
      container.innerHTML = "<p>Nenhuma disciplina encontrada.</p>";
      return;
    }

    container.innerHTML = cursos.map(curso => `
      <div class="disciplina">
        <h3>${curso.name}</h3>
        <a href="secoes.html?id=${curso._id}">Ver Seções</a>
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Erro ao carregar disciplinas.</p>";
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}
