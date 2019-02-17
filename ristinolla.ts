class GameState {
	// määritellään luokka: kaikki peliin liittyvä tieto
	player1 : string; // pelaaja1
	player2 : string; // pelaaja2
	//shift : number; // pelivuoro 1= pelaaja1 X, 2=pelaaja2 O

	// pelialue
	game_matrix : number [][] =[[0,0,0],[0,1,0],[0,0,0]]; // 0=pelaamaton, 1=X, 2=O, X aina alottaa keskeltä

};

//function init (){//Tää ei toiminu, kun game_status muuttu privaatiksi eikä muut funktiot enää löytäny sitä
  let game_status = new GameState (); // luodaan ilmentymä (=olio) pelin tiedoista
//}

function restart (){//idioottiratkaisu sen varmistukseksi, että aina alotetaan uus peli nolla-arvoilla
  game_status.game_matrix=[[0,0,0],[0,1,0],[0,0,0]];
}

function Change(imgKuva) {
    var i, j; // rivi- ja sarakeindeksit
    let stop: number; //apunumero pelin lopettamista varten
    i = parseInt(imgKuva.id.charAt(1));
    j = parseInt(imgKuva.id.charAt(3));

    console.log("click on " + i + " ja " + j + ", matrix in the beginning: " + game_status.game_matrix);//tarkistus

    if (game_status.game_matrix[i][j] != 0) { // paikka on jo pelattu
          alert("Paikka on jo merkattu, valitse toinen paikka.");
          return;//lopetetaan funktio eikä vaihdeta kuvaa tai tarkisteta, voittiko joku
    }
    else {
          stop=Win (game_status.game_matrix);//Tarkistetaan, onko peli vielä käynnissä
          if (stop==1){
              alert("Peli on jo päättynyt, lataa sivu uudelleen aloittaaksesi uuden pelin");
              return;
          }
          else if (stop==2){
              alert("Peli on jo päättynyt, lataa sivu uudelleen aloittaaksesi uuden pelin");
              return;
          }
          else {
              game_status.game_matrix[i][j] = 2;
              //merkittiin matriisiin 2, seuraavaksi vaihdetaan kuva
              ChangeO(imgKuva);
              stop = Win (game_status.game_matrix);//Tarkistetaan, toiko uusi siirto voittoa
              /*if (stop==1){//Tätä ei tarvita
              alert("Tietokone voitti, lataa sivu uudelleen aloittaaksesi uuden pelin");
              return;
              }*/
              if (stop==2){
                  alert("Sinä voitit, lataa sivu uudelleen aloittaaksesi uuden pelin");
                  return;
                }
                else {
                      Computer();
                      console.log("after computer() the matrix: " + game_status.game_matrix);
                      stop = Win (game_status.game_matrix);//Tarkistetaan, toiko uusi siirto voittoa
                      if (stop==1){
                          alert("Tietokone voitti, lataa sivu uudelleen aloittaaksesi uuden pelin");
                          return;
                      //the place for game end alert is here
                      }
                }
           }
    }
    return;
}

function ChangeX(rivi:number, sarake:number) {//tietokoneen siirto; we must call the random function
  //merkittävä matriisiin 1, vaihdettava kuva oikeaan paikkaan html:ssä
    let strID: string = "p" + rivi + "_" + sarake;
    let imgKuva = <HTMLImageElement>document.getElementById(strID);//kutsutaan HTML-koodin elementtiä ja vaihdetaan sen kuva
    imgKuva.src = "Cross.png";
}

function ChangeO(imgKuva) {
    imgKuva.src = "ball.jpg";
}

