import { 
  Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  Entity, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn, 
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Permission } from '../permissions/permission.entity';

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

    @OneToMany(() => User, (user) => user.role)
      users: User[];

    @ManyToMany(() => Permission)
    @JoinTable({ name: 'role_permissions' })
      permissions: Permission[];

}
