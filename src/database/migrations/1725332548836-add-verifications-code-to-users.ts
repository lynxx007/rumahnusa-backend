import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVerificationsCodeToUsers1725332548836 implements MigrationInterface {
  name = 'AddVerificationsCodeToUsers1725332548836';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" ADD "verification_code" character varying');
    await queryRunner.query('ALTER TABLE "users" ADD "verification_exp_date" date');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "verification_exp_date"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "verification_code"');
  }

}
