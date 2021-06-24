
function iniciar(){
    $("#inicio").hide();

$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
$("#fundoGame").append("<div id='amigo' class='anima3'></div>");
$("#fundoGame").append("<div id='inimigo2'></div>");
$("#fundoGame").append("<div id='placar'> </div>");
$("#fundoGame").append("<div id='energia'></div>");

//Variáveis do jogo
var jogo = {};
var Tecla = {
    W: 87,
    S: 83,
    D: 68
}
jogo.pressionou = [];
var velocidade = 5;
var posicaoY = parseInt(Math.random() * 334);
var podeAtirar = true;
var fimDoJogo = false;
var pontos = 0;
var resgates = 0;
var perdidos = 0;
var nivelEnergia = 3;
var nivel2 = false;
var nivel3 = false;
var nivel4 = false;
var nivel5 = false;
var passagemDeNivel = false;
var contador = 5;
var pontosPerdidos = 0;
var somDisparo = window.document.querySelector("#somDisparo");
var somExplosão = window.document.querySelector("#somExplosao");
var somGameOver = window.document.querySelector("#somGameOver");
var musicaFundo = window.document.querySelector("#musicaFundo");
var somPerdido = window.document.querySelector("#somPerdido");
var somResgate = window.document.querySelector("#somResgate");

//Colocando a úsica de fundo
  musicaFundo.addEventListener("ended", function(){
      musicaFundo.tempoAtual = 0; 
      musicaFundo.play(); 
    });
    musicaFundo.play(); 
//Pegamos as teclas Pressionadas
$(document).keydown(function(e){
    jogo.pressionou[e.which] = true;
});

$(document).keyup(function(e){
    jogo.pressionou[e.which] = false;
});

jogo.timer = setInterval(loop, 30);

function loop(){
    moveFundo();
    if(passagemDeNivel == false){
        moveJogador();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
        colisoes();
    }
    placar();
    energia();
    proximoNivel();
   
}//Fim da função loop

//Função responsável por mover o fundo do jogo
function moveFundo(){
    var esquerda = parseInt($("#fundoGame").css("background-position"));
    $("#fundoGame").css("background-position", esquerda - 1);
}//Fim da função moveFundo

//Função que move o jogador
function moveJogador(){
    if(jogo.pressionou[Tecla.W]){
        var topo = parseInt($("#jogador").css("top"));
        $("#jogador").css("top", topo - 10);
        if(topo <= 0){
            $("#jogador").css("top", topo + 0.5);
        }
    }

    if(jogo.pressionou[Tecla.S]){
        var topo = parseInt($("#jogador").css("top"));
        $("#jogador").css("top", topo + 10);
        if(topo >= 435){
            $("#jogador").css("top", topo - 0.5);
        }
    }

    if(jogo.pressionou[Tecla.D]){
        disparo();
    }
}//Fim da função moveJogador

//Função que move o inimigo 1
    function moveInimigo1(){ 
        var posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoX - velocidade);
        $("#inimigo1").css("top", posicaoY);
        if(posicaoX <= 0){
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }
    }//Fim da função moveInimigo1

//Função que move o inimigo2
    function moveInimigo2(){
        var posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX - (velocidade - 2));
        if(posicaoX <= 0){
            $("#inimigo2").css("left", 790);
        }
    }//Fim da função moveInimigo2()

//Função que move o amigo
    function moveAmigo(){
        var posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX + 1);
        if(posicaoX >= 909){
            $("#amigo").css("left", 0);
        }
    }//Fim da função moveAmigo()

//Função que realiza o disparo
    function disparo(){
        somDisparo.play();
        if(podeAtirar == true){
            podeAtirar = false;
            var topo = parseInt($("#jogador").css("top"));
            var posicaoX = parseInt($("#jogador").css("left"));
            var topoTiro = topo + 40; 
            var tiroX = posicaoX + 192;
            $("#fundoGame").append("<div id='disparo'> </div>");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);
            var tempoDisparo = window.setInterval(velocidadeDisparo, 30);
        }//fim da condição de disparo

