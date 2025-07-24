import { Badge, Button, Card, TextInput, Title } from "@tremor/react";
import { useState } from "react";
import { useUserActions } from "../hooks/useUserActions";

export default function CreateNewUser() {
  const { addUser } = useUserActions();
  const [result, setResult] = useState<"ok" | "ko" | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setResult(null);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!name || !email) {
      // validaciones que tu quieras
      return setResult("ko");
    }

    addUser({ name, email });
    setResult("ok");
    form.reset();
  };

  return (
    <Card style={{ marginTop: "16px" }}>
      <Title>Create New User</Title>

      <form onSubmit={handleSubmit} className="">
        <TextInput name="name" placeholder="Fullname" />
        <TextInput name="email" placeholder="Email" />

        <div>
          <Button type="submit" style={{ marginTop: "16px" }}>
            Create user
          </Button>
          <span>
            {result === "ok" && (
              <Badge color="green">Đã lưu thành công</Badge>
            )}
            {result === "ko" && <Badge color="red">Error</Badge>}
          </span>
        </div>
      </form>
    </Card>
  );
}
