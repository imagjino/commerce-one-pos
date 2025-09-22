<?php

declare(strict_types=1);

namespace Imagjino\POS\database\seeders;

use Illuminate\Database\Seeder;

final class PosDatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PermissionSeeder::class);
        $this->call(AdminPermissionSeeder::class);
    }
}
