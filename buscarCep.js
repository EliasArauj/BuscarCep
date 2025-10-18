document.addEventListener('DOMContentLoaded', () => {
  const cepInput = document.getElementById('cep');
  const form = document.getElementById('formCep');
  const mensagem = document.getElementById('mensagem');
  const camposReadonly = ['logradouro', 'bairro', 'cidade', 'estado'];

  // Efeito nos campos readonly
  camposReadonly.forEach(id => {
    const campo = document.getElementById(id);
    campo.addEventListener('blur', () => campo.classList.remove('readonly-focus'));
  });

  // Função para mostrar mensagem com efeito
  function showMensagem(text, tipo = 'sucesso') {
    mensagem.textContent = text;
    mensagem.className = ''; // reseta classes
    mensagem.classList.add(tipo, 'show');

    // Desaparecer depois de 3 segundos
    setTimeout(() => {
      mensagem.classList.remove('show');
    }, 3000);
  }

  // Busca CEP ao perder o foco
  cepInput.addEventListener('blur', async () => {
    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) {
      showMensagem('CEP inválido! Digite 8 números.', 'erro');
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        showMensagem('CEP não encontrado.', 'erro');
        return;
      }

      // Preenche campos
      document.getElementById('logradouro').value = data.logradouro || '';
      document.getElementById('bairro').value = data.bairro || '';
      document.getElementById('cidade').value = data.localidade || '';
      document.getElementById('estado').value = data.uf || '';

      showMensagem('Endereço encontrado!', 'sucesso');

    } catch (error) {
      console.error(error);
      showMensagem('Erro ao buscar o CEP.', 'erro');
    }
  });

  // Envio do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showMensagem('Endereço cadastrado com sucesso!', 'sucesso');
    form.reset();
  });
});
