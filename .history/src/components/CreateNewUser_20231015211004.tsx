import { Badge, Button, Card, TextInput, Title } from "@tremor/react";
import { useUserActions } from "../hooks/useUserActions";
import React, { useState } from "react";

const CreateNewUser = () => {
  const { addUser } = useUserActions();
  const [result, setResult] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event?.target;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const github = formData.get("github") as string;

    if (!name || !email || !github) {
      return setResult("ko");
    }

    console.log(name, email, github);

    addUser({ name, email, github });
    setResult("ok");
    form.reset();
  };

  return (
    <Card style={{ marginTop: "20px" }}>
      <Title>Create New User</Title>
      <form onSubmit={handleSubmit}>
        <TextInput name="name" placeholder="Name" />
        <TextInput name="email" placeholder="Email" />
        <TextInput name="github" placeholder="Github user" />
        <div>
          <Button type="submit" style={{ marginTop: "20px" }}>
            Create user
          </Button>
          <span>
            {result === "ok" && <Badge color="green">Saved!</Badge>}
            {result === "ko" && <Badge color="red">Error in form</Badge>}
          </span>
        </div>
      </form>
    </Card>
  );
};

export default CreateNewUser;
