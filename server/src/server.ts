import express from "express";
import routes from "./routes";
import path from "path";
import cors from "cors";
import { errors } from "celebrate";

const app = express();

app.use(cors()); // define que dominio acessa a api com permissao
app.use(express.json()); // faz com que a aplicacao receba Json
app.use(routes); // faz com que as rotas vindas de 'routes' sejam validas

//#region ANOTACOES - (ROTAS, RECURSOS, HTTP METHOD, PARAMENTOS DA ROTA)
//rota: endereco completo da requisicao
//recurso: qual entidade a rota esta acessando

//get: buscar 1 ou mais informacoes do back-end
//post: criar uma nova informacao no back-end
//put: atualizar uma informacao existente no back-end
//delete: remover informacao do back-end

//request params: paramentros que vem a propria rota, que identificam um recurso
//query params: parametros que vem na propria rota, geralmente opcionais, para filtro... paginacao... etc
//request body: parametros para criacao e atualizacao de informacoes
//#endregion

//#region Teste de rotas
const userTestesTeste = ["madson", "sarah", "iago"];

app.get("/teste", (req, res) => {
  const search = String(req.query.search);

  const filtereduserTestesTeste = search
    ? userTestesTeste.filter((userTeste) => userTeste.includes(search))
    : userTestesTeste;

  res.json(filtereduserTestesTeste);
});

app.get("/teste/:id", (req, res) => {
  const id = Number(req.params.id);

  const userTeste = userTestesTeste[id];

  return res.json(userTeste);
});

app.post("/teste", (req, res) => {
  const name = req.body.name;
  const idade = req.body.idade;
  const userTeste = { name: name, idade: idade };
  return res.json(userTeste);
});
//#endregion

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));
/* express.static(): metodo do Express para servir arquivos estaticos(.docx/.jpg ... .etc), de uma pasta determinada , para download ou uso */
app.use(errors);
app.listen(1010);
