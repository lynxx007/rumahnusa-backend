import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Role } from '../roles/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column('varchar')
    first_name: string;

  @Column('varchar')
    last_name: string;

  @Column('varchar')
    email: string;

  @Exclude({ toPlainOnly: true })
  @Column('varchar')
    password: string;

  @CreateDateColumn()
    created_at: Date;

  @Exclude({ toPlainOnly: true })  
  @UpdateDateColumn()
    updated_at: Date;

  @DeleteDateColumn()
    deleted_at: Date;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
    role: Role;
}
