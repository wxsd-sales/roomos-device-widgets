import 'reflect-metadata';
import { Entity, ManyToOne, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { Person } from './person';

@Entity()
export class FavoriteContact extends BaseEntity {
  @ManyToOne({ entity: () => Person, onDelete: 'cascade' })
  person!: Person;

  @Property({ type: types.string })
  contactId!: string;

  constructor(contactId: string) {
    super();
    this.contactId = contactId;
  }
}
