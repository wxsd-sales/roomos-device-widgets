import { Migration } from '@mikro-orm/migrations';

export class Migration20230118024836 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `data` (`uuid` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `bits` blob not null, `name` text not null, `type` text not null, `last_modified` datetime not null, primary key (`uuid`));'
    );

    this.addSql(
      'create table `user` (`uuid` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `email` text not null, primary key (`uuid`));'
    );

    this.addSql(
      'create table `session` (`uuid` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `user_uuid` text null, `ip_address` text not null, `payload` json null, `user_agent` text null, `is_expired` integer null, `last_activity_at` datetime not null, constraint `session_user_uuid_foreign` foreign key(`user_uuid`) references `user`(`uuid`) on delete no action on update cascade, primary key (`uuid`));'
    );
    this.addSql('create index `session_user_uuid_index` on `session` (`user_uuid`);');

    this.addSql(
      'create table `demo` (`uuid` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `user_uuid` text not null, `name` text not null, `description` text null, `background_poster_uuid` text not null, `background_brightness` integer not null, `brand_logo_uuid` text not null, `brand_title` text not null, `brand_subtitle` text not null, `weather_units` integer not null, `weather_city_id` integer not null, `responder_auth_is_required` integer not null, `meeting_type_options` text not null, constraint `demo_user_uuid_foreign` foreign key(`user_uuid`) references `user`(`uuid`) on delete cascade on update cascade, constraint `demo_background_poster_uuid_foreign` foreign key(`background_poster_uuid`) references `data`(`uuid`) on delete cascade on update cascade, constraint `demo_brand_logo_uuid_foreign` foreign key(`brand_logo_uuid`) references `data`(`uuid`) on delete cascade on update cascade, primary key (`uuid`));'
    );
    this.addSql('create index `demo_user_uuid_index` on `demo` (`user_uuid`);');
    this.addSql('create index `demo_background_poster_uuid_index` on `demo` (`background_poster_uuid`);');
    this.addSql('create index `demo_brand_logo_uuid_index` on `demo` (`brand_logo_uuid`);');
  }
}
