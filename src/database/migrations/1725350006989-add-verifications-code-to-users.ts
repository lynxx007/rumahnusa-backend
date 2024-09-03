import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerificationsCodeToUsers1725350006989 implements MigrationInterface {
    name = 'AddVerificationsCodeToUsers1725350006989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "verification_code" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "verification_exp_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_verified" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_verified"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verification_exp_date"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verification_code"`);
    }

}
