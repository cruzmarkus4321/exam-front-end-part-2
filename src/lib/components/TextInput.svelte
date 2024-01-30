<script>
    import { Input, FormGroup, FormText } from "@sveltestrap/sveltestrap";
    export let name;
    export let label;
    export let value = "";
    export let type = "text";
    export let error = "";
    export let disabled = false;

    // Optional event to emit the input value changes
    export const inputEvent = (value) => {
        const event = new CustomEvent("input", {
            detail: { value },
        });
        dispatchEvent(event);
    };
</script>

<!-- <div class="form-group">
    {#if label}
        <label for={id} class="form-label">{label}</label>
    {/if}
    <input
        type="text"
        bind:value
        {id}
        class="form-control"
        {placeholder}
        on:input={() => inputEvent(value)}
    />
</div>

<style>
    .form-group {
        margin-bottom: 1rem;
    }

    .form-label {
        display: block;
        margin-bottom: 0.5rem;
    }

    .form-control {
        width: 100%;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        transition:
            border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
    }
</style> -->

<FormGroup floating {label}>
    <Input
        {name}
        {type}
        bind:value
        invalid={!!error}
        feedback={error}
        {disabled}
    />
    <!-- {#if error}
    <FormText className="text-danger">{error}</FormText>
    {/if} -->
</FormGroup>
