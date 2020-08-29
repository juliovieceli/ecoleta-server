import knex from '../database/connection';
import  {Request, Response} from 'express';

class ItemsController {
    async Index (request:Request, response:Response) {
        const items = await knex('items').select('*')
    
        const serializedItems = items.map(item => {
            return {
                id:item.id,
                title: item.title,
                //imageUrl: `http://localhost:3333/uploads/${item.image}`
                imageUrl: `http://192.168.15.6:3333/uploads/${item.image}`
            }
        })
    
        return response.json(serializedItems);
    }
};

export default ItemsController;