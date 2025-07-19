document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const dados = Object.fromEntries(formData);

  try {
    const resposta = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      alert("Login realizado com sucesso!");

      localStorage.setItem("token", resultado.token);

      window.location.href = "../views/home.html";
    } else {
      alert(resultado.error || "Credenciais inválidas.");
    }
  } catch (erro) {
    alert("Erro de conexão com o servidor.");
    console.error(erro);
  }
});
