<?php

declare(strict_types=1);

use Illuminate\Console\Command;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Mail\Mailable;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\Component;

test('ensure commands using strict types')
    ->expect('Modules\Pos\Commands')
    ->toHaveSuffix('Command')
    ->toExtend(Command::class)
    ->toBeClasses()
    ->toBeFinal()
    ->toUseStrictTypes();

test('ensure contacts using strict types')
    ->expect('Modules\Pos\Contracts')
    ->toBeInterface()
    ->toUseStrictTypes();

test('ensure enums using strict types')
    ->expect('Modules\Pos\Enums')
    ->toHaveSuffix('Enum')
    ->toBeEnum()
    ->toUseStrictTypes();

test('ensure events using strict types')
    ->expect('Modules\Pos\Events')
    ->toHaveSuffix('Event')
    ->toImplement(ShouldBroadcastNow::class)
    ->toBeClasses()
    ->toBeFinal()
    ->toUseStrictTypes();

test('ensure exceptions using strict types')
    ->expect('Modules\Pos\Exceptions')
    ->toHaveSuffix('Exception')
    ->toExtend(Exception::class)
    ->toBeClasses()
    ->toBeFinal()
    ->toUseStrictTypes();

test('ensure helpers using strict types')
    ->expect('Modules\Pos\Helpers')
    ->toBeClasses()
    ->toBeFinal()
    ->toUseStrictTypes();

test('ensure controllers using strict types')
    ->expect('Modules\Pos\Http\Controllers')
    ->toHaveSuffix('Controller')
    ->toBeClasses()
    ->toExtendNothing()
    ->toBeFinal()
    ->toUseStrictTypes();

test('ensure requests using strict types')
    ->expect('Modules\Pos\Http\Requests')
    ->toHaveSuffix('Request')
    ->toExtend(FormRequest::class)
    ->toBeClasses()
    ->toBeFinal()
    ->toUseStrictTypes();

test('ensure resources using strict types')
    ->expect('Modules\Pos\Http\Resources')
    ->toExtend(JsonResource::class)
    ->toBeClasses()
    ->toBeFinal()
    ->toUseStrictTypes();

test('ensure jobs using strict types')
    ->expect('Modules\Pos\Jobs')
    ->toHaveSuffix('Job')
    ->toImplement(ShouldQueue::class)
    ->toBeClasses()
    ->toBeFinal()
    ->toUseStrictTypes();

test('ensure listeners using strict types')
    ->expect('Modules\Pos\Listeners')
    ->toBeClasses()
    ->toBeFinal()
    ->toUseStrictTypes();

test('ensure mails using strict types')
    ->expect('Modules\Pos\Mail')
    ->toHaveSuffix('Mail')
    ->toExtend(Mailable::class)
    ->toBeClasses()
    ->toBeFinal()
    ->toUseStrictTypes();

test('ensure models using strict types')
    ->expect('Modules\Pos\Models')
    ->toExtend(Model::class)
    ->toBeClasses()
    ->toBeFinal()
    ->toUseStrictTypes();

test('ensure observers using strict types')
    ->expect('Modules\Pos\Observers')
    ->toHaveSuffix('Observer')
    ->toBeClasses()
    ->toBeFinal()
    ->toUseStrictTypes();

test('ensure providers using strict types')
    ->expect('Modules\Pos\Providers')
    ->toHaveSuffix('Provider')
    ->toExtend(ServiceProvider::class)
    ->toBeClasses()
    ->toBeFinal()
    ->toUseStrictTypes();

test('ensure services using strict types')
    ->expect('Modules\Pos\Services')
    ->toHaveSuffix('Service')
    ->toBeClasses()
    ->toBeFinal()
    ->toUseStrictTypes();

test('ensure traits using strict types')
    ->expect('Modules\Pos\Traits')
    ->toBeTrait()
    ->toUseStrictTypes();

test('ensure components using strict types')
    ->expect('Modules\Pos\View\Components')
    ->toExtend(Component::class)
    ->toBeClasses()
    ->toBeFinal()
    ->toUseStrictTypes();
