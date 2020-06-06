import Knex from "knex";

export async function up(knex: Knex) {
  //fazer alteracoes
  return knex.schema.createTable("tb_Locais", (table) => {
    table.increments("IdLocal").primary();
    table.string("Imagem").notNullable();
    table.string("nome").notNullable();
    table.string("email").notNullable();
    table.string("whatsapp").notNullable();
    table.decimal("latitude",10,8).notNullable();
    table.decimal("longitude",11,8).notNullable();
    table.string("cidade").notNullable();
    table.string("uf", 2).notNullable();
  });
}
export async function down(knex: Knex) {
  //voltar alteracoes
  return  knex.schema.dropTable("tb_Locais");
}

//#region ANOTACOES - MIGRATIONS
  /*
  Migrations: servem para enviar alteracoes no DB para outros devs que estao no projetos, e tambem, pra quem for clonar o repositorio
  nao necessariamente sao necessarias para a aplicacao funcionar em si
  */
//#endregion