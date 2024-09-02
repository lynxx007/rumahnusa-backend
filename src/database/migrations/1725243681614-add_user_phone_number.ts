import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPhoneNumber1725243681614 implements MigrationInterface {
  name = 'AddUserPhoneNumber1725243681614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" ADD "phone_number" character varying');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "phone_number"');
  }

}