function Computer (){//arvotaan paikka, johon tietokone laittaa merkkinsä ja tarkistetaan, ettei se ole käytetty. Lähetetään paikan koordinaatit ChangeX-funktiolle.
  let rivi, sarake, stop: number;
  rivi= Math.floor ((Math.random() * 2)); //valitaan riveistä 0-2
  sarake= Math.floor ((Math.random() * 2));//valitaan sarakkeista 0-2
  if (game_status.game_matrix[rivi][sarake] == 0) {
      console.log("computer found place directly");
      game_status.game_matrix[rivi][sarake] = 1;//x matriisiin
      ChangeX(rivi, sarake);//x näytölle
      return;//homma hoidettu, palataan Change-funktioon
  }
  else if (game_status.game_matrix[rivi][sarake] != 0) { // paikka on jo pelattu
  //etsitään seuraava vapaa paikka matriisista
    let i, j, r, s, k, l: number;
    r=rivi;
    s=sarake;
    loop1:
    for (i=r; i<3; i++){//käydään läpi matriisin loppuosa
      loop2:
      for (j=s; j<3; j++){
          if (game_status.game_matrix[i][j] == 0){
            console.log("computer found place from the first loop");
              rivi=i;
              sarake=j;
              break loop1;
          }
      }
    }
    if (rivi != r || sarake != s){//eli nolla on löytynyt
      game_status.game_matrix[rivi][sarake] = 1;//x matriisiin
      ChangeX(rivi, sarake);//x näytölle
      return;//homma hoidettu, palataan Change-funktioon
    }
    else {//matriisin loppuosa käyty läpi löytämättä nollaa, käydään siis läpi vielä alkumatriisi
      console.log("Computer at second loop" + r + s);
      loopA:
      for (k=0; k<=2; k++){
          loopB:
          for (l=0; l<=2; l++){
            console.log("One loop done " + k + l)
            if (game_status.game_matrix[k][l] == 0){
              console.log("computer found place from the second loop");
              rivi=k;
              sarake=l;
              break loopA;
            }
          }
        }//alkuosakin käyty läpi, tarkistetaan, löytyikö tyhjää
        if (rivi != r || sarake != s){//eli nolla on löytynyt
          game_status.game_matrix[rivi][sarake] = 1;//x matriisiin
          ChangeX(rivi, sarake);//x näytölle
          return;//homma hoidettu, palataan Change-funktioon
        }
        else{//nyt on joko löydetty tyhjä paikka tai sitten koko matriisi on täynnä, mikä oikeesti ei pitäis olla mahdollista
          alert("All the places are used, the game has ended, reload the page.");
        }
    }
  }
}

function Win(game_matrix : number[][]){
    let i: number;//apunumero
    for (i=0; i<3; i++){
        if (game_matrix [i][0]==game_matrix[i][1]&&game_matrix[i][1]==game_matrix[i][2]){//tarkistetaan rivit

            if (game_matrix [i][0]==1){//Tässä vaiheessa tiedetään, että voitto tuli, tarkistetaan kummalle
                return 1;//tietokoneen voitto on 1
            }
            else if (game_matrix [i][0]==2){
                return 2;//pelaajan voitto on 2
            }
            else {//jos matriisin arvo ei ole 1 tai 2, siellä on tyhjää -> tarkistetaan muut
            }
        }
        else if (game_matrix [0][i]==game_matrix[1][i]&&game_matrix[1][i]==game_matrix[2][i]){//tarkistetaan sarakkeet
            if (game_matrix [0][i]==1){
                return 1;
            }
            else if (game_matrix [0][i]==2){
                return 2;
            }
            else {
            }
        }
        else if (game_matrix [0][0]==game_matrix[1][1]&&game_matrix[1][1]==game_matrix[2][2]){//tarkistetaan vinorivi vasemmasta yläkulmasta oikeaan alakulmaan
            if (game_matrix [0][0]==1){
                return 1;
            }
            else if (game_matrix [0][0]==2){
                return 2;
            }
            else {
            }
        }
        else if (game_matrix [0][2]==game_matrix[1][1]&&game_matrix[1][1]==game_matrix[2][0]){//tarkistetaan vinorivi vasemmasta alakumlasta oikeaan yläkulmaan
            if (game_matrix [0][2]==1){
                return 1;
            }
            else if (game_matrix [0][2]==2){
                return 2;
            }
            else {
            }
        }
    }
    return 0;
}
