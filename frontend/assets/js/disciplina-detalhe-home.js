document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../../index.html";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const disciplinaId = urlParams.get("id");
  if (!disciplinaId) {
    alert("ID da disciplina não foi fornecido.");
    return;
  }

  window.currentDisciplineId = disciplinaId;

  try {
    const userRes = await fetch("http://localhost:3000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (userRes.ok) {
      const userData = await userRes.json();
      const nomeProf = userData.firstname || "Professor(a)";
      document.querySelector(".user-info span").textContent = `Olá, ${nomeProf}!`;
    }

    const disciplinaRes = await fetch(`http://localhost:3000/courses/${disciplinaId}/teacher`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let disciplinaNome = "Disciplina";
    if (disciplinaRes.ok) {
      const data = await disciplinaRes.json();
      disciplinaNome = data.name || disciplinaNome;
    }

    document.getElementById("discipline-main-title").textContent = disciplinaNome;

    const topicsRes = await fetch(`http://localhost:3000/topics/course/${disciplinaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const topics = topicsRes.ok ? await topicsRes.json() : [];
    const container = document.getElementById("topics-container");
    const addButton = document.getElementById("add-topic-button");
    addButton.remove();

    if (topics.length > 0) {
      for (const topic of topics) {
        const card = document.createElement("div");
        card.className = "detail-section-card";

        const icon = topic.type === "lecture"
          ? "fas fa-book"
          : topic.type === "activity"
            ? "fas fa-tasks"
            : "fas fa-lightbulb";

        card.innerHTML = `
          <h2 class="section-card-title">
            <i class="${icon}"></i> ${topic.title}
          </h2>
          <div class="section-card-body">
            <p>${topic.description || "Sem descrição."}</p>

            <ul class="files-list" id="files-list-${topic._id}">
              <li>Carregando arquivos...</li>
            </ul>

            <div class="buttons-container">
              <button class="btn-add-file" onclick="adicionarArquivo('${topic._id}')">
                <i class="fas fa-paperclip"></i>
              </button>
              <button class="btn-edit-topic" onclick="editarTopico('${topic._id}')">
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </div>
        `;

        container.appendChild(card);
        carregarArquivos(topic._id, token);
      }
    } else {
      const noTopic = document.createElement("p");
      noTopic.style.color = "#666";
      noTopic.textContent = "Nenhum tópico adicionado ainda.";
      container.appendChild(noTopic);
    }

    container.appendChild(addButton);
    addButton.onclick = () => {
      window.location.href = `criar-secao.html?disciplineId=${disciplinaId}`;
    };

  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    alert("Erro ao carregar dados da disciplina.");
  }
});

async function carregarArquivos(topicId, token) {
  try {
    const filesRes = await fetch(`http://localhost:3000/files/${topicId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const filesListUl = document.getElementById(`files-list-${topicId}`);
    filesListUl.innerHTML = "";

    if (filesRes.ok) {
      const files = await filesRes.json();

      if (files.length > 0) {
        files.forEach(file => {
          const li = document.createElement("li");
          li.className = "file-item";

          const fileLink = document.createElement("a");
          fileLink.href = `http://localhost:3000${file.url}`;
          fileLink.textContent = file.name;
          fileLink.target = "_blank";
          fileLink.className = "file-link";
          fileLink.setAttribute("download", file.name);

          const btnGroup = document.createElement("div");
          btnGroup.className = "file-btn-group";

          const btnDownload = document.createElement("a");
          btnDownload.href = `http://localhost:3000${file.url}`;;
          btnDownload.download = file.savedName;
          btnDownload.className = "btn-download-file";
          btnDownload.title = "Baixar";
          btnDownload.target = "_blank";
          btnDownload.innerHTML = `<i class="fas fa-download"></i>`;

          const btnDelete = document.createElement("button");
          btnDelete.className = "btn-delete-file";
          btnDelete.title = "Excluir";
          btnDelete.innerHTML = `<i class="fas fa-trash"></i>`;
          btnDelete.onclick = async () => {
            if (confirm(`Deseja excluir o arquivo "${file.name}"?`)) {
              try {
                const res = await fetch(`http://localhost:3000/files/delete/${file._id}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                  li.remove();
                } else {
                  alert("Erro ao excluir arquivo.");
                }
              } catch {
                alert("Erro na requisição.");
              }
            }
          };

          btnGroup.appendChild(btnDownload);
          btnGroup.appendChild(btnDelete);

          li.appendChild(fileLink);
          li.appendChild(btnGroup);

          filesListUl.appendChild(li);
        });
      } else {
        filesListUl.innerHTML = "<li>Nenhum arquivo.</li>";
      }
    } else {
      filesListUl.innerHTML = "<li style='color: red;'>Erro ao carregar arquivos.</li>";
    }
  } catch (err) {
    const filesListUl = document.getElementById(`files-list-${topicId}`);
    filesListUl.innerHTML = "<li style='color: red;'>Erro ao carregar arquivos.</li>";
    console.error("Erro ao carregar arquivos:", err);
  }
}

function editarTopico(topicId) {
  window.location.href = `editar-secao.html?id=${topicId}`;
}

function adicionarArquivo(topicId) {
  window.location.href = `adicionar-arquivo.html?topicId=${topicId}`;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}
