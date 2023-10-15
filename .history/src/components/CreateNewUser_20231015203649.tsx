import { Button, Card, TextInput, Title } from "@tremor/react";

const CreateNewUser = () => {
  const handleSubmit = () => {
    const name = formData.get("name") as string;
    const name = formData.get("name") as string;
    const name = formData.get("name") as string;
  };

  return (
    <Card style={{ marginTop: "20px" }}>
      <Title>Create New User</Title>
      <form onSubmit={handleSubmit} action="">
        <TextInput placeholder="Name" />
        <TextInput placeholder="Email" />
        <TextInput placeholder="Github user" />
        <div>
          <Button
            onClick={() => addUser}
            type="submit"
            style={{ marginTop: "20px" }}
          >
            Create user
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateNewUser;
