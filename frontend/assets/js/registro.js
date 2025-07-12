document.getElementById("registroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const dados = Object.fromEntries(formData);

  try {
    const resposta = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      alert("Cadastro realizado com sucesso!");
      window.location.href = "login.html";
    } else {
      alert(resultado.error || "Erro ao cadastrar.");
    }
  } catch (erro) {
    alert("Erro de conexão com o servidor.");
    console.error(erro);
  }
});
