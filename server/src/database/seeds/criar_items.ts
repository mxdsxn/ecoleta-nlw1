import Knex from "knex";

export async function seed(knex: Knex) {
  await knex("tb_Itens").insert([
    {
      nome: "Lampadas",
      Imagem: "lampadas.svg",
    },
    {
      nome: "Pilhas e Baterias",
      Imagem: "baterias.svg",
    },
    {
      nome: "Papeis e Papelao",
      Imagem: "papeis-papelao.svg",
    },
    {
      nome: "Residuos Eletronicos",
      Imagem: "eletronico.svg",
    },
    {
      nome: "Residuos Organicos",
      Imagem: "organico.svg",
    },
    {
      nome: "Oleo de Cozinha",
      Imagem: "oleo.svg",
    },
  ]);
}


//#region 
/*
Seeds: servem para popular a base de dados no inicio da aplicacao
*/
//#endregion