//Função para controlar a velocidade do disparo
        function velocidadeDisparo(){
            var posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15);
            if(posicaoX > 900){
                window.clearInterval(tempoDisparo);
                tempoDisparo = null; 
                $("#disparo").remove();
                podeAtirar = true; 
            }
        }//Fim da função velocidadeDisparo

    }//Fim da função disparo()

//Função responsável por detecter as colisões
function colisoes(){
    var colisao1 = $("#jogador").collision($("#inimigo1"));
    var colisao2 = $("#jogador").collision("#inimigo2");
    var colisao3 = $("#jogador").collision("#amigo");
    var colisao4 = $("#disparo").collision("#inimigo1");
    var colisao5 = $("#disparo").collision("#inimigo2");
    var colisao6 = $("#inimigo2").collision("#amigo");

//Colisão jogador com inimgo1
    if(colisao1.length >0){ 
        var inimigo1X = parseInt($("#inimigo1").css("left"));
        var inimigo1Y = parseInt($("#inimigo1").css("top"));
        explosao1(inimigo1X, inimigo1Y);
        $("#inimigo1").remove();
        reposicionaInimigo1();
        posicaoY = parseInt(Math.random() * 334);
        $("#inimigo1").css("left", 694);
        $("#inimigo1").css("top", posicaoY);
        nivelEnergia --;
    }//Fim da condição de colisão jogador e inimigo1

//Colisão jogador com inimigo2
    if(colisao2.length > 0){
        var inimigo2Y = parseInt($("#inimigo2").css("top"));
        var inimigo2X = parseInt($("#inimigo2").css("left"));
        explosao2(inimigo2X, inimigo2Y);
        $("#inimigo2").remove();
        if(passagemDeNivel == false){reposicionaInimigo2();}
        nivelEnergia --;
    } //Fim da condição jogador com inimigo2 

//Colisão disparo inimigo1
    if(colisao4.length > 0){
        var inimigo1X = parseInt($("#inimigo1").css("left"));
        var inimigo1Y = parseInt($("#inimigo1").css("top"));
        explosao1(inimigo1X, inimigo1Y);
        $("#disparo").css("left", 950);
        $("#inimigo1").remove();
    if(passagemDeNivel == false){reposicionaInimigo1();}
        posicaoY = parseInt(Math.random() * 334);
        $("#inimigo1").css("left", 694);
        $("#inimigo1").css("top", posicaoY);
        pontos += 100;
    }//Fim da condição disparo atingindo inimigo 1

//Colisão disparo inimigo2
 if(colisao5.length > 0){
            var inimigo2X = parseInt($("#inimigo2").css("left"));
            var inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);
            $("#inimigo2").remove();
            if(passagemDeNivel == false){reposicionaInimigo2();}
            pontos += 50;
        }//Fim da condição disparo atingindo inimigo 2

//Colisão do jogador com o amigo
        if(colisao3.length > 0){
        somResgate.play();
        if(passagemDeNivel == false){reposicionaAmigo();}
            $("#amigo").remove();
            resgates ++;
        }//Fim da condição colisão jogador com amigo

//Colisão amigo com inimigo2
        if(colisao6.length > 0){
            somPerdido.play();
            var amigoX = parseInt($("#amigo").css("left"));
            var amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX, amigoY);
            $("#amigo").remove();
            if(passagemDeNivel == false){reposicionaAmigo();}            
            perdidos ++;
            pontosPerdidos = 25;
            pontos -= pontosPerdidos;
            $("#fundoGame").append("<div id='placarPerdidos'></div>");
            $("#placarPerdidos").html("<h2>Voce perdeu: " + pontosPerdidos + " pontos" + "</h2>");
            retiraPlacarPerdidos();
        }//fim da Condição para a colisão do amigo com o inimigo2

}//Fim da função colisões

