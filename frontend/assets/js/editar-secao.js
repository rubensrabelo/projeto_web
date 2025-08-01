document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  const topicId = urlParams.get("id");

  if (!token || !topicId) {
    alert("Você precisa estar logado e ter selecionado uma seção.");
    window.location.href = "home.html";
    return;
  }

  let courseId = null;

  try {
    const res = await fetch(`http://localhost:3000/topics/${topicId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Não foi possível carregar a seção.");

    const topic = await res.json();

    courseId = topic.course;

    document.getElementById("title").value = topic.title;
    document.getElementById("type").value = topic.type;

    if (topic.dueDateTime) {
      const dt = new Date(topic.dueDateTime);
      const isoLocal = dt.toISOString().slice(0, 16);
      document.getElementById("dueDateTime").value = isoLocal;
    }

    document.getElementById("submissionLimit").value = topic.submissionLimit || 1;
    document.getElementById("description").value = topic.description || "";

  } catch (err) {
    alert("Erro ao carregar a seção.");
  }

  document.getElementById("formEditarSecao").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const type = document.getElementById("type").value;
    const dueDateTime = document.getElementById("dueDateTime").value;
    const submissionLimit = Number(document.getElementById("submissionLimit").value);
    const description = document.getElementById("description").value.trim();

    const payload = {
      title,
      type,
      dueDateTime: dueDateTime || null,
      submissionLimit,
      description
    };

    try {
      const res = await fetch(`http://localhost:3000/topics/${topicId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao atualizar a seção.");
      }

      window.location.href = `disciplina-detalhe-home.html?id=${courseId}`;
    } catch (err) {
      alert("Erro ao editar a seção.");
    }
  });
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}
