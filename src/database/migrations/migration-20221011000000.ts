import { Migration } from '@mikro-orm/migrations';

export class Migration20221011000000 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `activation` add column `google_client_email` text null;');
    this.addSql('alter table `activation` add column `google_private_key` text null;');
    this.addSql('alter table `activation` add column `google_client_certificate` text null;');
  }
}
