
# Event Reminder App

Event Reminder Web Application from Techzu

## Requirements
- PHP 8.3.x
- Node 20.x
- Enabled PHP extensions for [Laravel Excel](https://docs.laravel-excel.com/3.1/getting-started/installation.html) (example: zip, gd, and etc)
- Generate cacert.pem file and add into directory "php/extras/ssl" (Check in directory "php/extras/ssl" if exist)

## Run Locally

Install Dependencies

```bash
  composer install && npm install
```

Run migration

```bash
  php artisan migrate 
```

Build the assets

```bash
  npm run build 
```

Run several server listener in different terminal

```bash
  php artisan serve
```

```bash
  php artisan queue:listen
```

```bash
  php artisan reverb:start
```

Run scheduler in different terminal

```bash
  php artisan schedule:run
```

You can check due time scheduler 

```bash
  php artisan schedule:list
```

## Additional Info
- You can use mockCSVData.csv file to test the import feature.
- You can make customization due time scheduler in "routes/console.php"

## Authors

- [@waynemamahit](https://www.github.com/waynemamahit)


## License

[MIT](https://github.com/waynemamahit/techzu-event-reminder-app/blob/main/LICENSE)
