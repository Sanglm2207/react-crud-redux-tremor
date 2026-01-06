import { Badge, Button, Card, TextInput, Title } from "@tremor/react";
import { useState } from "react";
import { createUser } from "../store/users";
import { useAppDispatch } from "../store/store";

export default function CreateNewUser() {
  const dispatch = useAppDispatch();
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

    dispatch(createUser({ name, email }));
    setResult("ok");
    form.reset();
  };

  return (
    <Card className="mt-4">
      <Title>Create New User</Title>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <TextInput name="name" placeholder="Fullname" />
        <TextInput name="email" placeholder="Email" />

        <div className="flex items-center gap-4">
          <Button type="submit">
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