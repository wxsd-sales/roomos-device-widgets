import 'reflect-metadata';
import { Collection, Entity, OneToMany, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { Demo } from './demo';

@Entity()
export class User extends BaseEntity {
  @Property({ type: types.string, unique: true, nullable: true })
  webex_uuid!: string;

  @Property({ type: types.string })
  email!: string;

  @OneToMany({ entity: () => Demo, mappedBy: 'user', orphanRemoval: true })
  demos = new Collection<Demo>(this);

  constructor(webex_uuid: string, email: string) {
    super();
    this.email = email;
    this.webex_uuid = webex_uuid;
  }
}
