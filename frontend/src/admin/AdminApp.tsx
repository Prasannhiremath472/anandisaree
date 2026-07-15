import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { adminStore } from "@/admin/store";
import { adminRouter } from "@/admin/router";
import { AuthBootstrap } from "@/admin/components/AuthBootstrap";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function AdminApp() {
  return (
    <Provider store={adminStore}>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>
          <RouterProvider router={adminRouter} />
        </AuthBootstrap>
        <Toaster position="top-center" />
      </QueryClientProvider>
    </Provider>
  );
}
