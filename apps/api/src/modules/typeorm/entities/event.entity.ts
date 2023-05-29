import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { CommonTimeStamp } from './common.entity'
import { RecurrenEventEntity } from './recurrence_event.entity'

@Entity({
  name: 'events',
  schema: process.env.PG_SHCEMA_ADMIN
})
export class EventEntity extends CommonTimeStamp {
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

  @ManyToOne(() => RecurrenEventEntity)
  @JoinColumn({ name: 'recurrenceId' })
  recurrenceId: RecurrenEventEntity
}

export class EventBaseEntity extends CommonTimeStamp {
  @PrimaryColumn()
  id: string

  @Column()
  status: string

  @Column()
  summary: string

  @Column()
  colorId: string
}
