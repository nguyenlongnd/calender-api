import { Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'user',
  schema: 'core_admin',
  synchronize: false
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string
}
