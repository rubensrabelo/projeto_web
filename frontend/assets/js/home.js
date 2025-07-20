document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) return window.location.href = "../../index.html";

  try {
    const res = await fetch("http://localhost:3000/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const nomeProf = data.firstname || "Professor";
    document.getElementById("boasVindas").textContent = `Bem-vindo, ${nomeProf}!`;

    const cursosRes = await fetch("http://localhost:3000/courses/teacher", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const cursos = await cursosRes.json();

    const lista = document.getElementById("listaDisciplinas");
    lista.innerHTML = "";

    cursos.forEach(curso => {
      const divDisciplina = document.createElement("div");
      divDisciplina.className = "disciplina";

      const link = document.createElement("a");
      link.href = `secoes.html?id=${curso._id}`;
      link.className = "link-disciplina";
      link.innerHTML = `
        <h3>${curso.name}</h3>
        <p><strong>Horário:</strong> ${curso.classSchedule || "N/A"}</p>
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
