import express from "express";
import multer from "multer";
import { celebrate, Joi } from "celebrate";

import multerConfig from "./config/multer";

import LocaisController from "./controllers/LocaisController";
import ItensController from "./controllers/ItensController";
const locaisController = new LocaisController();
const itensController = new ItensController();
//instancia de uma controller com os metodos que interagem com o banco de dados

const routes = express.Router(); // faz com que esse arquivo tambem seja interpretado como rota, nao so o arquivo serve.ts
const upload = multer(multerConfig);

routes.get("/itens", itensController.index);

routes.post(
  "/Locais",
  upload.single("Imagem"),
  celebrate(
    {
      body: Joi.object().keys({
        nome: Joi.string().required(),
        email: Joi.string().required(),
        whatsapp: Joi.number().required(),
        uf: Joi.string().required().max(2),
        cidade: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        itens: Joi.string().required(),
      }),
    },
    { abortEarly: false }
  ),
  locaisController.create
);

routes.get("/Locais/:idLocal", locaisController.show);

routes.get("/Locais", locaisController.index);

export default routes;
