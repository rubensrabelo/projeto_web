document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return window.location.href = "../../index.html"; // Redireciona se não houver token
  }

  // Lógica para alternar seções de configuração (Perfil, Preferências, etc.)
  const configMenuLinks = document.querySelectorAll('.config-menu a');
  const configSections = document.querySelectorAll('.config-section');

  configMenuLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // Impede o comportamento padrão do link

      // Remove a classe 'active' de todos os links e seções
      configMenuLinks.forEach(item => item.parentElement.classList.remove('active'));
      configSections.forEach(section => section.classList.remove('active-section'));

      // Adiciona a classe 'active' ao link clicado e à seção correspondente
      link.parentElement.classList.add('active');
      const targetSectionId = link.dataset.section + '-section'; // Ex: 'perfil' -> 'perfil-section'
      document.getElementById(targetSectionId).classList.add('active-section');

      // Se quiser que o JavaScript carregue dados do perfil, pode chamar uma função aqui
      // Por exemplo: if (link.dataset.section === 'perfil') loadProfileData();
    });
  });

  // Exemplo de função para carregar dados do usuário no formulário de perfil
  // Este é um esqueleto. Você precisará adaptá-lo para seu backend.
  async function loadProfileData() {
    try {
      const res = await fetch("http://localhost:3000/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await res.json();

      // Atualiza o nome de usuário no cabeçalho (Olá, Aluno(a)!)
      const boasVindasSpan = document.querySelector('.user-info span');
      if (boasVindasSpan) {
          boasVindasSpan.innerText = `Olá, ${userData.firstname || 'Aluno(a)'}!`;
      }

      // Preenche os campos do formulário de perfil dentro da seção de configurações
      document.getElementById("firstName").value = userData.firstname || '';
      document.getElementById("lastName").value = userData.lastname || '';
      document.getElementById("email").value = userData.email || '';
      document.getElementById("estado").value = userData.state || ''; // Assumindo 'state' no backend
      document.getElementById("cidade").value = userData.city || '';   // Assumindo 'city' no backend

    } catch (err) {
      console.error("Erro ao carregar dados do perfil nas configurações:", err);
      // alert("Erro ao carregar seu perfil nas configurações."); // Remova em produção se for muito intrusivo
    }
  }

  // Chamar para carregar dados do perfil quando a página carrega e a seção de perfil está ativa
  loadProfileData();

  // Lógica para submeter o formulário de perfil (similar ao seu perfil.js anterior)
  const profileConfigForm = document.getElementById("profileConfigForm");
  profileConfigForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const estado = document.getElementById("estado").value;
    const cidade = document.getElementById("cidade").value;
    // O email é readonly, então não será alterado por aqui, mas pode ser incluído no payload se necessário para validação do backend.

    const updateData = {
      firstname: firstName,
      lastname: lastName,
      state: estado, // Mapeie para o campo correto no seu backend
      city: cidade   // Mapeie para o campo correto no seu backend
      // Se você quiser permitir alteração de senha aqui, adicione os campos e a lógica como no perfil.js anterior
    };

    try {
      const res = await fetch("http://localhost:3000/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (res.ok) {
        alert("Perfil atualizado com sucesso!");
        // Opcional: Recarregar dados para garantir que UI esteja sincronizada
        loadProfileData(); 
      } else {
        const errorData = await res.json();
        alert(`Erro ao atualizar perfil: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      console.error("Erro na requisição de atualização do perfil:", err);
      alert("Erro de comunicação com o servidor ao atualizar perfil.");
    }
  });

}); // Fim do DOMContentLoaded

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}