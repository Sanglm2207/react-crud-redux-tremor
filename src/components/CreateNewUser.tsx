import { useEffect, useState } from "react";
import { Button, Card, TextInput, Title, Select, SelectItem } from "@tremor/react";
import { createUser } from "../store/users";
import { fetchRoles, selectRoles } from "../store/roles";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function CreateNewUser() {
  const dispatch = useAppDispatch();
  const roles = useAppSelector(selectRoles);
  
  // State quản lý loading và giá trị select
  const [isLoading, setIsLoading] = useState(false);
  const [roleId, setRoleId] = useState<string>("");

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // Lấy roleId từ input hidden (đã được sync với state roleId)
    const roleIdValue = formData.get("roleId") as string;

    if (!name || !email || !roleIdValue) {
      toast.error("Vui lòng nhập đầy đủ Name, Email và chọn Role");
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(createUser({
        name,
        email,
        password: password || "123456", // Default password
        roleId: Number(roleIdValue)
      })).unwrap();

      toast.success("Tạo thành viên thành công");
      
      // Reset form
      form.reset();
      setRoleId(""); // Reset luôn cái Select của Tremor
    } catch (error) {
      // Lỗi đã được handle ở axios interceptor hoặc thunk, 
      // nhưng có thể log ra nếu cần debug
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <Title>Create New User</Title>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput name="name" placeholder="Full Name" required />
          <TextInput name="email" placeholder="Email Address" type="email" required />
          <TextInput name="password" placeholder="Password (Default: 123456)" type="password" />
          
          <div>
            {/* INPUT HIDDEN: Để FormData bắt được name="roleId" */}
            <input type="hidden" name="roleId" value={roleId} />
            
            {/* TREMOR SELECT: Sync value với state */}
            <Select 
              value={roleId} 
              onValueChange={setRoleId} 
              placeholder="Select Role"
            >
              {roles.map((role) => (
                <SelectItem key={role.id} value={String(role.id)}>
                  {role.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={isLoading} icon={UserPlus}>
            Create User
          </Button>
        </div>
      </form>
    </Card>
  );
}