import { Body, Controller, Post, Get, Put, Param, Delete, Query, UseGuards, Req, ParseFilePipeBuilder, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/const/storage.const';
import { UsersService } from './users.service';
import { CreateUsersPayload } from './payloads/createUsers.payload';
import { UpdateUsersPayload } from './payloads/updateUsers.payload';
import { HTTP_QUERY_PARAMS } from 'src/const/http.const';
import { JwtAuthGuard } from '../authentications/guards/jwt.guard';
import { PermissionGuard } from '../authentications/guards/permission.guard';
import { ChangePasswordPayload } from './payloads/changePassword.payload';
import { UpdateProfilePayload } from './payloads/updateProfile.payload';
import { BulkDeleteUserPayload } from './payloads/bulk-delete-users.payload';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, new PermissionGuard('view users'))
  index(
    @Req() request,
    @Query('page') page: number = HTTP_QUERY_PARAMS.DEFAULT_PAGE,
    @Query('limit') limit: number = HTTP_QUERY_PARAMS.DEFAULT_LIMIT,
  ) {
    const { id } = request.user;
    return this.usersService.paginate({ page, limit }, id);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() request) {
    return request.user || null ;
  }


  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  updateProfile(
    @Req() request,
    @Body() payload: UpdateProfilePayload,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5,
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: 422,
        })
    ) image: Express.Multer.File
  ) {
    return this.usersService.updateProfile(request.user, { ...payload, profile_picture: image?.path });
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Req() request, @Body() payload: ChangePasswordPayload){
    return this.usersService.changePassword(request.user, payload);
  } 

  @Get(':id')
  @UseGuards(JwtAuthGuard, new PermissionGuard('view users'))
  show(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @UseGuards(JwtAuthGuard, new PermissionGuard('create users'))
  create(
    @Body() payload: CreateUsersPayload,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5,
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: 422,
        })
    ) image: Express.Multer.File
  ) {
    return this.usersService.create({ ...payload, profile_picture: image?.path });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, new PermissionGuard('edit users'))
  @UseInterceptors(FileInterceptor('image', multerConfig))
  update(
    @Body() payload: UpdateUsersPayload, 
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5,
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: 422,
        })
    ) image: Express.Multer.File
  ) {
    return this.usersService.update({ ...payload, profile_picture: image?.path }, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, new PermissionGuard('delete users'))
  destroy(@Param('id') id: string) {
    return this.usersService.destroy(id);
  }

  @Post('/bulk-delete')
  @UseGuards(JwtAuthGuard, new PermissionGuard('delete users'))
  bulkDelete(@Body() payload: BulkDeleteUserPayload) {
    return this.usersService.bulkDelete(payload);
  }
}
