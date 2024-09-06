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

  @Column('varchar')
    phone_number: string;

  @Column({ type: 'varchar', nullable: true, default: null })
    profile_picture: string;

  @Exclude({ toPlainOnly: true }) 
  @Column({ type: 'varchar', nullable: true, default: null })
    verification_code: string | null;
  
  @Exclude({ toPlainOnly: true })   
  @Column({ type: 'timestamp', nullable: true, default: null })
    verification_exp_date: Date | null;

  @Exclude({ toPlainOnly: true }) 
  @Column({ type: 'boolean', default: true })
    is_verified: boolean;

  @Exclude({ toPlainOnly: true })
  @Column('varchar')
    password: string;

  @CreateDateColumn()
    created_at: Date;

  @Exclude({ toPlainOnly: true })  
  @UpdateDateColumn()
    updated_at: Date;

  @Exclude({ toPlainOnly: true })  
  @DeleteDateColumn()
    deleted_at: Date;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
    role: Role;

}
