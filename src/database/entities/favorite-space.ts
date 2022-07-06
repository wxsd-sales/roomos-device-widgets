import 'reflect-metadata';
import { Entity, ManyToOne, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { Person } from './person';

@Entity()
export class FavoriteSpace extends BaseEntity {
  @ManyToOne({ entity: () => Person, onDelete: 'cascade' })
  person!: Person;

  @Property({ type: types.string })
  spaceId!: string;
}
