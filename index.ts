import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser()); 

dotenv.config();

const mongodb_uri = process.env.MONGO_URI;
const PORT = process.env.PORT

mongoose.set('strictQuery', true)

mongoose.connect(mongodb_uri!).then(res => {
  console.log("Connected to DB `test_DB`")
}).catch((err) => {
  console.log("At mongoose.connect:")
  console.log(err.message)
})

import userRoutes from "./API/users/usersRoutes";
app.use("/api/v1/users", userRoutes)

app.listen(PORT, () => {
  console.log(`Server is active on port : ${PORT}`);
});

//---ENV ---------------
//npm i dotenv
//----------------------

//https://jwt.io/
//user posilaet s klietnta email i pw, k primeru. email - unique. 
//Server sozdaet kak darkon dlya usera (unique JWT) i posilaet obratno cookie
//JWT moget soxranyt' informaziu i kak cookie i kak local storage.
//Vse peremeshaniya po saytu i lubie deystviya budut soprvogdat'sya etim darkonom
// user prosit kakoe-to deystvie - proveryaetsya kto on

//bscript - eto 1 put' kodirovki
//jwt - drugoy

//Nash cookie (token -  geton) budet sostoyt' iz 3 chastey cherez tochku:
// 1 -header, 2 - payload (полезная нагрузка)
//imenno payload soxranyaetsya v cookie {"id" : "qweqwreqwerqweqwghngfdc534"}
//Payload - eta ta informaziya , kotouyu mi xtim zakodirovat' i spryatat'
//3 - verifay signature - (xatima) . V hatime sohranyautsya 2 predidushue veshi - header i payload i + secret.
//v rezul'tate poluchaemToken , dlinnuyu stroku, kotoruyu bez sekreta nevozmogno raskodirovat'
//Token posilaetsyta s kagdoy nashey pros'boy. On budet shamur v Cookie ili Local Storage

// sozdaetsya v UserCtrl

// https://www.npmjs.com/package/jwt-simple    - otsuda ustanavliavem jwt-simple 
//npm i jwt-simple

//--------Eto site dlya sozdasniya secreta. Potom ego soxranyaem v ENV
//https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx

//k Prfimeru nagimaem na sekret 512bit
//Hex checkBox mogmo - yes . How Many - vibiraem skol'ko xotim. 

//sledit' gde userID i gde userId
// const decodedUserId = jwt.decode(userID, secret);
// const { userId } = decodedUserId; ///  {userId: ghfghdsfsdfsdfdsf} mi dolgni poluchiit'  userId= ghfghdsfsdfsdfdsf ne {userId: ghfghdsfsdfsdfdsf}, t.e. 2-u chast'


// Cookie (podtvergdenie usera) vsegda sozdavat' na login i ne vsegda na register. Inogda posle reghister est'
 //posilka e-mail i podtvergdenie. Eshe vsegda proveryat' usera na lubom deystvii na ser'znom na atare

 
// secret - zad server ( vse, chto v env - server)

//--------------local storage i session storage NA STORONE CLIENT--------------------------
//Gili ne rabotala s local storage i session storage - eto  dlya sitov, kotorie d'b otkritimi 24/7 kak facebook

//---------session storage - Window.sessionStorage -= pod oknom . Reasd Only
//session storage  pohog na local Storage. 
//Razniza -  data in local storage doezn't expire. Data in session storage ix cleared when the page session  ends.
//Kladen v session Atorgae ili kodirovanniy ili net. Kak reshim. Mopgnp polichit' ili iz cookie ili prosto s servera kak response

//---------local storage - Window.localStorage -= pod oknom . Reasd Only
//https://developer.mozilla.org/en-US/docs/Web/API/Window/
//localStorage is similar to sessionStorage, except that while localStorage data has no expiration time, sessionStorage data gets cleared when the page session ends — that is, when the page is closed. (localStorage data for a document loaded in a "private browsing" or "incognito" session is cleared when the last "private" tab is closed.)
//local storage  - zakroem i otkroem browser - ona soxranyyetsya


//----------------GLAVNOE---------------------
//Razniza megdu session/local storage i Cookie -- Cookie - tol'ko server side (vidim v browser , no dostup tol'ko cherez server) 
//Client ne shlet Cookie,  ne menyaet ix. nichego


// https://animista.net/   - site, kotoriy pridumivaet animazii dlya css