//Função que implementa a explosão
    function explosao1(inimigo1X, inimigo1Y){
        somExplosão.play();
        $("#fundoGame").append("<div id='explosao1'> </div>");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");
        var divExplosao1 = $("#explosao1");
        divExplosao1.css("left", inimigo1X);
        divExplosao1.css("top", inimigo1Y);
        divExplosao1.animate({width:300, opacity:0}, "slow");
        var tempoExplosao = window.setInterval(removeExplosao, 1000);

        function removeExplosao(){
            divExplosao1.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }
    }//Fim da função explosao1

//Função explosao2 que será chamada na colisão do inimigo2 com o jogador
function explosao2(inimigo2X, inimigo2Y){
            somExplosão.play();
            $("#fundoGame").append("<div id='explosao2'> </div>");
            $("#explosao2").css("background-image", "url(imgs/explosao.png)");            
            var divExplosao2 = $("#explosao2");
            divExplosao2.css("left", inimigo2X);
            divExplosao2.css("top", inimigo2Y);
            divExplosao2.animate({width:300, opacity:0}, "slow");
            var tempoExplosao = window.setInterval(removeExplosao, 1000);
            function removeExplosao(){
                divExplosao2.remove();
                window.clearInterval(tempoExplosao);
                tempoExplosao = null;
            }
        }//Fim da função explosao2

//Função que reposicionará o inimigo2 após ele ser removido do cenário
        function reposicionaInimigo2(){
            var tempoInimigo2 = window.setInterval(reposicionaIni2, 5000);
            function reposicionaIni2(){
                window.clearInterval(tempoInimigo2);
                tempoInimigo2 = null; 
                if(fimDoJogo == false | passagemDeNivel == false){
                    $("#fundoGame").append("<div id='inimigo2'> </div>");
                }
            }//Fim de reposicionaIni2
        }//Fim da função reposicionaInimigo2()

//Função que reposiciona o inimigo1
        function reposicionaInimigo1(){
                var tempoInimigo1 = window.setInterval(reposicionaIni1, 1000);
                function reposicionaIni1(){
                    window.clearInterval(tempoInimigo1);
                    tempoInimigo1 = null;
                    if(fimDoJogo == false | passagemDeNivel == false){
                        $("#fundoGame").append("<div id='inimigo1' class='anima2'> </div>");
                    }
                }//Fim de reposicionaIni1
            }//Fim da função reposicionaInimigo1()

//Função que vai reposicionar o amigo
            function reposicionaAmigo(){
                var tempoAmigo = window.setInterval(repoAmigo, 6000);
                function repoAmigo(){
                    window.clearInterval(tempoAmigo);
                    tempoAmigo = null; 
                    if(fimDoJogo == false | passagemDeNivel == false){
                        $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
                    }
                }//Fim da função repoAmigo
            }//Fim da função reposicionaAmigo()

//Função que vai colocar a explosão do amigo morrendo na tela 
    function explosao3(amigoX, amigoY){
        $("#fundoGame").append("<div id='explosao3' class='animaMorteAmigo'></dic>")
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);
        var tempoExplosao3 = window.setInterval(retiraExplosao3, 1000);
        function retiraExplosao3(){
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
            $("#explosao3").remove();
        }
    }//Fim da função explosao3         

//Função que vai atualizar o placar enquanto o jogo durar
    function placar(){
        $("#placar").html("<h2>Pontos: " + pontos + "  Resgates: " + resgates + "  Perdidos: " + perdidos + "</h2>");
    }//Fim da função placar()


//Função que vai mostrar o placar de números perdidos
function retiraPlacarPerdidos(){
        window.setTimeout(()=>{$("#placarPerdidos").remove();}, 4000);
        }//Fim da função placarPerdidos()

//Função energia que vai atualizar a barra de energia
    function energia(){
        if(nivelEnergia == 3){
            $("#energia").css("background-image", "url(imgs/energia3.png)");
        }
        if(nivelEnergia == 2){
            $("#energia").css("background-image", "url(imgs/energia2.png)");
        }
        if(nivelEnergia == 1){
            $("#energia").css("background-image", "url(imgs/energia1.png)");
        }
        if(nivelEnergia == 0){
            $("#energia").css("background-image", "url(imgs/energia0.png)");          
            gameOver();
            
        }
    }//Fim da função energia

