document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "../../index.html";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");

  if (!courseId) {
    alert("ID da disciplina não fornecido.");
    window.location.href = "home.html";
    return;
  }

  try {
    const resUser = await fetch("http://localhost:3000/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = await resUser.json();
    document.getElementById("boasVindas").textContent = `Bem-vindo, ${user.firstname}!`;

    carregarSecoes(courseId);
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar usuário.");
  }
});

async function carregarSecoes(courseId) {
  const container = document.getElementById("listaSecoes");
  container.innerHTML = "<p>Carregando seções...</p>";

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/topics/course/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const secoes = await res.json();

    if (!secoes.length) {
      container.innerHTML = "<p>Nenhuma seção encontrada.</p>";
      return;
    }

    container.innerHTML = secoes.map(secao => `
      <div class="secao">
        <h3>${secao.title}</h3>
        <button onclick="adicionarConteudo('${secao._id}')">Adicionar Conteúdo</button>
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Erro ao carregar seções.</p>";
  }
}

function adicionarConteudo(topicId) {
  window.location.href = `conteudo.html?topicId=${topicId}`;
}

function irParaCriarSecao() {
  const courseId = new URLSearchParams(window.location.search).get("id");
  window.location.href = `criar-secao.html?id=${courseId}`;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}
