import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
      id: string;

    @Column('varchar')
      title: string;
    
    @CreateDateColumn()
    @Exclude({ toPlainOnly: true })
      created_at: Date;

    @UpdateDateColumn()
    @Exclude({ toPlainOnly: true })
      updated_at: Date;

}
