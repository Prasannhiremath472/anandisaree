import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { CategoryPage } from "@/pages/CategoryPage";
import { CategoryIndex } from "@/pages/CategoryIndex";
import { Products } from "@/pages/Products";
import { ProductListPage } from "@/pages/ProductListPage";
import { Gallery } from "@/pages/Gallery";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Faq } from "@/pages/Faq";
import { Policy } from "@/pages/Policy";
import { Blog } from "@/pages/Blog";
import { Wishlist } from "@/pages/Wishlist";
import { Account } from "@/pages/Account";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { NEW_ARRIVALS, BEST_SELLERS } from "@/data/homeContent";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "category", element: <CategoryIndex /> },
      { path: "category/:slug", element: <CategoryPage kind="category" /> },
      { path: "collection/:slug", element: <CategoryPage kind="collection" /> },
      { path: "gallery", element: <Gallery /> },
      {
        path: "new-arrivals",
        element: (
          <ProductListPage
            title="New Arrivals"
            description="The latest additions to our Maharashtrian and premium Indian saree collections."
            products={NEW_ARRIVALS}
          />
        ),
      },
      {
        path: "best-sellers",
        element: (
          <ProductListPage
            title="Best Sellers"
            description="Customer favorites — the sarees our shoppers love most."
            products={BEST_SELLERS}
          />
        ),
      },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "faq", element: <Faq /> },
      { path: "policies/:slug", element: <Policy /> },
      { path: "blog", element: <Blog /> },
      { path: "wishlist", element: <Wishlist /> },
      { path: "account", element: <Account /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      // Product detail, cart, and checkout routes are added in Phase 2.
      { path: "*", element: <NotFound /> },
    ],
  },
]);
