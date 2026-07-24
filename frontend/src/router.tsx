import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";

const Home = lazy(() => import("@/pages/Home").then((m) => ({ default: m.Home })));
const NotFound = lazy(() => import("@/pages/NotFound").then((m) => ({ default: m.NotFound })));
const CategoryPage = lazy(() => import("@/pages/CategoryPage").then((m) => ({ default: m.CategoryPage })));
const CategoryIndex = lazy(() => import("@/pages/CategoryIndex").then((m) => ({ default: m.CategoryIndex })));
const Products = lazy(() => import("@/pages/Products").then((m) => ({ default: m.Products })));
const ProductListPage = lazy(() => import("@/pages/ProductListPage").then((m) => ({ default: m.ProductListPage })));
const Gallery = lazy(() => import("@/pages/Gallery").then((m) => ({ default: m.Gallery })));
const About = lazy(() => import("@/pages/About").then((m) => ({ default: m.About })));
const Contact = lazy(() => import("@/pages/Contact").then((m) => ({ default: m.Contact })));
const Faq = lazy(() => import("@/pages/Faq").then((m) => ({ default: m.Faq })));
const Policy = lazy(() => import("@/pages/Policy").then((m) => ({ default: m.Policy })));
const Blog = lazy(() => import("@/pages/Blog").then((m) => ({ default: m.Blog })));
const Wishlist = lazy(() => import("@/pages/Wishlist").then((m) => ({ default: m.Wishlist })));
const Account = lazy(() => import("@/pages/Account").then((m) => ({ default: m.Account })));
const Login = lazy(() => import("@/pages/Login").then((m) => ({ default: m.Login })));
const Register = lazy(() => import("@/pages/Register").then((m) => ({ default: m.Register })));

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<div className="min-h-[40vh]" />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: "products", element: withSuspense(<Products />) },
      { path: "category", element: withSuspense(<CategoryIndex />) },
      { path: "category/:slug", element: withSuspense(<CategoryPage kind="category" />) },
      { path: "collection/:slug", element: withSuspense(<CategoryPage kind="collection" />) },
      { path: "gallery", element: withSuspense(<Gallery />) },
      {
        path: "new-arrivals",
        element: withSuspense(
          <ProductListPage
            title="New Arrivals"
            description="The latest additions to our Maharashtrian and premium Indian saree collections."
            isNewArrival
          />
        ),
      },
      {
        path: "best-sellers",
        element: withSuspense(
          <ProductListPage
            title="Best Sellers"
            description="Customer favorites — the sarees our shoppers love most."
            isBestSeller
          />
        ),
      },
      { path: "about", element: withSuspense(<About />) },
      { path: "contact", element: withSuspense(<Contact />) },
      { path: "faq", element: withSuspense(<Faq />) },
      { path: "policies/:slug", element: withSuspense(<Policy />) },
      { path: "blog", element: withSuspense(<Blog />) },
      { path: "wishlist", element: withSuspense(<Wishlist />) },
      { path: "account", element: withSuspense(<Account />) },
      { path: "login", element: withSuspense(<Login />) },
      { path: "register", element: withSuspense(<Register />) },
      // Product detail, cart, and checkout routes are added in Phase 2.
      { path: "*", element: withSuspense(<NotFound />) },
    ],
  },
]);