//Função que será chamada quando o jogador conseguir atingir os pontos e passar de nvel 
     function proximoNivel(){
        
//Nível 2
        if(pontos >= 20000 && resgates >= 50 && nivel2 == false){
            velocidade += 0.5;
            passagemDeNivel = true;
            nivel2 = true;
           $("#jogador").remove();
            $("#fundoGame").append("<div id='contagem'></div>");
            var contagem = window.setInterval(() => {$("#contagem").html("<h1>" + contador + "</h1>"); 
            if(contador > 0){contador--;
                if(contador == 0){
                    $("#contagem").remove();
                    $("#fundoGame").append("<div id='nivel2'></div>");
                    $('#nivel2').on('click', recomecar1);
                }          
            }}, 1000);
            
            var tempoRetira = window.setInterval(retiraElementos, 1000);
                     
        }

            function recomecar1(){
                passagemDeNivel = false;
                window.clearInterval(tempoRetira);
                tempoRetira = null;
                window.clearInterval(contagem);
                contagem = null;
                $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
                $("#nivel2").remove();
                repoeElemetos();
                contador = 5;
            }//Fim da função recomecar1

//Nível 3
        if(pontos >= 40000 && resgates >= 100 && nivel3 == false){
            velocidade += 1;
            passagemDeNivel = true;
            nivel3 = true;
        $("#jogador").remove();
            $("#fundoGame").append("<div id='contagem'></div>");
            var contagem = window.setInterval(() => {$("#contagem").html("<h1>" + contador + "</h1>"); 
             if(contador > 0){contador--;
                if(contador == 0){
                    $("#contagem").remove();
                    $("#fundoGame").append("<div id='nivel3'></div>");
                    $('#nivel3').on('click', recomecar2);
                 }          
            }}, 1000);
            var tempoRetira = window.setInterval(retiraElementos, 1000);         
        }

        function recomecar2(){
                passagemDeNivel = false;
                window.clearInterval(tempoRetira);
                tempoRetira = null;
                window.clearInterval(contagem);
                contagem = null;
                $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
                $("#nivel3").remove();
                repoeElemetos();
            contador = 5;

            }//Fim da função recomecar2

//Nível 4
        if(pontos >= 60000 && resgates >= 150 && nivel4 == false){
            velocidade += 2;
            passagemDeNivel = true;
            nivel4 = true;
            $("#jogador").remove();
            $("#fundoGame").append("<div id='contagem'></div>");
            var contagem = window.setInterval(() => {$("#contagem").html("<h1>" + contador + "</h1>"); 
            if(contador > 0){contador--;
                if(contador == 0){
                    $("#contagem").remove();
                    $("#fundoGame").append("<div id='nivel4'></div>");
                    $('#nivel4').on('click', recomecar3);
                }          
            }}, 1000);
            var tempoRetira = window.setInterval(retiraElementos, 1000);      
        }

            function recomecar3(){
                passagemDeNivel = false;
                window.clearInterval(tempoRetira);
                tempoRetira = null;
                window.clearInterval(contagem);
                contagem = null;
                $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
                $("#nivel4").remove();
                repoeElemetos();
                contador = 5;
            }//Fim da função recomecar3

//Nível 5
        if(pontos >= 80000 && resgates >= 200 && nivel5 == false){
            velocidade += 4;
            passagemDeNivel = true;
            nivel5 = true;
            $("#jogador").remove();
            $("#fundoGame").append("<div id='contagem'></div>");
            var contagem = window.setInterval(() => {$("#contagem").html("<h1>" + contador + "</h1>"); 
            if(contador > 0){contador--;
                if(contador == 0){
                    $("#contagem").remove();
                    $("#fundoGame").append("<div id='nivel5'></div>");
                    $('#nivel5').on('click', recomecar4);
                }          
            }}, 1000);
            var tempoRetira = window.setInterval(retiraElementos, 1000);        
        }

            function recomecar4(){
                passagemDeNivel = false;
                window.clearInterval(tempoRetira);
                tempoRetira = null;
                window.clearInterval(contagem);
                contagem = null;
                $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
                $("#nivel5").remove();
                repoeElemetos();
                contador = 5;

            }//Fim da função recomecar4

//Faremos a condição para o final do jogo, quando o jogador vence o jogo
    if(pontos >= 100000 && resgates >= 250){
        vencendoJogo();
    }

    }//Fim da função proximoNivel

    //Função que retira os elementos do jogo
    function retiraElementos(){
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
    }

