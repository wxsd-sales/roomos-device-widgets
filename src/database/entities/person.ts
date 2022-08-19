import 'reflect-metadata';
import { Collection, Entity, OneToMany, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { FavoriteContact } from './favorite-contact';

@Entity()
export class Person extends BaseEntity {
  @Property({ type: types.string, nullable: true })
  email?: string;

  @OneToMany({ entity: () => FavoriteContact, mappedBy: 'person', orphanRemoval: true })
  favoriteContacts = new Collection<FavoriteContact>(this);

  @OneToMany({ entity: () => FavoriteContact, mappedBy: 'person', orphanRemoval: true })
  favoriteSpaces = new Collection<FavoriteContact>(this);

  constructor(uuid: string = crypto.randomUUID()) {
    super(uuid);
  }
}
