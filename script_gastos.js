let total = 0;
        let totalFixos = 0;
        
        function atualizarTotalGeral() {
            let totalGeral = total + totalFixos;
            document.getElementById("totalGeral").textContent = totalGeral.toFixed(2);
        }
        
        function salvarDados() {
            localStorage.setItem("gastos", JSON.stringify({ total, totalFixos }));
        }
        
        function carregarDados() {
            let dados = JSON.parse(localStorage.getItem("gastos"));
            if (dados) {
                total = dados.total;
                totalFixos = dados.totalFixos;
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
            document.getElementById("total").textContent = "0.00";
            document.getElementById("totalFixos").textContent = "0.00";
            atualizarTotalGeral();
        }

        function mostrarDescricaoOutros() {
            const descricaoFixo = document.getElementById("descricaoFixo").value;
            const descricaoOutros = document.getElementById("descricaoOutros");
            descricaoOutros.style.display = descricaoFixo === "Outros" ? "block" : "none";
        }

        carregarDados();