import { TarefaStatus } from 'src/tarefas/interfaces/tarefa.enum';
import { Usuario } from 'src/usuarios/entities/usuario/usuario.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tarefas')
export class Tarefa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  descricao: string;

  @Column({ type: 'enum', enum: TarefaStatus, default: TarefaStatus.PENDENTE })
  status: TarefaStatus;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm!: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.tarefas, {
    onDelete: 'CASCADE',
  })
  usuario: Usuario;

  @Column()
  usuarioId: string;
}
