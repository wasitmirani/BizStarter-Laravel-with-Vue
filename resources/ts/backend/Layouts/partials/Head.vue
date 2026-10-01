<script setup lang="ts">
let auth_user = window.user;
const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

function logOut(event:any) {
    event.preventDefault();
    // First try: find any existing server-rendered logout form (Blade) and submit it
    const existing = Array.from(document.forms).find(f => {
        try {
            return new URL(f.action, window.location.href).pathname === '/logout' && f.method.toLowerCase() === 'post';
        } catch (e) { return false; }
    }) as HTMLFormElement | undefined;

    if (existing) {
        const tokenInput = existing.querySelector('input[name="_token"]') as HTMLInputElement | null;
        if (tokenInput) tokenInput.value = csrf;
        existing.submit();
        return;
    }

    // Fallback: create and submit a form programmatically (ensures cookies are sent)
    const f = document.createElement('form');
    f.method = 'POST';
    f.action = '/logout';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = '_token';
    input.value = csrf;
    f.appendChild(input);
    document.body.appendChild(f);
    f.submit();
}
</script>
<template >
<div>
    <form id="logout-form" method="POST" action="/logout" style="display:none;">
        <input type="hidden" name="_token" :value="csrf">
    </form>
    
      <!-- Start::main-header -->

        <!-- Topbar End -->
    <header>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h1>Header</h1>
                </div>
            </div>
        </div>
    </header>


</div>
</template>

