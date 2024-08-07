import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
      id: string;

    @Column('varchar')
      title: string;

    @CreateDateColumn()
      created_at: Date;

    @UpdateDateColumn()
      updated_at: Date;

    @DeleteDateColumn()
      deleted_at: Date;

}
