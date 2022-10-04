import { Migration } from '@mikro-orm/migrations';

export class Migration20221004210859 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `demo` add column `favorite_contacts_type` integer null;');
  }
}
