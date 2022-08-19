import 'reflect-metadata';
import { PrimaryKey, Property, types } from '@mikro-orm/core';

export abstract class BaseEntity {
  @PrimaryKey({ type: types.uuid })
  uuid = crypto.randomUUID();

  @Property({ type: types.datetime, onCreate: () => Date.now(), defaultRaw: 'current_timestamp' })
  createdAt = Date.now();

  @Property({ type: types.datetime, onUpdate: () => Date.now(), defaultRaw: 'current_timestamp' })
  updatedAt = Date.now();

  constructor(uuid: string = crypto.randomUUID()) {
    this.uuid = uuid;
  }
}
