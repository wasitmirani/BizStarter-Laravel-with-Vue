<!DOCTYPE html>
<html lang="en" >
<head>

    <!-- Meta Data -->
    <meta charset="UTF-8">
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="Description" content="{{ config('app.name') }}">
    <meta name="Author" content="{{ config('app.name') }}">
    <meta name="keywords" content="{{ config('app.name') }}">

    <!-- TITLE -->
    <title> {{ config('app.name') }} | @yield('title') </title>

    <!-- App favicon -->
    <link rel="shortcut icon" href=""{{ asset('/backend/images/favicon.ico') }}" />
</head>

<body>
    @yield('content')

</body>

</html>
