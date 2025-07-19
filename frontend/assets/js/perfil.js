document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "../../index.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Erro ao carregar usuário.");

    const user = await res.json();

    document.getElementById("boasVindas").textContent = `Bem-vindo, ${user.firstname}!`;

    document.getElementById("firstname").value = user.firstname || "";
    document.getElementById("lastname").value = user.lastname || "";
    document.getElementById("email").value = user.email || "";

  } catch (err) {
    console.error(err);
    alert("Erro ao carregar dados do perfil.");
  }
});

document.getElementById("formPerfil").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const firstname = document.getElementById("firstname").value.trim();
  const lastname = document.getElementById("lastname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const payload = { firstname, lastname, email };
  if (password) payload.password = password;

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

    window.location.href = "home.html";
  } catch (err) {
    console.log(err);
    alert("Erro na atualização.");
  }
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../../index.html";
}
