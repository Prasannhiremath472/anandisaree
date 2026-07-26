import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { RecentOrderPopup } from "./RecentOrderPopup";
import { FloatingSocialButton } from "./FloatingSocialButton";
import { CouponPopup } from "./CouponPopup";
import { CartDrawer } from "./CartDrawer";
import { ScrollToTop } from "./ScrollToTop";

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <RecentOrderPopup />
      <FloatingSocialButton />
      <CouponPopup />
      <CartDrawer />
    </div>
  );
}
