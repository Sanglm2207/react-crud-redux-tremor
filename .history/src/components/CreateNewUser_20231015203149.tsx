import { Button, Card, TextInput, Title } from "@tremor/react";

const CreateNewUser = () => {
  return (
    <Card style={{ marginTop: "20px" }}>
      <Title>Create New User</Title>
      <form action="">
        <TextInput placeholder="Name" />
        <TextInput placeholder="Email" />
        <TextInput placeholder="Github user" />
        <div>
          <Button type="submit" style={{ marginTop: "20px" }}>
            Create user
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateNewUser;
