<?php

namespace App\Console\Commands;

use Illuminate\Routing\Route;
use Illuminate\Routing\Router;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Filesystem\Filesystem;

class ExportRouteToJson extends Command
{
    /**
    * The name and signature of the console command.
    * @var string
    */
    protected $signature = 'route:exportroutetojson';

    /**
    * The console command description.
    * @var string
    */
    protected $description = 'Export routes to json for client application.';

    /**
    * File system instance
    * @var Filesystem
    */
    protected $file;

    /**
    * Router instance
    * @var Router
    */
    protected $router;

    /**
    * Create a new command instance.
    * @return void
    */
    public function __construct(Filesystem $file, Router $router)
    {
        parent::__construct();
        $this->file   = $file;
        $this->router = $router;
    }

    /**
    * Execute the console command.
    * @return mixed
    */
    public function handle()
    {
        $routes   = $this->getFilterRoute();
        $content  = $this->getJsonContent($routes);
        $filename = $this->getFile();

        if($this->file->isWritable($filename)) {
            return $this->file->put($filename, $content) !== false;
        }
    }

    /**
    * Get file path
    * @return string
    */
    protected function getFile() {
        return base_path('angular/routes.ts');
    }

    /**
    * Get all routes
    * @return Array
    */
    protected function getFilterRoute()
    {
        $routes = Collection::make($this->router->getRoutes()->getRoutes())->map(function ($route) {
            if ( $route->getName() ) {
                return [
                    'uri'  => $route->uri(),
                    'name' => $route->getName()
                ];
            }
            return null;
        })->filter();

        return $routes->values();
    }

    /**
    * Export Routes in JavaScript.
    * @param  array $data
    * @return string
    */
    protected function getJsonContent($data) {
        return 'export const Routes = ' . json_encode($data, JSON_PRETTY_PRINT) . ';';
    }
}
