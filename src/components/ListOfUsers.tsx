import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
  Text
} from "@tremor/react";
import { fetchUsers, deleteUser } from "../store/users";
import { Trash2, Edit } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/store";

export function ListOfUsers() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { list: users, isLoading } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa user này?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Title>List of Users</Title>
        <Badge color="blue">{users.length}</Badge>
        {isLoading && <span className="text-sm text-gray-400 ml-2">Loading...</span>}
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>User Info</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.length === 0 && !isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <Text>No users found.</Text>
              </TableCell>
            </TableRow>
          ) : (
            users.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>#{item.id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <img
                      className="w-8 h-8 rounded-full mr-3 object-cover border border-gray-200"
                      src={item.avatar || `https://ui-avatars.com/api/?name=${item.name}&background=random`}
                      alt={item.name}
                    />
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  {/* Kiểm tra null safe cho role */}
                  <Badge color="cyan" size="xs">
                    {item.role?.name || "No Role"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {/* Nếu user chưa có field active thì tạm thời check logic này */}
                  <Badge color={item.active !== false ? "green" : "red"} size="xs">
                    {item.active !== false ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/settings/users/${item.id}`)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      type="button"
                      className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}