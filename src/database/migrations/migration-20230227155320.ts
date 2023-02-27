import { Migration } from '@mikro-orm/migrations';

export class Migration20230227155320 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `demo` add column `iframe_url` text null;');
  }
}
