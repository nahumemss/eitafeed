const questions = [
  {q:"O grupo de amigos está um caos. Qual é seu primeiro movimento?",a:[
    ["A","Assumo o comando e faço uma lista."],["B","Faço uma piada e pioro tudo."],["C","Sumo e volto quando passar."],["D","Pergunto quem trouxe comida."]
  ]},
  {q:"Qual seria sua primeira medida oficial?",a:[
    ["A","Proibir reunião antes das 10h."],["B","Criar feriado para pequenas vitórias."],["C","Distribuir lanchinhos em todo lugar."],["D","Instituir o direito à soneca."]
  ]},
  {q:"Seu maior talento completamente subestimado é…",a:[
    ["A","Organizar o caos em planilhas."],["B","Saber de tudo antes de todo mundo."],["C","Transformar qualquer coisa em meme."],["D","Dormir em qualquer circunstância."]
  ]},
  {q:"Escolha seu símbolo de poder:",a:[
    ["A","Uma prancheta impecável."],["B","Um microfone com glitter."],["C","Uma almofada oficial."],["D","Uma coxinha dourada."]
  ]},
  {q:"Uma crise nacional começa no grupo. Você…",a:[
    ["A","Cria um plano de ação em 12 etapas."],["B","Abre uma live para comentar."],["C","Manda um áudio de 4 minutos."],["D","Pergunta se isso vai atrasar o almoço."]
  ]},
  {q:"Qual seria o lema do seu governo?",a:[
    ["A","Com organização, tudo se resolve."],["B","Se é para surtar, vamos viralizar."],["C","Paz, amor e modo silencioso."],["D","Ninguém trabalha de barriga vazia."]
  ]},
  {q:"Como você gostaria de entrar para a história?",a:[
    ["A","A pessoa que colocou ordem na casa."],["B","A lenda que virou assunto nacional."],["C","Quem garantiu descanso para todos."],["D","Quem melhorou o lanche de todo mundo."]
  ]}
];
const outcomes = {
  A:{title:"Presidente do Caos Organizado",emoji:"📋",desc:"Você não pediu poder: pediu uma planilha compartilhada. Seu governo terá cronograma, ata de reunião e um grupo de trabalho para decidir o nome do grupo de trabalho. O país talvez não saiba o que está acontecendo, mas estará tudo documentado.",motto:"“Sem pauta, sem reunião.”"},
  B:{title:"Presidente do Ministério da Fofoca",emoji:"🎤",desc:"Você governa com informação privilegiada, comentários afiados e pronunciamentos que começam com “gente, vocês não estão entendendo”. Seu gabinete tem assessoria de memes e coletiva de imprensa todo dia, mesmo quando nada aconteceu.",motto:"“A informação chega, a gente repassa.”"},
  C:{title:"Presidente Supremo do Descanso",emoji:"🛋️",desc:"Sua plataforma é simples: menos notificações, mais cochilos e direito constitucional a cancelar planos sem inventar uma desculpa. O país entra em recesso depois do almoço. Sua popularidade? Sonolenta, porém altíssima.",motto:"“Amanhã a gente vê isso.”"},
  D:{title:"Presidente do Ministério da Coxinha",emoji:"🍗",desc:"Você entendeu o que realmente une uma nação: comida boa e lanche na hora certa. Todo evento oficial terá mesa de salgadinhos, o café será levado a sério e nenhuma reunião poderá terminar sem perguntar “alguém quer mais um?”.",motto:"“Com fome ninguém decide nada.”"}
};
let current = 0;
let answers = [];
const panel = document.getElementById("quizPanel");
const content = document.getElementById("quizContent");
const startButton = document.getElementById("startQuiz");
const backButton = document.getElementById("backQuestion");

