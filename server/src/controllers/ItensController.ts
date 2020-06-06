import connKnex from "../database/connection";
import { Request, Response } from "express";

export default class ItensController {
  async index(req: Request, res: Response) {
    const itens = await connKnex("tb_Itens").select("*");
    const serializedItens = itens.map((item) => {
      return {
        idItem: item.IdItem,
        nome: item.nome,
        imageUrl: `http://192.168.100.19:1010/uploads/${item.Imagem}`,
      };
    });

    return res.json(serializedItens);
  }
}

//#region ANOTACOES
/*
  padrao da comunidade para nome de metodos
    index: listagem de itens
    show: um unico item
    create: criar
    update: atualizar
    delete: apagar dados
*/
//#endregion
