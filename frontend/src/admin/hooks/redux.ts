import { useDispatch, useSelector } from "react-redux";
import type { AdminAppDispatch, AdminRootState } from "@/admin/store";

export const useAppDispatch = () => useDispatch<AdminAppDispatch>();
export const useAppSelector = useSelector.withTypes<AdminRootState>();
