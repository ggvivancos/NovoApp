const salvarEtapa2 = async () => {
    if (!pacienteSelecionado && !isCreatingNewPaciente && !isCreatingPacienteProvisorio) {
        Alert.alert('Erro', 'Por favor, selecione ou crie um paciente antes de prosseguir.');
        return;
    }

    console.log("isCreatingNewPaciente:", isCreatingNewPaciente);
    console.log("isCreatingPacienteProvisorio:", isCreatingPacienteProvisorio);
    console.log("isCarregandoDadosIniciais:", isCarregandoDadosIniciais);

    let dadosEtapa2: DadosEtapa2 = { statusPaciente: undefined };

    if (isCreatingPacienteProvisorio) {
        if (dadosEtapa2?.pacienteProvisorioId && !isCarregandoDadosIniciais) {
            
            console.log("222isCreatingNewPaciente:", isCreatingNewPaciente);
            console.log("222isCreatingPacienteProvisorio:", isCreatingPacienteProvisorio);
            console.log("222isCarregandoDadosIniciais:", isCarregandoDadosIniciais);

            




            const dadosAtualizados = {
                id: dadosEtapa2.pacienteProvisorioId, // ID do paciente
                nomecompleto: nomeCompleto,
                datadenascimento: dataDeNascimento,
                CPF: CPF,
                telefone: telefone,
                observacao: observacao,
                VAD: VAD,
                alergia: alergia,
                alergiaLatex: alergiaLatex
                // Adicione outros campos conforme necessário
            };
            const pacienteProvisorioAtualizado = await atualizarPacienteProvisorio(dadosEtapa2.pacienteProvisorioId, dadosAtualizados);
            console.log("333isCreatingNewPaciente:", isCreatingNewPaciente);
            console.log("333isCreatingPacienteProvisorio:", isCreatingPacienteProvisorio);
            console.log("3333isCarregandoDadosIniciais:", isCarregandoDadosIniciais);
            if (!pacienteProvisorioAtualizado) return;

            dadosEtapa2 = {
                pacienteProvisorioId: dadosEtapa2.pacienteProvisorioId,
                statusPaciente: 'Provisório'
            };
            console.log("Atualizando paciente provisório com ID:", dadosEtapa2.pacienteProvisorioId);
        } else {
            // Cria um novo paciente provisório
            const novoPacienteProvisorioId = await salvarPacienteProvisorio();
            console.log("444isCreatingNewPaciente:", isCreatingNewPaciente);
            console.log("444isCreatingPacienteProvisorio:", isCreatingPacienteProvisorio);
            console.log("4444isCarregandoDadosIniciais:", isCarregandoDadosIniciais);
            if (!novoPacienteProvisorioId) return;

            dadosEtapa2 = {
                pacienteProvisorioId: novoPacienteProvisorioId,
                statusPaciente: 'Provisório'
            };
            console.log("Salvando novo paciente provisório com ID:", novoPacienteProvisorioId);
        }
    } else if (pacienteSelecionado) {
        // Se um paciente já estiver selecionado, salva como definitivo
        dadosEtapa2 = {
            pacienteId: pacienteSelecionado.id,
            statusPaciente: 'Definitivo'
        };
        console.log("Salvando paciente definitivo com ID:", pacienteSelecionado.id);
    }

    if (dadosEtapa2) {
        console.log("Dados da Etapa 2 antes de salvar no contexto:", dadosEtapa2);
        salvarDadosEtapa2(dadosEtapa2);
        console.log("Dados da Etapa 2 após chamar a função salvarDadosEtapa2", dadosEtapa2);
        setEstaAvancando(true);
    }
};