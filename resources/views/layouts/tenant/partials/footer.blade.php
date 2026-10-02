<footer class="main-footer">
    <div class="d-flex flex-wrap justify-content-between gap-2 align-items-center">
        <p class="mb-0 text-muted fs-sm">
            © <script>document.write(new Date().getFullYear())</script>
            {{ $tenant->name ?? config('app.name') }}
        </p>
        <p class="mb-0 text-muted fs-sm">
            Powered by {{ config('app.name') }}
        </p>
    </div>
</footer>
