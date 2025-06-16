const pagamentoSelect = document.getElementById("pagamento");
const dinheiroFields = document.getElementById("dinheiroFields");
const cartaoFields = document.getElementById("cartaoFields");

const formSection = document.getElementById("formulario");
const historicoSection = document.getElementById("historico");

const btnHistorico = document.getElementById("btnHistorico");
const btnFormulario = document.getElementById("btnFormulario");

const form = document.getElementById("pedidoForm");
const mensagemContainer = document.getElementById("mensagemContainer");
const mensagemPronta = document.getElementById("mensagemPronta");
const copiarBtn = document.getElementById("copiarMensagem");

const listaHistorico = document.getElementById("listaHistorico");

pagamentoSelect.addEventListener("change", () => {
  const val = pagamentoSelect.value;
  if (val === "Dinheiro") {
    dinheiroFields.classList.remove("hidden");
    cartaoFields.classList.add("hidden");
  } else if (val === "Cartão") {
    cartaoFields.classList.remove("hidden");
    dinheiroFields.classList.add("hidden");
  } else {
    dinheiroFields.classList.add("hidden");
    cartaoFields.classList.add("hidden");
  }
});

// Mostrar histórico e esconder formulário
btnHistorico.addEventListener("click", () => {
  formSection.style.display = "none";
  historicoSection.style.display = "block";
  btnHistorico.style.display = "none";
  btnFormulario.style.display = "inline-block";
  carregarHistorico();
});

// Mostrar formulário e esconder histórico
btnFormulario.addEventListener("click", () => {
  historicoSection.style.display = "none";
  formSection.style.display = "block";
  btnFormulario.style.display = "none";
  btnHistorico.style.display = "inline-block";
});

function salvarHistorico(pedido) {
  let historico = JSON.parse(localStorage.getItem("historicoPedidos") || "[]");
  historico.push(pedido);
  localStorage.setItem("historicoPedidos", JSON.stringify(historico));
}

function carregarHistorico() {
  listaHistorico.innerHTML = "";
  let historico = JSON.parse(localStorage.getItem("historicoPedidos") || "[]");
  if (historico.length === 0) {
    listaHistorico.innerHTML = "<p>Nenhum pedido salvo.</p>";
    return;
  }

  historico.forEach((pedido) => {
    const bloco = document.createElement("div");
    bloco.classList.add("blocoHistorico");
    bloco.innerHTML = `
      <strong>${pedido.nome}</strong><br />
      <small>${pedido.endereco}</small>
    `;
    listaHistorico.appendChild(bloco);
  });
}

async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    alert("Mensagem copiada para área de transferência!");
  } catch (err) {
    alert("Falha ao copiar a mensagem. Por favor, copie manualmente.");
    console.error("Erro ao copiar: ", err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const codigoIfood = document.getElementById("codigoIfood").checked;
  const bebida = document.getElementById("bebida").value;
  const endereco = document.getElementById("endereco").value.trim();
  const pagamento = pagamentoSelect.value;
  const receber = document.getElementById("receber").value.trim();
  const troco = document.getElementById("troco").value.trim();
  const valorCartao = document.getElementById("valorCartao").value.trim();

  if (!nome) {
    alert("Por favor, preencha o nome do cliente.");
    return;
  }

  if (!endereco) {
    alert("Por favor, preencha o endereço.");
    return;
  }

  if (!pagamento) {
    alert("Por favor, selecione a forma de pagamento.");
    return;
  }

  let mensagem = `🚀 *Novo Pedido:*\n\n *Nome:* ${nome}`;
  if (codigoIfood) {
    mensagem += ` *( Pegar código iFood )*`;
  }
  if (bebida) {
    mensagem += `\n\n *Bebida:* ${bebida}`;
  }
  mensagem += `\n\n *Endereço:* ${endereco}`;

  if (pagamento === "Pago") {
    mensagem += `\n\n *Pagamento:* Pago`;
  } else if (pagamento === "Dinheiro") {
    if (!receber) {
      alert("Por favor, informe o valor a receber para pagamento em dinheiro.");
      return;
    }
    mensagem += `\n\n *Pagamento:* Receber R$ ${receber}`;
    if (troco) mensagem += ` - *Troco para* R$ ${troco}`;
  } else if (pagamento === "Cartão") {
    if (!valorCartao) {
      alert("Por favor, informe o valor para pagamento no cartão.");
      return;
    }
    mensagem += `\n\n *Pagamento:* Cartão - Valor: R$ ${valorCartao}`;
  } else if (pagamento === "PIX") {
    mensagem += `\n\n *Pagamento:* PIX`;
  }

  mensagemPronta.value = mensagem;
  mensagemContainer.classList.remove("hidden");

  salvarHistorico({ nome, endereco });

  await copiarTexto(mensagem);

  form.reset();
  dinheiroFields.classList.add("hidden");
  cartaoFields.classList.add("hidden");
});

// Botão copiar
copiarBtn.addEventListener("click", async () => {
  const texto = mensagemPronta.value;
  if (!texto) {
    alert("Nenhuma mensagem para copiar.");
    return;
  }
  await copiarTexto(texto);
});
