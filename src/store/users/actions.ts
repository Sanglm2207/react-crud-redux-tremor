import { toast } from "sonner";
import { AppDispatch, RootState } from "../index";
import { 
  addNewUser, 
  deleteUserById, 
  rollbackUser 
} from "./reducers";
import { User, UserId } from "./types";

// Export action thêm user (đồng bộ)
export const createUser = (user: User) => (dispatch: AppDispatch) => {
  dispatch(addNewUser(user));
};

// Thunk: Xử lý xóa user (bao gồm Optimistic UI và API Call)
export const removeUser = (userId: UserId) => (dispatch: AppDispatch, getState: () => RootState) => {
  // 1. Lấy trạng thái user trước khi xóa để phòng trường hợp cần rollback
  const userToRemove = getState().users.find((user) => user.id === userId);

  // 2. Optimistic Update: Xóa ngay trên UI
  dispatch(deleteUserById(userId));

  // 3. Gọi API xóa
  fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        toast.success(`User ${userId} deleted successfully`);
      } else {
        throw new Error("Failed to delete");
      }
    })
    .catch((err) => {
      console.error(err);
      toast.error(`Error deleting user ${userId}`);
      
      // 4. Nếu lỗi, rollback lại trạng thái cũ
      if (userToRemove) {
        dispatch(rollbackUser(userToRemove));
      }
    });
};