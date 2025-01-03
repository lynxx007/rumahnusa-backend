import { Injectable, OnModuleInit } from '@nestjs/common';
import { create, insertMultiple, search } from '@orama/orama';
import * as data from '../json/new-data.json';
@Injectable()
export class AppService implements OnModuleInit {
    private db: any

    
  async onModuleInit() {
      this.db = create({
        schema: {
            market_title: "string",
            _geoloc: "geopoint",
            image: "string[]",
            price: "number",
            listing_id: "string",
        }
      })
      try {
        //@ts-ignore
        await insertMultiple(this.db, data);
        console.log("data inserted");
      } catch (error) {
        console.log('error while inserting data',error);
      }
      
  }

  async getAll() {
    return await search(this.db,{
        limit: 1000
    });
  }
  async search(searchTerm: string) {
    return await search(this.db, {
        term: searchTerm,
        limit: 10
    });
  }

  async getByCurrentLocation(lat: number, lon: number) {
    return await search(this.db, {
        limit: 1000,
        where: {
            _geoloc: {
                radius: {
                    coordinates: {
                        lat: lat,
                        lon: lon,
                      },
                      value: 100000,
                      inside: true,
                      unit: "km",
                }
            }
        }
    })
  }

  async getByMapCenter(latNortheast: number, lonNortheast: number, latSouthwest: number, lonSouthwest: number) {
    return await search(this.db, {
        limit: 1000,
        where: {
          _geoloc: {
            // Use polygon to match exact map boundaries
            polygon: {
              coordinates: [
                { lat: latNortheast, lon: lonNortheast },
                { lat: latSouthwest, lon: lonNortheast },
                { lat: latSouthwest, lon: lonSouthwest },
                { lat: latNortheast, lon: lonSouthwest },
                { lat: latNortheast, lon: lonNortheast },
              ],
            },
          },
        },
    });
  }
  async fetchListing(offset: number, limit: number) {
    return await search(this.db, {
        limit: limit,
        offset: offset
    })
  }
}
