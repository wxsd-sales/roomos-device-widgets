import { Migration } from '@mikro-orm/migrations';

export class Migration20221208000000 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `activation` add column `microsoft_tenant_id` text null;');
    this.addSql('alter table `activation` add column `microsoft_client_id` text null;');
    this.addSql('alter table `activation` add column `microsoft_private_key` text null;');
    this.addSql('alter table `activation` add column `microsoft_client_certificate` text null;');
  }
}
