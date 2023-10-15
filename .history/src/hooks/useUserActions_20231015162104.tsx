import React from "react";
const dispatch = useAppDispatch();

export const useUserActions = () => {
  const handleRemoveById = (id: UserId) => {
    dispatch(deleteUserById(id));
  };
};
