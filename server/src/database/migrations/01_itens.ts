import Knex from "knex";

export async function up(knex: Knex) {
  //fazer alteracoes
  return knex.schema.createTable("tb_Itens", (table) => {
    table.increments("IdItem").primary();
    table.string("Imagem").notNullable();
    table.string("nome").notNullable();
  });
}
export async function down(knex: Knex) {
  //voltar alteracoes
  return  knex.schema.dropTable("tb_Itens");
}
