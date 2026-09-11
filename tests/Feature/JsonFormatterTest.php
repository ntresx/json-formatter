<?php

namespace Tests\Feature;

use Tests\TestCase;

class JsonFormatterTest extends TestCase
{
    public function test_formatter_page_is_available(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('JSON Formatter');
        $response->assertSee('Load Example');
        $response->assertSee('Format');
        $response->assertSee('Minify');
        $response->assertSee('Validate');
    }

    public function test_page_does_not_expose_server_storage_features(): void
    {
        $response = $this->get('/');

        $response->assertDontSee('database');
        $response->assertDontSee('authentication');
    }
}
