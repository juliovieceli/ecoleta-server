import Knex from 'knex';

export async function up(knex:Knex){
    //commit
    return knex.schema.createTable('items', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
    });
}
export async function down(knex:Knex){
    //rollback
   return knex.schema.dropTable('items')
}