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

    if (!resUser.ok) throw new Error("Erro ao carregar usuário");

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

    if (!res.ok) throw new Error("Erro ao buscar seções");
    const secoes = await res.json();

    if (!secoes.length) {
      container.innerHTML = "<p>Nenhuma seção encontrada.</p>";
      return;
    }

    const secoesComArquivos = await Promise.all(
      secoes.map(async (secao) => {
        const resFiles = await fetch(`http://localhost:3000/files/${secao._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const arquivos = resFiles.ok ? await resFiles.json() : [];
        return { ...secao, arquivos };
      })
    );

    const baseUrl = "http://localhost:3000/uploads/";

    // Coloar no href abaixo: "dados-atividade.html?topicId=${secao._id}"
    container.innerHTML = secoesComArquivos.map(secao => {
      const visualizarLink = secao.type === "activity"
        ? `<a href=# class="visualizar-dados">📊 Visualizar Dados da Atividade</a>`
        : "";

      const listaArquivos = secao.arquivos.length
        ? `<ul class="lista-arquivos">` +
          secao.arquivos.map(arq =>
            `<li>
              <a href="${baseUrl + arq.savedName}" download="${arq.name}" target="_blank" rel="noopener noreferrer" title="Clique para baixar">
                ${arq.name} ⬇️
              </a>
            </li>`
          ).join("") +
          `</ul>`
        : `<p><i>Nenhum arquivo nesta seção.</i></p>`;

      return `
        <div class="secao">
          <h3>${secao.title}</h3>
          ${visualizarLink}
          ${listaArquivos}
          <div class="botoes-secao">
            <button title="Adicionar Conteúdo" onclick="adicionarConteudo('${secao._id}')">📄</button>
            <button title="Editar Seção" onclick="editarSecao('${secao._id}')">✏️</button>
          </div>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Erro ao carregar seções e arquivos.</p>";
  }
}

function adicionarConteudo(topicId) {
  window.location.href = `adicionar-arquivo.html?topicId=${topicId}`;
}

function editarSecao(topicId) {
  window.location.href = `editar-secao.html?id=${topicId}`;
}

function irParaCriarSecao() {
  const courseId = new URLSearchParams(window.location.search).get("id");
  window.location.href = `criar-secao.html?id=${courseId}`;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}
