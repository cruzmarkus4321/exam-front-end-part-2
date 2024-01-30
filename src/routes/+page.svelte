<script>
    import {
        Container,
        Button,
        Form,
        Card,
        CardBody,
        CardFooter,
        CardHeader,
        CardSubtitle,
        CardText,
        CardTitle,
    } from "@sveltestrap/sveltestrap";
    import TextInput from "$lib/components/TextInput.svelte";
    import { LOGIN_MUTATION } from "$lib/js/graphql";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import client from "$lib/js/urqlClient";

    let username = "";
    let password = "";
    let loginError = "";

    const login = async (e) => {
        e.preventDefault();

        const response = await client
            .mutation(LOGIN_MUTATION, { username, password })
            .toPromise();
        const data = response.data.login;

        console.log("this is your response", response);

        if (!!data && data.status === "success") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            goto("/employees");
        } else {
            loginError = "Invalid credentials. Please try again.";
        }
    };

    onMount(async () => {
        if (!!JSON.parse(localStorage.getItem("user"))) {
            goto("/employees");
        }
    });
</script>

<main>
    <Container class="mt-5 d-flex justify-content-center">
        <Card id="login-card" style="min-width: 300px; max-width: 500px; width: 50%;">
            <CardHeader>Login</CardHeader>
            <CardBody>
                <Form on:submit={login}>
                    <TextInput
                        name="username"
                        label="Username"
                        bind:value={username}
                    />
                    <TextInput
                        name="password"
                        label="Password"
                        type="password"
                        bind:value={password}
                    />
                    {#if loginError}
                        <small class="form-text text-danger mt-2">
                            Invalid credentials. Please try again.
                        </small>
                    {/if}
                    <div class="d-flex justify-content-center mt-5">
                        <Button color="primary" class="custom-button" type="submit" style="width: 100%;">LOGIN</Button>
                    </div>
                </Form>
            </CardBody>
        </Card>
    </Container>
</main>

<style>
    main {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    /* form {
        padding: 15px;
        margin: auto;
    } */
</style>
