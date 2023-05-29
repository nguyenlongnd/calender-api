import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { CommonTimeStamp } from './common.entity'

@Entity({
  name: 'meeting_room',
  schema: process.env.PG_SCHEMA,
  synchronize: true
})
export class RoomEntity extends CommonTimeStamp {
  @PrimaryGeneratedColumn()
  id?: string

  @Column({
    type: 'varchar',
    length: 32,
    nullable: false,
    unique: true
  })
  name?: string

  @Column({
    type: 'varchar',
    length: 55,
    nullable: false
  })
  location: string

  @Column({
    type: 'simple-array',
    default: []
  })
  devices: string[]

  @Column({
    type: 'varchar',
    length: 55,
    nullable: true
  })
  description: string

  @Column({
    type: 'int',
    nullable: false
  })
  capacity: number

  @Column({
    length: 11,
    nullable: true,
    default: 'opening'
  })
  status: string

  @Column({
    length: 11,
    default: '0'
  })
  colorId: string
}
