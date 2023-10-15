import { Card, TextInput, Title } from "@tremor/react";

const CreateNewUser = () => {
  return (
    <Card style={{ marginTop: "20px" }}>
      <Title>Create New User</Title>
      <form action="">
        <TextInput placeholder="Name" />
        <TextInput placeholder="Email" />
        <TextInput placeholder="Github user" />
        <div>
          <button type="submit" style={{ marginTop: "20px" }}></button>
        </div>
      </form>
    </Card>
  );
};

export default CreateNewUser;
