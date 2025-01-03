import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}
 

 @Get('all')
  async getAll() {
    return await this.appService.getAll();
  }

  @Get('listing')
  async fetchListing(@Query('offset') offset: number, @Query('limit') limit: number) {
    return await this.appService.fetchListing(offset, limit);
  }
  
  @Get('search')
  async search(@Query('searchTerm') searchTerm: string) {
    return await this.appService.search(searchTerm);
  }

  @Get('location')
  async getByCurrentLocation(@Query('lat') lat: number, @Query('lon') lon: number) {
    return await this.appService.getByCurrentLocation(lat, lon);
  }

  @Get('map')
  async getByMapCenter(@Query('latNortheast') latNortheast: number, @Query('lonNortheast') lonNortheast: number, @Query('latSouthwest') latSouthwest: number, @Query('lonSouthwest') lonSouthwest: number) {
    return await this.appService.getByMapCenter(latNortheast, lonNortheast, latSouthwest, lonSouthwest);
  }
}
