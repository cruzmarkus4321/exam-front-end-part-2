<!-- src/components/Modal.svelte -->
<script>
    import {
        Modal,
        ModalHeader,
        ModalBody,
        ModalFooter,
        Form,
        FormCheck,
        FormText,
        Button,
        Row,
        Col,
        Icon,
    } from "@sveltestrap/sveltestrap";
    import { employeeSchema } from "$lib/js/validationSchemas";
    import TextInput from "$lib/components/TextInput.svelte";
    import DatePickerInput from "$lib/components/DatePickerInput.svelte";
    import { onMount } from "svelte";
    import moment from "moment";
    import Swal from "sweetalert2";
    import { ADD_EMPLOYEE, UPDATE_EMPLOYEE } from "$lib/js/graphql";
    import client from "$lib/js/urqlClient";

    export let showModal = true;
    export let oldEmployee = null;
    export let employee = null;
    export let updateList = () => {};
    export let onClose = () => {};
    export let viewOnly = false;
    let formData = {};

    let validationError = {};

    $: {
        if (oldEmployee !== employee) {
            formData = {
                firstName: employee ? employee.firstName : "",
                lastName: employee ? employee.lastName : "",
                middleName: employee ? employee.middleName : "",
                birthDate: employee
                    ? moment(employee.birthDate, "YYYY-MM-DD").toDate()
                    : new Date(),
                gender: employee ? employee.gender : "",
                maritalStatus: employee ? employee.maritalStatus : "",
                position: employee ? employee.position : "",
                dateHired: employee
                    ? moment(employee.dateHired, "YYYY-MM-DD").toDate()
                    : new Date(),
                contacts: employee ? employee.contacts : [],
                addresses: employee ? employee.addresses : [],
            };

            oldEmployee = employee;
        }
    }

    onMount(async () => {
        formData = {
            birthDate: new Date(),
            dateHired: new Date(),
            contacts: [],
            addresses: [],
        };
    });

    const toggle = (e) => {
        e && e.preventDefault();

        validationError = {};
        employee = null;
        formData = {
            birthDate: new Date(),
            dateHired: new Date(),
            contacts: [],
            addresses: [],
        };
        showModal = !showModal;
        onClose();
    };

    const handleChange = (e) => {
        formData = {
            ...formData,
            [e.target.name]: e.target.value,
        };
    };

    const handleAddContact = (e) => {
        e.preventDefault();

        let newContacts = [];
        if (!!formData.contacts && formData.contacts.length > 0) {
            newContacts = [
                ...formData.contacts,
                { value: "", isPrimary: false },
            ];
        } else {
            newContacts = [{ value: "", isPrimary: false }];
        }

        formData = {
            ...formData,
            contacts: newContacts,
        };
    };

    const handleContactChange = (index) => (e) => {
        const { name, value } = e.target;

        formData = {
            ...formData,
            contacts: prevData.contacts.map((contact, i) => {
                if (i === index) {
                    return {
                        ...contact,
                        [name]: value,
                    };
                }
                return contact;
            }),
        };
    };

    const handleRemoveContact = (index) => (e) => {
        e.preventDefault();

        formData = {
            ...formData,
            contacts: formData.contacts.filter((contact, i) => i !== index),
        };
    };

    const handleAddAddress = (e) => {
        e.preventDefault();

        let newAddresses = [];
        if (!!formData.addresses && formData.addresses.length > 0) {
            newAddresses = [
                ...formData.addresses,
                { address1: "", address2: "", isPrimary: false },
            ];
        } else {
            newAddresses = [{ address1: "", address2: "", isPrimary: false }];
        }

        formData = {
            ...formData,
            addresses: newAddresses,
        };
    };

    const handleAddressChange = (index) => (e) => {
        const { name, value } = e.target;
        formData = {
            ...formData,
            addresses: prevData.addresses.map((address, i) => {
                if (i === index) {
                    return {
                        ...address,
                        [name]: value,
                    };
                }
                return address;
            }),
        };
    };

    const handleRemoveAddress = (index) => (e) => {
        e.preventDefault();

        formData = {
            ...formData,
            addresses: formData.addresses.filter((addresses, i) => i !== index),
        };
    };

    const handlePrimaryToggle = (index, type) => {
        if (type === "contact") {
            const updatedContacts = formData.contacts.map((contact, i) => {
                if (i === index) {
                    return {
                        ...contact,
                        isPrimary: true,
                    };
                } else {
                    return {
                        ...contact,
                        isPrimary: false,
                    };
                }
            });

            formData = {
                ...formData,
                contacts: updatedContacts,
            };
        } else {
            const updatedAddresses = formData.addresses.map((address, i) => {
                if (i === index) {
                    return {
                        ...address,
                        isPrimary: true,
                    };
                } else {
                    return {
                        ...address,
                        isPrimary: false,
                    };
                }
            });

            formData = {
                ...formData,
                addresses: updatedAddresses,
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await employeeSchema.validate(formData, { abortEarly: false });
            validationError = {};

            const {
                firstName,
                lastName,
                middleName,
                birthDate,
                gender,
                maritalStatus,
                position,
                dateHired,
                contacts,
                addresses,
            } = formData;

            Swal.fire({
                title: `${!!employee ? "Update" : "Add"} Employee`,
                text: `Are you sure you want to ${
                    !!employee ? "update" : "add"
                } this employee?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
            }).then(async (result) => {
                if (!result.isConfirmed) return;

                if (!!employee) {
                    await client
                        .mutation(UPDATE_EMPLOYEE, {
                            id: employee.id,
                            employee: {
                                firstName,
                                lastName,
                                middleName,
                                birthDate: moment(birthDate)
                                    .format("YYYY-MM-DD")
                                    .toString(),
                                gender,
                                maritalStatus,
                                position,
                                dateHired: moment(dateHired)
                                    .format("YYYY-MM-DD")
                                    .toString(),
                                contacts,
                                addresses,
                            },
                        })
                        .toPromise()
                        .then((res, err) => {
                            Swal.fire(
                                "Employee has been successfully updated!",
                            );

                            updateList();
                            toggle();
                        });
                } else {
                    await client
                        .mutation(ADD_EMPLOYEE, {
                            employee: {
                                firstName,
                                lastName,
                                middleName,
                                birthDate: moment(birthDate)
                                    .format("YYYY-MM-DD")
                                    .toString(),
                                gender,
                                maritalStatus,
                                position,
                                dateHired: moment(dateHired)
                                    .format("YYYY-MM-DD")
                                    .toString(),
                                contacts,
                                addresses,
                            },
                        })
                        .toPromise()
                        .then((res, err) => {
                            Swal.fire("Employee has been successfully added!");

                            updateList();
                            toggle();
                        });
                }
            });
        } catch (error) {
            const errors = {};

            error.inner.forEach((e) => {
                errors[e.path] = e.message;
            });

            validationError = errors;
        }
    };
</script>

<div>
    <Modal isOpen={showModal} size="xl" {toggle}>
        <Form on:submit={handleSubmit}>
            <ModalHeader {toggle}>
                {#if !!employee}
                    Edit Employee
                {:else}
                    Add Employee
                {/if}
            </ModalHeader>
            <ModalBody class="m-2">
                <Row>
                    <Col md="12">
                        <TextInput
                            name="firstname"
                            label="First Name"
                            bind:value={formData.firstName}
                            error={validationError && validationError.firstName}
                            disabled={viewOnly}
                        />
                        <TextInput
                            name="middleName"
                            label="Middle Name"
                            bind:value={formData.middleName}
                            error={validationError &&
                                validationError.middleName}
                            disabled={viewOnly}
                        />
                        <TextInput
                            name="lastName"
                            label="Last Name"
                            bind:value={formData.lastName}
                            error={validationError && validationError.lastName}
                            disabled={viewOnly}
                        />
                        <DatePickerInput
                            label="Birth Date"
                            bind:value={formData.birthDate}
                            error={validationError && validationError.birthDate}
                            disabled={viewOnly}
                        />
                        <TextInput
                            name="gender"
                            label="Gender"
                            bind:value={formData.gender}
                            error={validationError && validationError.gender}
                            disabled={viewOnly}
                        />
                        <TextInput
                            name="maritalStatus"
                            label="Marital Status"
                            bind:value={formData.maritalStatus}
                            error={validationError &&
                                validationError.maritalStatus}
                            disabled={viewOnly}
                        />
                        <TextInput
                            name="position"
                            label="Position"
                            bind:value={formData.position}
                            error={validationError && validationError.position}
                            disabled={viewOnly}
                        />
                        <DatePickerInput
                            label="Date Hired"
                            bind:value={formData.dateHired}
                            error={validationError && validationError.dateHired}
                            disabled={viewOnly}
                        />
                    </Col>
                    <Col md="12">
                        <div class="d-flex justify-content-between mb-2">
                            <h5>Contacts</h5>
                            <Button
                                color="success"
                                on:click={handleAddContact}
                                disabled={viewOnly}
                            >
                                <Icon name="plus" />
                            </Button>
                        </div>
                        {#if formData.contacts && formData.contacts.length > 0}
                            {#each formData.contacts as contact, index}
                                <Row>
                                    <Col>
                                        <TextInput
                                            label="Contact Value"
                                            name="value"
                                            bind:value={contact.value}
                                            error={validationError &&
                                                validationError[
                                                    `contacts[${index}].value`
                                                ]}
                                            disabled={viewOnly}
                                        />
                                    </Col>
                                    <Col>
                                        <div
                                            class="d-flex justify-content-between mt-2 mb-2"
                                        >
                                            <FormCheck
                                                type="checkbox"
                                                id={`primaryContact_${index}`}
                                                label="Primary"
                                                name={"isPrimary"}
                                                checked={contact.isPrimary}
                                                on:change={() =>
                                                    handlePrimaryToggle(
                                                        index,
                                                        "contact",
                                                    )}
                                                disabled={viewOnly}
                                            />
                                            <Button
                                                color="danger"
                                                size="sm"
                                                on:click={handleRemoveContact(
                                                    index,
                                                )}
                                                disabled={viewOnly}
                                            >
                                                <Icon name="trash" />
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            {/each}
                        {/if}
                        {#if validationError.contacts}
                            <FormText class="text-danger">
                                {validationError.contacts}
                            </FormText>
                        {/if}
                        <div class="d-flex justify-content-between mt-5 mb-2">
                            <h5>Addresses</h5>
                            <Button
                                color="success"
                                on:click={handleAddAddress}
                                disabled={viewOnly}
                            >
                                <Icon name="plus" />
                            </Button>
                        </div>
                        {#if formData.addresses && formData.addresses.length > 0}
                            {#each formData.addresses as address, index}
                                <Row>
                                    <Col>
                                        <TextInput
                                            label="Address 1"
                                            name="address1"
                                            bind:value={address.address1}
                                            error={validationError &&
                                                validationError[
                                                    `addresses[${index}].address1`
                                                ]}
                                            disabled={viewOnly}
                                        />
                                        <TextInput
                                            label="Address 2"
                                            name="address2"
                                            bind:value={address.address2}
                                            error={validationError &&
                                                validationError[
                                                    `addresses[${index}].address2`
                                                ]}
                                            disabled={viewOnly}
                                        />
                                    </Col>
                                    <Col>
                                        <div
                                            class="d-flex justify-content-between mt-2 mb-2"
                                        >
                                            <FormCheck
                                                type="checkbox"
                                                id={`primaryAddress${index}`}
                                                label="Primary"
                                                name={"isPrimary"}
                                                checked={address.isPrimary}
                                                on:change={() =>
                                                    handlePrimaryToggle(
                                                        index,
                                                        "address",
                                                    )}
                                                disabled={viewOnly}
                                            />
                                            <Button
                                                color="danger"
                                                size="sm"
                                                on:click={handleRemoveAddress(
                                                    index,
                                                )}
                                                disabled={viewOnly}
                                            >
                                                <Icon name="trash" />
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            {/each}
                        {/if}
                        {#if validationError.addresses}
                            <FormText class="text-danger">
                                {validationError.addresses}
                            </FormText>
                        {/if}
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                {#if !viewOnly}
                    <Button color="primary" type="submit">
                        {#if !!employee}
                            Update
                        {:else}
                            Add
                        {/if}
                    </Button>
                {/if}

                <Button color="secondary" on:click={toggle}>Cancel</Button>
            </ModalFooter>
        </Form>
    </Modal>
</div>