function openQuiz(){
  panel.classList.remove("hidden");
  current = 0; answers = [];
  renderQuestion();
  panel.scrollIntoView({behavior:"smooth",block:"start"});
}
function renderQuestion(){
  const item = questions[current];
  const percent = Math.round(((current+1)/questions.length)*100);
  document.getElementById("questionCounter").textContent = `PERGUNTA ${current+1} DE ${questions.length}`;
  document.getElementById("progressPercent").textContent = `${percent}%`;
  document.getElementById("progressBar").style.width = `${percent}%`;
  backButton.disabled = current === 0;
  content.innerHTML = `<h3 class="question-title">${item.q}</h3><div class="answers">${item.a.map(([letter,label],idx)=>`<button class="answer-option" data-index="${idx}"><span class="answer-letter">${letter}</span><span>${label}</span></button>`).join("")}</div>`;
  content.querySelectorAll(".answer-option").forEach(button=>button.addEventListener("click",()=>chooseAnswer(Number(button.dataset.index))));
}
function chooseAnswer(index){
  answers[current] = index;
  if(current < questions.length-1){current++;renderQuestion();}
  else showResult();
}
function showResult(){
  const counts = {A:0,B:0,C:0,D:0};
  answers.forEach((answer,i)=>counts[questions[i].a[answer][0]]++);
  const max = Math.max(...Object.values(counts));
  const winner = ["A","B","C","D"].find(key=>counts[key]===max);
  const result = outcomes[winner];
  document.getElementById("questionCounter").textContent = "RESULTADO OFICIALÍSSIMO";
  document.getElementById("progressPercent").textContent = "100%";
  document.getElementById("progressBar").style.width = "100%";
  content.innerHTML = `<div class="result-card"><div class="result-emoji">${result.emoji}</div><span class="result-kicker">POR ACLAMAÇÃO POPULAR (E UM ALGORITMO)</span><h3>${result.title}</h3><p>${result.desc}</p><strong>${result.motto}</strong><div class="result-actions"><button class="button button-yellow" id="shareResult">Compartilhar resultado ↗</button><button class="button button-outline" id="retryQuiz">Refazer teste ↻</button></div></div>`;
  document.getElementById("shareResult").addEventListener("click",shareResult);
  document.getElementById("retryQuiz").addEventListener("click",()=>{current=0;answers=[];renderQuestion();});
  backButton.disabled = true;
}
async function shareResult(){
  const text = "Meu cargo no EitaFeed: "+document.querySelector(".result-card h3").textContent+"! Faça o teste “Você se autodeclara presidente do quê?”";
  if(navigator.share){try{await navigator.share({title:"Meu resultado no EitaFeed",text,url:location.href});}catch(e){}}
  else if(navigator.clipboard){try{await navigator.clipboard.writeText(text+" "+location.href);document.getElementById("shareResult").textContent="Texto copiado! ✓";}catch(e){window.prompt("Copie seu resultado:",text+" "+location.href);}}
  else window.prompt("Copie seu resultado:",text+" "+location.href);
}
startButton.addEventListener("click",openQuiz);
document.getElementById("closeQuiz").addEventListener("click",()=>panel.classList.add("hidden"));
backButton.addEventListener("click",()=>{if(current>0){current--;renderQuestion();}});
document.getElementById("menuButton").addEventListener("click",()=>{
  const nav=document.getElementById("mobileNav");
  const isOpen=nav.classList.toggle("open");
  document.getElementById("menuButton").setAttribute("aria-expanded",String(isOpen));
});
document.querySelectorAll("#mobileNav a").forEach(a=>a.addEventListener("click",()=>{document.getElementById("mobileNav").classList.remove("open");document.getElementById("menuButton").setAttribute("aria-expanded","false");}));
document.getElementById("newsletterForm").addEventListener("submit",event=>{
  event.preventDefault();
  document.getElementById("formMessage").textContent="Esta é só uma demonstração: configure um serviço de newsletter para receber inscrições.";
});
document.getElementById("year").textContent=new Date().getFullYear();
