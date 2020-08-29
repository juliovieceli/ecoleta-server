import knex from '../database/connection';
import { Request, Response } from 'express';

class PointsController {
    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        console.log({ city, uf, items })

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()))

        const points = await knex('points')
            .join('pointItems', 'points.id', '=', 'pointItems.idPoint')
            .whereIn('pointItems.idItem', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');


        const serializedPoints = points.map(point => {
            return {
                ...point,
                //imageUrl: `http://localhost:3333/uploads/${item.image}`
                imageUrl: `http://192.168.15.6:3333/uploads/${point.image}`
            }
        })

        return response.json(serializedPoints)
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;
        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'Point not found.' })
        }
        const serializedPoints = {
            ...point,
            //imageUrl: `http://localhost:3333/uploads/${item.image}`
            imageUrl: `http://192.168.15.6:3333/uploads/${point.image}`
        }


        const items = await knex('items')
            .join('pointItems', 'items.id', '=', 'pointItems.idItem')
            .where('pointItems.idPoint', id)
            .select('items.title')

        return response.json({ point: serializedPoints, items })
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const insertedIds = await trx('points').insert(point);
        const idPoint = insertedIds[0]

        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((idItem: number) => {
                return {
                    idItem,
                    idPoint
                }
            });

        await trx('pointItems').insert(pointItems);
        await trx.commit();

        return response.json({
            id: idPoint,
            ...point
        });

    }
}

export default PointsController; 