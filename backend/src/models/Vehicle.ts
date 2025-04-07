import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column()
  year!: number;

  @Column()
  price!: number;

  @Column()
  range_km!: number;

  @Column()
  color!: string;

  @Column()
  condition!: string;

  @Column({ type: 'float' })
  battery_capacity_kWh!: number;

  @Column({ type: 'float' })
  charging_speed_kW!: number;

  @Column()
  seats!: number;

  @Column()
  drivetrain!: string;

  @Column()
  location!: string;

  @Column()
  autopilot!: boolean;

  @Column()
  kilometer_count!: number;

  @Column()
  accidents!: boolean;

  @Column({ nullable: true })
  accident_description?: string;

  @Column('simple-array', { nullable: true })
  images!: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
