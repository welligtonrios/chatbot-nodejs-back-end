const watson = require('watson-developer-cloud/assistant/v1'); // watson sdk
const prompt = require('prompt-sync')(); // poder utilizar o prompt para receber i
require('dotenv').config()


const chatbot = new watson({
  'version': process.env.VERSION,
  'url': process.env.URL,
  'iam_apikey': process.env.IAM_APIKEY,
  'iam_url': process.env.IAM_URL
});

const workspace_id = process.env.WORKSPACE_ID;

var payload = {
  workspace_id: workspace_id,
  context: {},
  input: {}
};

//Começando a conversação com a mensagem vazia; passo o workspace_id e já recebo a reposta ou o erro
//em seguida recebo um input para passar a mensagem do usuario para o bot, passando novamente o metodo que retorna a mensagem 
//e mantendo o fluxo // também é guardado o contexto para o bot lembrar da conversação context (conversation_id) e passado no metodo mensagem 
//quando enviamos a mensagem para o bot

let fimDeconcersa = false;

chatbot.message(payload, function tratarResposta(err, resposta) {

  if (err) {
    console.log('Erro', err);
    return;
  }

  //detecta a intenção do usuario
  if (resposta.intents.length > 0) {
    console.log('Intenção => ', resposta.intents[0].intent)

    //qunado identifica a intenção despedida para sair do fluxo, n entra no prompt input
    if(resposta.intents[0].intent === 'despedida'){
      fimDeconcersa=true
    }
  }

  // console.log(resposta)
  // exibe a resposta do dialogo,caso exista, vinda do bot
  if (resposta.output.text.length > 0) {
    console.log(resposta.output.text[0]);
  }

  //guardar conversation_id   pro bot lembrar a conversação
  // console.log(resposta.context) //para isso usa o context na chamado do message


  if (!fimDeconcersa) {
    //função input usuario //usando propt sync para interagir 
    const mensagemUsuario = prompt('>>');
    // //mando a msg usuario pro chatbot
    chatbot.message({
      workspace_id, input: { text: mensagemUsuario },
      context: resposta.context
    }, tratarResposta);
  }
});

