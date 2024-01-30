<script>
    import client from "$lib/js/urqlClient";
    import { GET_EMPLOYEES, DELETE_EMPLOYEE } from "$lib/js/graphql";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import EmployeeModal from "$lib/components/EmployeeModal.svelte";
    import PaginationComponent from "$lib/components/PaginationComp.svelte";
    import Swal from "sweetalert2";
    import { Container, Table, Button } from "@sveltestrap/sveltestrap";

    let user = {};
    let username = "";
    let userType = "1";

    let currentPage = 0;
    let size = 10;
    let totalCount = 0;
    let totalPages = 0;
    let employees = [];
    let selectedEmployee = null;
    let showEmployeeModal = false;

    onMount(async () => {
        user = JSON.parse(localStorage.getItem("user"));

        if (!!user) {
            username = user.username || "";
            userType = user.userType || "1";
        } else {
            logout();
        }

        await getEmployees();
    });

    const getEmployees = async () => {
        const response = await client
            .query(GET_EMPLOYEES, { page: currentPage, size })
            .toPromise();

            console.log('this is your response', response);

        employees = response.data.getEmployees.employees || [];
        totalCount = response.data.getEmployees.totalCount || 0;
        totalPages = response.data.getEmployees.totalPages || 0;
    };

    const logout = () => {
        localStorage.clear();
        goto("/");
    };

    const getPrimaryAddress = (addresses) => {
        if (addresses && addresses.length > 0) {
            const primaryAddress = addresses.find(
                (address) => address.isPrimary,
            );
            return primaryAddress
                ? primaryAddress.address1 + ", " + primaryAddress.address2
                : "No primary address";
        } else {
            return "No primary address";
        }
    };

    const getPrimaryContact = (contacts) => {
        if (contacts && contacts.length > 0) {
            const primaryContact = contacts.find(
                (contact) => contact.isPrimary,
            );
            return primaryContact ? primaryContact.value : "No primary contact";
        } else {
            return "No primary contact";
        }
    };

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();

        if (
            today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() &&
                today.getDate() < birthDate.getDate())
        ) {
            return age - 1;
        }

        return age;
    };

    const calculateYearsInCompany = (dateHired) => {
        const today = new Date();
        const hiredDate = new Date(dateHired);

        let yearsDiff = today.getFullYear() - hiredDate.getFullYear();
        const monthsDiff = today.getMonth() - hiredDate.getMonth();

        let formattedResult = "";

        if (
            today.getMonth() < hiredDate.getMonth() ||
            (today.getMonth() === hiredDate.getMonth() &&
                today.getDate() < hiredDate.getDate())
        ) {
            yearsDiff--;
        }

        if (yearsDiff > 0) {
            formattedResult += `${yearsDiff}y `;
        }

        if (monthsDiff >= 0) {
            formattedResult += `${monthsDiff}m`;
        } else {
            formattedResult += `${monthsDiff + 12}m`;
        }

        return formattedResult.trim() || "N/A";
    };

    const handleClose = () => {
        selectedEmployee = null;
    };

    //const [deleteEmployee] = useMutation(DELETE_EMPLOYEE);

    const removeEmployee = (id) => {
        Swal.fire({
            title: "Delete Employee",
            text: `Are you sure you want to delete this employee?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            await client.mutation(DELETE_EMPLOYEE, {id})
                        .toPromise()
                        .then(async (res, err) => {
                            Swal.fire("Employee has been successfully deleted!");

                            currentPage = 0;
                            await getEmployees();
                        });
        });
    };
</script>

<main>
    <Container>
        <div class="d-flex justify-content-between flex-wrap">
            <div class="d-flex flex-row">
                <Button color="danger" class="mb-4" on:click={() => logout()}>
                    LOG-OUT
                </Button>
                <h5 class="mt-1 ms-4">Hello, {username}!</h5>
            </div>
            {#if userType !== "2"}
                <Button
                    color="success"
                    class="mb-4"
                    on:click={() => {
                        showEmployeeModal = true;
                    }}
                >
                    Add
                </Button>
            {/if}
        </div>
        <div>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Primary Address</th>
                        <th>Primary Contact Info</th>
                        <th>Age</th>
                        <th># of Years in the Company</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#if employees.length > 0}
                        {#each employees as employee}
                            <tr key={employee.id}>
                                <td>{employee.firstName + " " + employee.lastName}</td>
                                <td>{getPrimaryAddress(employee.addresses)}</td>
                                <td>{getPrimaryContact(employee.contacts)}</td>
                                <td>{calculateAge(employee.birthDate)}</td>
                                <td>{calculateYearsInCompany(employee.dateHired)}</td>
                                <td>
                                    {#if userType === "1"}
                                        <Button
                                            color="primary"
                                            class="btn btn-primary me-1"
                                            on:click={() => {
                                                showEmployeeModal = true;
                                                selectedEmployee = employee;
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color="danger"
                                            on:click={() => removeEmployee(employee.id)}
                                        >
                                            Delete
                                        </Button>
                                    {:else}
                                        <Button
                                            color="primary"
                                            class="me-1"
                                            on:click={() => {
                                                showEmployeeModal = true;
                                                selectedEmployee = employee;
                                            }}
                                        >
                                            View
                                        </Button>
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </Table>
            <PaginationComponent
                bind:currentPage
                bind:totalPages
                onPageChange={(page) => {
                    if (page !== 0) {
                        currentPage = page - 1;
                        getEmployees();
                    }
                }}
            />
        </div>
    </Container>
    <EmployeeModal
        bind:showModal={showEmployeeModal}
        bind:employee={selectedEmployee}
        viewOnly={userType === "2"}
        updateList={getEmployees}
    />
</main>


<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    /* .employee-container {
        min-width: 700px;
    } */
</style>
