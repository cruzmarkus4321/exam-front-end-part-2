<script>
    import {
        Pagination,
        PaginationItem,
        PaginationLink,
    } from "@sveltestrap/sveltestrap";
    export let currentPage;
    export let totalPages;
    export let onPageChange = () => {};

    $: activePage = currentPage + 1;
    $: pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
</script>

<div class="d-flex justify-content-end">
    <Pagination>
        <PaginationItem disabled={activePage === 1}>
            <PaginationLink
                first
                on:click={() => onPageChange(1)}
            />
        </PaginationItem>
        <PaginationItem disabled={activePage === 1}>
            <PaginationLink previous on:click={() => onPageChange(activePage - 1)} />
        </PaginationItem>
        {#each pageNumbers as page}
            <PaginationItem active={page === activePage}>
                <PaginationLink
                    key={page}
                    on:click={() => onPageChange(page)}>{page}</PaginationLink
                >
            </PaginationItem>
        {/each}
        <PaginationItem disabled={activePage === totalPages}>
            <PaginationLink
                next
                on:click={() => onPageChange(activePage + 1)}
                disabled={activePage === totalPages}
            />
        </PaginationItem>
        <PaginationItem disabled={activePage === totalPages}>
            <PaginationLink
                last
                on:click={() => onPageChange(totalPages)}
                disabled={activePage === totalPages}
            />
        </PaginationItem>
    </Pagination>
</div>
