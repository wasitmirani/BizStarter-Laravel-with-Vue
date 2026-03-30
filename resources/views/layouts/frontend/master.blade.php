<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    

    <div id="frontend-app">

    </div>
    @vite(['resources/ts/frontend/app.ts','resources/css/app.css'])
    {{-- <script type="module" src="{{ asset('/build/assets/app.ef37314d.js') }}"></script> --}}
                                          
  
    <script>
      @auth
         window.user = {!! json_encode(Auth::user()->load(['roles']), true) !!};
         window.token = "{{auth()->user()->token}}";
         window.config = {'app_name':'{{config('app.name')}}','logo':'{{asset('frontend/assets/img/logo.png')}}',}
         window.permissions = {!! json_encode(Auth::user()->getAllPermissions()->pluck('name')->values(), true) !!};
      @else
        window.user = [];
        window.permissions = [];
        window.token="";
     @endauth
  </script>
  
    <!-- endbuild -->
  
</body>
</html>