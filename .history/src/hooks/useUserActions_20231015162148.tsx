import React from "react";
import { UserId, deleteUserById } from "../store/users/slice";
import { useAppDispatch } from "./store";

const dispatch = useAppDispatch();

export const useUserActions = () => {
  const handleRemoveById = (id: UserId) => {
    dispatch(deleteUserById(id));
  };

  return { handleRemoveById };
};
