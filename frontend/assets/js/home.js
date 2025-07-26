document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) return window.location.href = "../../index.html";

  try {
    const res = await fetch("http://localhost:3000/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const nomeProf = data.firstname || "Professor";
    // Ajustado para usar innerText para segurança e compatibilidade
    document.getElementById("boasVindas").innerText = `Olá, ${nomeProf}!`; 

    const cursosRes = await fetch("http://localhost:3000/courses/teacher", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const cursos = await cursosRes.json();

    const lista = document.getElementById("listaDisciplinas");
    lista.innerHTML = ""; // Limpa o conteúdo antes de adicionar

    if (cursos.length === 0) {
        lista.innerHTML = '<p style="text-align: center; color: #666;">Nenhuma disciplina cadastrada ainda.</p>';
        return;
    }

    cursos.forEach(curso => {
      const divDisciplina = document.createElement("div");
      divDisciplina.className = "disciplina"; // Corresponde ao nosso CSS

      const link = document.createElement("a");
      link.href = `disciplina-detalhe-home.html?id=${curso._id}`;
      link.className = "link-disciplina"; // Corresponde ao nosso CSS
      link.innerHTML = `
        <div class="card-icon">
            <i class="fas fa-bookmark"></i>
        </div>
        <h3>${curso.name}</h3>
        <p><strong>Horário:</strong> ${curso.classSchedule || "N/A"}</p>
        <button class="card-button">Entrar na disciplina</button>
      `;

      divDisciplina.appendChild(link);
      lista.appendChild(divDisciplina);
    });
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar dados.");
  }
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}
