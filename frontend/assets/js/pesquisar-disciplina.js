// Variável para armazenar todas as disciplinas carregadas do backend
let todasDisciplinas = [];

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return window.location.href = "../../index.html";
  }

  try {
    const userRes = await fetch("http://localhost:3000/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const userData = await userRes.json();
    const nomeProf = userData.firstname || "Professor(a)";
    
    const userNameHeaderSpan = document.querySelector('.user-info span'); 
    if (userNameHeaderSpan) {
        userNameHeaderSpan.innerText = `Olá, ${nomeProf}!`;
    }

    const cursosRes = await fetch("http://localhost:3000/courses/teacher", {
      headers: { Authorization: `Bearer ${token}` }
    });
    todasDisciplinas = await cursosRes.json();

    renderizarDisciplinas(todasDisciplinas);

    const campoBusca = document.getElementById("campoBusca");
    campoBusca.addEventListener("keyup", buscarDisciplinas);
    campoBusca.addEventListener("change", buscarDisciplinas);

  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    alert("Erro ao carregar dados das disciplinas.");
  }
});

function renderizarDisciplinas(disciplinasParaExibir) {
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = ""; // Limpa o conteúdo antes de adicionar

  if (disciplinasParaExibir.length === 0) {
    resultadosDiv.innerHTML = '<p style="text-align: center; color: #666;">Nenhuma disciplina encontrada.</p>';
  } else {
      disciplinasParaExibir.forEach(curso => {
        const disciplinaItem = document.createElement("div");
        disciplinaItem.className = "disciplina-item";
        // ADIÇÃO CRUCIAL: Adiciona o onclick ao DIV inteiro do card
        disciplinaItem.onclick = () => entrarNaDisciplina(curso._id); 

        disciplinaItem.innerHTML = `
          <div class="item-info">
            <div class="item-icon">
              <i class="fas fa-bookmark"></i>
            </div>
            <h4 class="item-subject">${curso.name}</h4>
            <span class="item-code">${curso.classSchedule || "N/A"}</span>
          </div>
          <button class="item-action-button">
            <i class="fas fa-chevron-right"></i>
          </button>
        `;
        resultadosDiv.appendChild(disciplinaItem);
      });
  }

  // O card "Adicionar nova disciplina..." (se ainda presente no HTML estaticamente)
  // não é manipulado por esta função, ele deve ter seu próprio onclick direto no HTML.
}

// Esta função redireciona para a página de detalhes da disciplina
function entrarNaDisciplina(cursoId) {
  if (cursoId) {
    window.location.href = `disciplina-detalhe-home.html?id=${cursoId}`; 
  } else {
    console.error("ID do curso é inválido, não foi possível redirecionar.");
    alert("Não foi possível acessar os detalhes da disciplina.");
  }
}

function buscarDisciplinas() {
  const termoBusca = document.getElementById("campoBusca").value.toLowerCase();
  
  const disciplinasFiltradas = todasDisciplinas.filter(curso => {
    const nomeCorresponde = curso.name.toLowerCase().includes(termoBusca);
    const horarioCorresponde = (curso.classSchedule || "").toLowerCase().includes(termoBusca);
    return nomeCorresponde || horarioCorresponde;
  });

  renderizarDisciplinas(disciplinasFiltradas);
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}