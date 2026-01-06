import { Button, Card, TextInput, Title, Text } from "@tremor/react";
import { useState } from "react";
import { loginUser, selectAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector(selectAuth);
  
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    
    if (loginUser.fulfilled.match(result)) {
      navigate("/"); // Chuyển về dashboard sau khi login thành công
    }
  };

  return (
    <Card className="max-w-sm mx-auto mt-10">
      <Title className="text-center mb-4">Login System</Title>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
            <Text>Email</Text>
            <TextInput 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter email" 
            />
        </div>
        <div>
            <Text>Password</Text>
            <TextInput 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter password" 
            />
        </div>
        <Button type="submit" loading={isLoading} className="w-full mt-2">
          Sign in
        </Button>
      </form>
    </Card>
  );
}