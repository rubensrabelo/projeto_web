document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "../../index.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/courses/teacher", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Erro ao buscar disciplinas.");

    const disciplinas = await res.json();
    const lista = document.getElementById("listaDisciplinas");
    lista.innerHTML = "";

    disciplinas.forEach(d => {
      const li = document.createElement("li");
      li.textContent = d.name;
      lista.appendChild(li);
    });
  } catch (err) {
    alert("Erro ao carregar disciplinas.");
  }
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}
