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
import { Exclude } from 'class-transformer';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
      id: string;

    @Column('varchar')
      title: string;

    @CreateDateColumn()
      created_at: Date;

    @Exclude({ toPlainOnly: true })  
    @UpdateDateColumn()
      updated_at: Date;

    @Exclude({ toPlainOnly: true })  
    @DeleteDateColumn()
      deleted_at: Date;

    @OneToMany(() => User, (user) => user.role)
      users: User[];

    @ManyToMany(() => Permission)
    @JoinTable({ name: 'role_permissions' })
      permissions: Permission[];

}
