import 'reflect-metadata';
import { v4 } from 'uuid';
import { PrimaryKey, Property, types } from '@mikro-orm/core';

export abstract class BaseEntity {
  @PrimaryKey({ type: types.uuid })
  uuid = v4();

  @Property({ type: types.datetime, onCreate: () => Date.now(), defaultRaw: 'current_timestamp' })
  createdAt = Date.now();

  @Property({ type: types.datetime, onUpdate: () => Date.now(), defaultRaw: 'current_timestamp' })
  updatedAt = Date.now();

  constructor(uuid: string = v4()) {
    this.uuid = uuid;
  }
}
