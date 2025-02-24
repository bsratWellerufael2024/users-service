import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fname: string;

  @Column()
  lname: string;

  @Column({nullable:false})
  uname: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

}
