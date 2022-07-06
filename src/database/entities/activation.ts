import 'reflect-metadata';
import { Entity, ManyToOne, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { Demo } from './demo';

@Entity()
export class Activation extends BaseEntity {
  @Property({ type: types.string })
  botToken!: string;

  @Property({ type: types.string })
  deviceId!: string;

  @ManyToOne({ entity: () => Demo, onDelete: 'cascade' })
  demo!: Demo;

  constructor(botToken: string, deviceId: string, demo: Demo) {
    super();
    this.botToken = botToken;
    this.deviceId = deviceId;
    this.demo = demo;
  }
}
