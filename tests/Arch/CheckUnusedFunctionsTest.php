<?php

declare(strict_types=1);

test('ensure not to use helpers')
    ->expect(['dd', 'dump', 'var_dump', 'env', 'info'])
    ->not->toBeUsed();
