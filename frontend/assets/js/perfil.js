document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "../../index.html";
    return;
  }

  // Função para carregar os dados do usuário e preencher o formulário
  async function loadUserProfile() {
    try {
      const res = await fetch("http://localhost:3000/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error("Erro ao carregar usuário.");
      }

      const user = await res.json();

      // ATENÇÃO: o HTML do perfil não tem mais o id="boasVindas" dentro de um span
      // Se você quiser que o nome do usuário apareça no "Olá, Aluno(a)!" do cabeçalho
      // desta página, você precisará adicionar um <span id="userNameHeader"></span>
      // dentro da div.user-info e ajustar esta linha:
      // document.getElementById("userNameHeader").textContent = `Olá, ${user.firstname}!`;

      document.getElementById("firstname").value = user.firstname || "";
      document.getElementById("lastname").value = user.lastname || "";
      document.getElementById("email").value = user.email || "";

    } catch (err) {
      console.error(err);
      alert("Erro ao carregar dados do perfil.");
    }
  }

  // Chamar a função para carregar o perfil ao carregar a página
  loadUserProfile();

  // Listener para o formulário de submissão
  document.getElementById("formPerfil").addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const email = document.getElementById("email").value.trim(); // Email é readonly, mas pode ser enviado para validação
    const oldPassword = document.getElementById("oldPassword").value.trim(); // NOVO CAMPO
    const newPassword = document.getElementById("password").value.trim(); // AGORA É newPassword
    const confirmNewPassword = document.getElementById("confirmNewPassword").value.trim(); // NOVO CAMPO

    // Payload inicial com campos básicos
    const payload = { firstname, lastname }; // Removido 'email' do payload para PUT, se ele for readonly.
                                            // Se o backend espera email, pode manter.

    // Lógica para inclusão de senha na atualização
    if (newPassword) { // Se uma nova senha foi digitada
      if (newPassword !== confirmNewPassword) {
        alert("A nova senha e a confirmação de senha não coincidem.");
        return;
      }
      if (!oldPassword) {
        alert("Para alterar a senha, você deve informar a senha antiga.");
        return;
      }
      payload.oldPassword = oldPassword; // Adiciona senha antiga
      payload.newPassword = newPassword; // Adiciona nova senha
    } else if (oldPassword) { // Se a senha antiga foi digitada mas a nova não
      alert("Você informou a senha antiga, mas não informou uma nova senha.");
      return;
    }


    try {
      const res = await fetch("http://localhost:3000/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao atualizar perfil.");
      }

      // Limpar campos de senha após sucesso
      document.getElementById("oldPassword").value = "";
      document.getElementById("password").value = "";
      document.getElementById("confirmNewPassword").value = "";

      alert("Perfil atualizado com sucesso!");
      // Opcional: Recarregar dados do perfil para garantir que tudo esteja atualizado
      // loadUserProfile(); 
      // Ou redirecionar para home:
      window.location.href = "home.html";
      
    } catch (err) {
      console.log(err);
      alert("Erro na atualização: " + err.message);
    }
  });
});

// Função de logout (fora do DOMContentLoaded para ser global)
function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}