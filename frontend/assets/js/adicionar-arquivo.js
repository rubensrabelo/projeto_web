document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("formArquivo");
  const boasVindas = document.getElementById("boasVindas");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "../../index.html";
    return;
  }

  try {
    const resUser = await fetch("http://localhost:3000/users/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!resUser.ok) throw new Error("Erro ao buscar usuário.");

    const user = await resUser.json();
    const nome = user.name || user.firstname || "Professor";

    if (boasVindas) {
      boasVindas.textContent = `Bem-vindo, ${nome}!`;
    }
  } catch (err) {
    console.error("Erro ao buscar nome do professor:", err);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const topicId = urlParams.get("topicId");

  if (!topicId) {
    alert("Seção (topicId) não fornecida.");
    window.location.href = "home.html";
    return;
  }

  let courseId;

  try {
    const resTopic = await fetch(`http://localhost:3000/topics/${topicId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!resTopic.ok) throw new Error("Erro ao buscar dados da seção.");

    const topic = await resTopic.json();
    courseId = topic.course || topic.courseId;

    if (!courseId) {
      console.warn("courseId não encontrado no tópico.");
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao obter o curso da seção.");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomeArquivo = document.getElementById("nomeArquivo").value.trim();
    const file = document.getElementById("arquivo").files[0];

    if (!nomeArquivo) {
      alert("Por favor, insira o nome do arquivo.");
      return;
    }

    if (!file) {
      alert("Por favor, selecione um arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append("name", nomeArquivo);
    formData.append("file", file);

    try {
      const res = await fetch(`http://localhost:3000/files/${topicId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao enviar o arquivo.");
      }

      window.location.href = `secoes.html?id=${courseId}`;
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao enviar o arquivo.");
    }
  });
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}
