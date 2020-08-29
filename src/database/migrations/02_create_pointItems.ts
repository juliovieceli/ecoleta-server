import Knex from 'knex';

export async function up(knex:Knex){
    //commit
    return knex.schema.createTable('pointItems', table => {
        table.increments('id').primary();
        table.integer('idPoint')
            .notNullable()
            .references('id')
            .inTable('points')
        table.integer('idItem')
            .notNullable()
            .references('id')
            .inTable('items')
    });
}
export async function down(knex:Knex){
    //rollback
   return knex.schema.dropTable('points')
}