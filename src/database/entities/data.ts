import 'reflect-metadata';
import { Entity, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';

@Entity()
export class Data extends BaseEntity {
  @Property({ type: types.blob })
  bits!: Buffer | string;

  @Property({ type: types.string })
  name!: string;

  @Property({ type: types.string })
  type!: string;

  @Property({ type: types.datetime })
  lastModified: number;

  constructor(obj: { bits: Buffer | string; name: string; type: string; lastModified: number }) {
    super();
    this.bits = obj.bits;
    this.name = obj.name;
    this.type = obj.type;
    this.lastModified = obj.lastModified;
  }
}
