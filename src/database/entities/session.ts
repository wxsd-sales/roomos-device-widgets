import 'reflect-metadata';
import type { JSONObject } from '@sveltejs/kit/types/private';
import { Entity, ManyToOne, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { User } from './user';

@Entity()
export class Session extends BaseEntity {
  @ManyToOne({ entity: () => User, nullable: true, onDelete: 'no action' })
  user?: User;

  @Property({ type: types.string })
  ipAddress!: string;

  @Property({ type: types.json, nullable: true })
  payload?: JSONObject;

  @Property({ type: types.string, nullable: true })
  userAgent?: string;

  @Property({ type: types.boolean, nullable: true })
  isExpired?: boolean;

  @Property({ type: types.datetime, onCreate: () => new Date() })
  lastActivityAt!: number;

  constructor(obj: {
    user?: User;
    ipAddress: string;
    payload?: JSONObject;
    userAgent?: string;
    isExpired?: boolean;
    lastActivityAt: number;
  }) {
    super();
    this.user = obj.user;
    this.ipAddress = obj.ipAddress;
    this.payload = obj.payload;
    this.userAgent = obj.userAgent;
    this.isExpired = obj.isExpired;
    this.lastActivityAt = obj.lastActivityAt;
  }
}
