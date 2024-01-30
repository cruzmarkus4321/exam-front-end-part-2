<script>
    import { Input, FormGroup, FormText } from "@sveltestrap/sveltestrap";
    import moment from "moment";
    import { DateInput } from "date-picker-svelte";
    export let label;
    export let value = new Date();
    export let error = "";
    export let disabled = false;
    export let max = new Date();

    console.log('this is your value', value);

    // if (!(value instanceof Date)) {
    //     value = new Date();
    // }
</script>

<FormGroup floating {label}>
    <DateInput
        bind:value
        {disabled}
        min={moment("1970-01-01", "YYYY-MM-DD").toDate()}
        {max}
        placeholder=""
        format="MM/dd/yyyy"
        class={`form-control ${error ? "is-invalid" : ""}`}
    />
    {#if error}
        <FormText class="text-danger">{error}</FormText>
    {/if}
</FormGroup>

<style>
</style>