//Criamos agora a função que vai repor os elemento em cena
    function repoeElemetos(){
        $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
        $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
        $("#fundoGame").append("<div id='inimigo2'></div>");
    }

//Criaremos agora a função gameOver()
    function gameOver(){
        fimDoJogo = true;
        musicaFundo.pause();
        somGameOver.play();
        $("#jogador").remove();
        $("#fundoGame").append("<div id='contagem'></div>");
        contagem = window.setInterval(() => {$("#contagem").html("<h1>" + contador + "</h1>"); 
        if(contador > 0){contador--;
            if(contador == 0){
                $("#contagem").remove();
                $("#fundoGame").append("<div id='fim'></div>"); 
                $("#fim").html("<h1>Game Over!</h1>" + "<p> Sua pontuação foi: "+ "<br>" + "Pontos = "  + pontos + "<br>" 
                + "Resgates = " + resgates + "<br>"  + "Perdas = " + perdidos + "</p>" 
                + "<div id='reinicia' onClick=reiniciaJogo()><h3>Clique aqui para jogar novamente</h3></div>");
            }          
        }}, 1000);
        tempoRetira = window.setInterval(retiraElementos, 1000);
        window.clearInterval(jogo.timer);
        jogo.timer = null;
    }//Fim da função gameOver().

//Criaremos agora a função vencendoJogo()
function vencendoJogo(){
    passagemDeNivel = true;
    musicaFundo.pause();
    somGameOver.play();
    $("#jogador").remove();
    $("#fundoGame").append("<div id='contagem'></div>");
    contagem = window.setInterval(() => {$("#contagem").html("<h1>" + contador + "</h1>"); 
    if(contador > 0){contador--;
        if(contador == 0){
            $("#contagem").remove();
            $("#fundoGame").append("<div id='venceu'></div>"); 
            $("#venceu").html("<h1>Venceu o Jogo!</h1>" + "<p> Sua pontuação foi: "+ "<br>" + "Pontos = "  + pontos + "<br>" 
            + "Resgates = " + resgates + "<br>"  + "Perdas = " + perdidos + "</p>" 
            + "<div id='reinicia' onClick=reiniciaJogo2()><h3>Clique aqui para jogar novamente</h3></div>");
        }          
    }}, 1000);
    tempoRetira = window.setInterval(retiraElementos, 1000);
    window.clearInterval(jogo.timer);
    jogo.timer = null;    
        }//Fim da função vencendoJogo.

}//Fim da função iniciar

//Função que reinicia o jogo
    function reiniciaJogo(){
        window.clearInterval(tempoRetira);
        tempoRetira = null;
        window.clearInterval(contagem);
        contagem = null;
        somGameOver.pause();
        $("#fim").remove();
        iniciar();
    }//Fim da função reiniciaJogo()

    /**Criando a função que reinicia o jogo, esta função deve ser criada fora da função iniciar, já que dentro dela 
 * vamos chamar a função iniciar. */
     function reiniciaJogo2(){
        window.clearInterval(tempoRetira);
        tempoRetira = null;
        window.clearInterval(contagem);
        contagem = null;
        somGameOver.pause();
        $("#venceu").remove();
        iniciar();
            }//Fim da função reiniciaJogo()