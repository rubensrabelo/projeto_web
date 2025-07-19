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

    cursos.forEach(curso => {
      const item = document.createElement("div");
      item.className = "disciplina";
      item.innerHTML = `
        <h3>${curso.name}</h3>
        <p><strong>Horário:</strong> ${curso.classSchedule || "N/A"}</p>
      `;
      lista.appendChild(item);
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
