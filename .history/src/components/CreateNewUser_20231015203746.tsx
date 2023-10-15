import { Button, Card, TextInput, Title } from "@tremor/react";

const CreateNewUser = () => {
  const handleSubmit = () => {
    const name = formData.get("name") as string;
    const email = formData.get("name") as string;
    const github = formData.get("name") as string;
  };

  return (
    <Card style={{ marginTop: "20px" }}>
      <Title>Create New User</Title>
      <form onSubmit={handleSubmit} action="">
        <TextInput name="name" placeholder="Name" />
        <TextInput name="email" placeholder="Email" />
        <TextInput name="github" placeholder="Github user" />
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
