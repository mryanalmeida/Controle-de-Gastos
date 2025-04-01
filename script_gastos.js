let total = 0;
let totalFixos = 0;
let gastosFixos = [];
let gastosVariaveis = [];

function atualizarTotalGeral() {
    let totalGeral = total + totalFixos;
    document.getElementById("totalGeral").textContent = totalGeral.toFixed(2);
}

function salvarDados() {
    localStorage.setItem("gastos", JSON.stringify({ total, totalFixos, gastosFixos, gastosVariaveis }));
}

function carregarDados() {
    let dados = JSON.parse(localStorage.getItem("gastos"));
    if (dados) {
        total = dados.total;
        totalFixos = dados.totalFixos;
        gastosFixos = dados.gastosFixos || [];
        gastosVariaveis = dados.gastosVariaveis || [];
        document.getElementById("total").textContent = total.toFixed(2);
        document.getElementById("totalFixos").textContent = totalFixos.toFixed(2);
        atualizarTotalGeral();
    }
}

function adicionarGasto() {
    let descricao = document.getElementById("descricao").value;
    let valor = parseFloat(document.getElementById("valor").value.replace(',', '.'));
    let data = new Date().toLocaleDateString("pt-BR");
    if (descricao && !isNaN(valor)) {
        let lista = document.getElementById("listaGastos");
        let item = document.createElement("li");
        item.innerHTML = `${descricao} - R$ ${valor.toFixed(2)} (${data}) <button onclick='removerGasto(this, ${valor})'>X</button>`;
        lista.appendChild(item);
        total += valor;
        gastosVariaveis.push({ descricao, valor, data });
        document.getElementById("total").textContent = total.toFixed(2);
        document.getElementById("descricao").value = "";
        document.getElementById("valor").value = "";
        atualizarTotalGeral();
        salvarDados();
    }
}

function removerGasto(botao, valor) {
    botao.parentElement.remove();
    total -= valor;
    document.getElementById("total").textContent = total.toFixed(2);
    atualizarTotalGeral();
    salvarDados();
}

function adicionarGastoFixo() {
    let descricao = document.getElementById("descricaoFixo").value;
    if (descricao === "Outros") {
        descricao = document.getElementById("descricaoOutrosInput").value;
    }
    let valor = parseFloat(document.getElementById("valorFixo").value.replace(',', '.'));
    if (descricao && !isNaN(valor)) {
        let lista = document.getElementById("listaGastosFixos");
        let item = document.createElement("li");
        item.innerHTML = `${descricao} - R$ ${valor.toFixed(2)} <button onclick='removerGastoFixo(this, ${valor})'>X</button>`;
        lista.appendChild(item);
        totalFixos += valor;
        gastosFixos.push({ descricao, valor });
        document.getElementById("totalFixos").textContent = totalFixos.toFixed(2);
        document.getElementById("valorFixo").value = "";
        document.getElementById("descricaoOutrosInput").value = "";
        atualizarTotalGeral();
        salvarDados();
    }
}

function removerGastoFixo(botao, valor) {
    botao.parentElement.remove();
    totalFixos -= valor;
    document.getElementById("totalFixos").textContent = totalFixos.toFixed(2);
    atualizarTotalGeral();
    salvarDados();
}

function limparDados() {
    localStorage.removeItem("gastos");
    document.getElementById("listaGastos").innerHTML = "";
    document.getElementById("listaGastosFixos").innerHTML = "";
    total = 0;
    totalFixos = 0;
    gastosFixos = [];
    gastosVariaveis = [];
    document.getElementById("total").textContent = "0.00";
    document.getElementById("totalFixos").textContent = "0.00";
    atualizarTotalGeral();
}

function mostrarDescricaoOutros() {
    const descricaoFixo = document.getElementById("descricaoFixo").value;
    const descricaoOutros = document.getElementById("descricaoOutros");
    descricaoOutros.style.display = descricaoFixo === "Outros" ? "block" : "none";
}

function exibirDataAtual() {
    const hoje = new Date();
    const opcoes = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dataFormatada = hoje.toLocaleDateString('pt-BR', opcoes);
    document.getElementById('dataAtual').textContent = dataFormatada;
}

function gerarRelatorioHTML() {
    let relatorioHTML = `
    <html>
        <head>
            <title>Relatório de Gastos do Mês</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                table, th, td { border: 1px solid #ddd; }
                th, td { padding: 10px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h2>Relatório de Gastos do Mês</h2>
            <h3>Gastos Fixos:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Valor (R$)</th>
                    </tr>
                </thead>
                <tbody>
    `;

    gastosFixos.forEach(gasto => {
        relatorioHTML += `
            <tr>
                <td>${gasto.descricao}</td>
                <td>${gasto.valor.toFixed(2)}</td>
            </tr>
        `;
    });

    relatorioHTML += `
        </tbody>
    </table>
    <h3>Total Fixos: R$ ${totalFixos.toFixed(2)}</h3>
    
    <h3>Gastos Variáveis:</h3>
    <table>
        <thead>
            <tr>
                <th>Descrição</th>
                <th>Valor (R$)</th>
                <th>Data</th>
            </tr>
        </thead>
        <tbody>
    `;

    gastosVariaveis.forEach(gasto => {
        relatorioHTML += `
            <tr>
                <td>${gasto.descricao}</td>
                <td>${gasto.valor.toFixed(2)}</td>
                <td>${gasto.data}</td>
            </tr>
        `;
    });

    relatorioHTML += `
        </tbody>
    </table>
    <h3>Total Variável: R$ ${total.toFixed(2)}</h3>
    <h3>Total Geral: R$ ${(total + totalFixos).toFixed(2)}</h3>
    </body>
    </html>
    `;

    // Abre uma nova aba com o relatório gerado
    let novaJanela = window.open();
    novaJanela.document.write(relatorioHTML);
    novaJanela.document.close();
}


// Chama a função para exibir a data assim que a página for carregada
window.onload = function () {
    carregarDados();
    exibirDataAtual(); // Exibe a data atual
};
