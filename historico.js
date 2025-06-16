const listaHistorico = document.getElementById("listaHistorico");

function carregarHistorico() {
  let historico = JSON.parse(localStorage.getItem("historicoPedidos") || "[]");

  if (historico.length === 0) {
    listaHistorico.innerHTML = "<p>Nenhum pedido salvo.</p>";
    return;
  }

  listaHistorico.innerHTML = "";

  historico.forEach((pedido, index) => {
    const bloco = document.createElement("div");
    bloco.classList.add("bloco-pedido");

    bloco.innerHTML = `
      <h4>${pedido.nome}</h4>
      <p class="endereco">${pedido.endereco}</p>
    `;

    listaHistorico.appendChild(bloco);
  });
}

carregarHistorico();
