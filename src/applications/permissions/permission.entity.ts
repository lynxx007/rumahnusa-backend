import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
      id: string;

    @Column('varchar')
      title: string;

    @CreateDateColumn()
      created_at: Date;

    @UpdateDateColumn()
      updated_at: Date;

}
