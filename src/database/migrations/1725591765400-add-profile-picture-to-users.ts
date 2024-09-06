import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfilePictureToUsers1725591765400 implements MigrationInterface {
  name = 'AddProfilePictureToUsers1725591765400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" ADD "profile_picture" character varying');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "profile_picture"');
  }

}
