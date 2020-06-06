import connKnex from "../database/connection";
import { Request, Response } from "express";

export default class LocaisController {
  async create(req: Request, res: Response) {
    const {
      nome,
      email,
      whatsapp,
      latitude,
      longitude,
      cidade,
      uf,
      itens,
    } = req.body;

    const trx = await connKnex.transaction();
    // .transaction: usa-se no lugar do proprio knex(connKnex)(conexao).... para fazer com que todas as queries sejam relacionadas e dependam uma das outras. Caso uma falhe, a outra nao funcionará

    const novoLocal = {
      Imagem: `http://192.168.100.19:1010/uploads/${req.file.filename}`,
      nome,
      email,
      whatsapp,
      latitude,
      longitude,
      cidade,
      uf,
    };

    // quando o knex cria um novo registro, ele retorna o Id do mesmo
    const returnIdCreated = await trx("tb_Locais").insert(novoLocal);

    const createdIdLocal = returnIdCreated[0];

    const LocaisItens = itens
      .split(",")
      .map((x: string) => Number(x.trim()))
      .map((IdItem: number) => {
        return {
          IdItem,
          IdLocal: createdIdLocal,
        };
      });

    await trx("tb_LocaisItens").insert(LocaisItens);
    await trx.commit();
    // encerrar a transaction e de fato executa as queries

    return res.json({ IdLocal: createdIdLocal, ...novoLocal });
  }

  async show(req: Request, res: Response) {
    const idLocalBuscado = req.params.idLocal;

    const localBuscado = await connKnex("tb_Locais")
      .where("IdLocal", idLocalBuscado)
      .first();

    if (!localBuscado)
      return res.status(400).json({ errorMessage: "local nao encontrado" });

    const itensDoLocal = await connKnex("tb_Itens")
      .join("tb_LocaisItens", "tb_Itens.IdItem", "=", "tb_LocaisItens.IdItem")
      .where("tb_LocaisItens.IdLocal", idLocalBuscado)
      .select("tb_Itens.nome");

    return res.json({ localBuscado, itensDoLocal });
  }

  async index(req: Request, res: Response) {
    const { cidade, uf, itens } = req.query;
    const parsedItens = String(itens)
      .split(",")
      .map((x) => Number(x.trim()));

    if (parsedItens === []) {
      res.json([]);
    }
    const locaisFiltrados = await connKnex("tb_Locais")
      .join(
        "tb_LocaisItens",
        "tb_Locais.IdLocal",
        "=",
        "tb_LocaisItens.IdLocal"
      )
      .whereIn("tb_LocaisItens.IdItem", parsedItens)
      .where("cidade", String(cidade))
      .where("uf", String(uf))
      .distinct()
      .select("tb_Locais.*");

    return res.json(locaisFiltrados);
  }
}

// Serializacao
// API response transform
