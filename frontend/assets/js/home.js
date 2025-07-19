document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "../../index.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/courses/teacher", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar disciplinas.");
    }

    const cursos = await res.json();
    const lista = document.getElementById("listaDisciplinas");

    if (cursos.length === 0) {
      lista.innerHTML = "<li>Nenhuma disciplina encontrada.</li>";
      return;
    }

    console.log(cursos[0])

    cursos.forEach(curso => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${curso.name}</strong><br/>
        <span>${curso.classSchedule || "Sem horário definido"}</span>
      `;
      lista.appendChild(li);
    });

  } catch (err) {
    alert("Erro: " + err.message);
  }
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}
