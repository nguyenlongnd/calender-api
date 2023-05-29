import { CreateDateColumn, UpdateDateColumn } from 'typeorm'

export class CommonTimeStamp {
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at'
  })
  createdAt?: Date

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at'
  })
  updatedAt?: Date
}
