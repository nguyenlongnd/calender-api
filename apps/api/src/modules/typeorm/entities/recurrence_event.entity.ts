import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { CommonTimeStamp } from './common.entity'


@Entity({
  name: 'events',
  schema: process.env.PG_SHCEMA_ADMIN
})
export class RecurrenEventEntity extends CommonTimeStamp {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' }) // For cross schema join, schema "core_admin"
  creator_id: string

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  end: string

  @Column()
  start: string
}
