import { Tarefa } from 'src/tarefas/entities/tarefa/tarefa.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column()
  nome: string;

  @CreateDateColumn()
  criadoEm: Date;

  @OneToMany(() => Tarefa, (tarefa) => tarefa.usuario)
  tarefas: Tarefa[];
}
