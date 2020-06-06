import Knex from "knex";

export async function up(knex: Knex) {
  //fazer alteracoes
  return knex.schema.createTable("tb_LocaisItens", (table) => {
    table.increments("IdLocalItens").primary();
    table
      .integer("IdLocal")
      .notNullable()
      .references("IdLocal")
      .inTable("tb_Locais")
       .unsigned(); // .unsigned pois como é uma FK para uma PK criada pelo Knex, ela é sempre Unsigned

    table
      .integer("IdItem")
      .notNullable()
      .references("IdItem")
      .inTable("tb_Itens")
      .unsigned();
  });
}
export async function down(knex: Knex) {
  //voltar alteracoes
  return knex.schema.dropTable("tb_LocaisItens");
}
