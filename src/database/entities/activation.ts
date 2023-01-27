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

  @Property({ type: types.string, nullable: true })
  googleClientEmail?: string;

  @Property({ type: types.string, nullable: true })
  googlePrivateKey?: string;

  @Property({ type: types.string, nullable: true })
  googleClientCertificate?: string;

  @Property({ type: types.string, nullable: true })
  microsoftTenantId?: string;

  @Property({ type: types.string, nullable: true })
  microsoftClientId?: string;

  @Property({ type: types.string, nullable: true })
  microsoftPrivateKey?: string;

  @Property({ type: types.string, nullable: true })
  microsoftClientCertificate?: string;

  constructor(obj: {
    botToken: string;
    deviceId: string;
    demo: Demo;
    googleClientEmail?: string;
    googlePrivateKey?: string;
    googleClientCertificate?: string;
    microsoftTenantId?: string;
    microsoftClientId?: string;
    microsoftPrivateKey?: string;
    microsoftClientCertificate?: string;
  }) {
    super();
    this.botToken = obj.botToken;
    this.deviceId = obj.deviceId;
    this.demo = obj.demo;
    this.googleClientEmail = obj.googleClientEmail;
    this.googlePrivateKey = obj.googlePrivateKey;
    this.googleClientCertificate = obj.googleClientCertificate;
    this.microsoftTenantId = obj.microsoftTenantId;
    this.microsoftClientId = obj.microsoftClientId;
    this.microsoftPrivateKey = obj.microsoftPrivateKey;
    this.microsoftClientCertificate = obj.microsoftClientCertificate;
  }
}
