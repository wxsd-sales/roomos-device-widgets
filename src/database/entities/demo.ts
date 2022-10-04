import 'reflect-metadata';
import { Entity, ManyToOne, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { User } from './user';
import { Data } from './data';
import type { FavoriteContactsTypes } from '$lib/types';

@Entity()
export class Demo extends BaseEntity {
  @ManyToOne({ entity: () => User, onDelete: 'cascade' })
  user!: User;

  @Property({ type: types.string })
  name!: string;

  @Property({ type: types.string, nullable: true })
  description?: string;

  @ManyToOne({ entity: () => Data, onDelete: 'cascade' })
  backgroundPoster!: Data;

  @Property({ type: types.integer })
  backgroundBrightness!: number;

  @ManyToOne({ entity: () => Data, onDelete: 'cascade' })
  brandLogo!: Data;

  @Property({ type: types.string })
  brandTitle!: string;

  @Property({ type: types.string })
  brandSubtitle!: string;

  @Property({ type: types.string, nullable: true })
  buttonAText?: string;

  @Property({ type: types.string, nullable: true })
  buttonALink?: string;

  @Property({ type: types.string, nullable: true })
  buttonBText?: string;

  @Property({ type: types.string, nullable: true })
  buttonBLink?: string;

  @Property({ type: types.string, nullable: true })
  buttonCText?: string;

  @Property({ type: types.string, nullable: true })
  buttonCLink?: string;

  @Property({ type: types.enum, nullable: true })
  favoriteContactsType!: 'custom' | 'fixed';

  @Property({ type: types.string, nullable: true })
  guestInviteDestination?: string;

  @Property({ type: types.string, nullable: true })
  newsUrl?: string;

  @Property({ type: types.enum })
  weatherUnits!: 'imperial' | 'metric' | 'standard';

  @Property({ type: types.integer })
  weatherCityId!: number;

  constructor(obj: {
    user: User;
    name: string;
    description?: string;
    backgroundPoster: Data;
    backgroundBrightness: number;
    brandLogo: Data;
    brandTitle: string;
    brandSubtitle: string;
    buttonAText?: string;
    buttonALink?: string;
    buttonBText?: string;
    buttonBLink?: string;
    buttonCText?: string;
    buttonCLink?: string;
    favoriteContactsType: 'fixed' | 'custom';
    guestInviteDestination?: string;
    newsUrl?: string;
    weatherUnits: 'imperial' | 'metric' | 'standard';
    weatherCityId: number;
  }) {
    super();
    this.user = obj.user;
    this.name = obj.name;
    this.description = obj.description;
    this.backgroundPoster = obj.backgroundPoster;
    this.backgroundBrightness = obj.backgroundBrightness;
    this.brandLogo = obj.brandLogo;
    this.brandTitle = obj.brandTitle;
    this.brandSubtitle = obj.brandSubtitle;
    this.buttonAText = obj.buttonAText;
    this.buttonALink = obj.buttonALink;
    this.buttonBText = obj.buttonBText;
    this.buttonBLink = obj.buttonBLink;
    this.buttonCText = obj.buttonCText;
    this.buttonCLink = obj.buttonCLink;
    this.favoriteContactsType = obj.favoriteContactsType;
    this.guestInviteDestination = obj.guestInviteDestination;
    this.newsUrl = obj.newsUrl;
    this.weatherUnits = obj.weatherUnits;
    this.weatherCityId = obj.weatherCityId;
  }
}
