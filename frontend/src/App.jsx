import "./App.css";
import HomeLogin from "./pages/HomeLogin.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./pages/MainLayout.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import ProfilePage from "./pages/ProfilePages.jsx"; // Corrected import statement
import SearchUser from "./pages/searchUser.jsx";
import SettingLayout from "./pages/AllSettings/SettingLayout.jsx";
import EditProfile from "./pages/AllSettings/EditProfile.jsx";
import FeedLayout from "./pages/FeedLayout.jsx";
import PostFeed from "./components/postFeed.jsx";
import VideoFeed from "./components/videoFeed.jsx";
import VerticalVideoFeed from "./components/verticalVideoFeed.jsx";
import BlogFeed from "./components/BlogFeed.jsx";

const browserRouter = createBrowserRouter([
  {
    path: "/login",
    element: <HomeLogin />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true, // Default route when "/" is visited
        element: <FeedLayout />, // FeedLayout will always be visible inside MainLayout
      },
      {
        path: "feed",
        // element:<FeedPage/>
        element: <FeedLayout />,
        children: [
          {
            index: true, // Default route when "/feed" is visited
            element: <PostFeed />,
          },
          {
            path: "post",
            element: <PostFeed />,
          },
          {
            path: "video",
            element: <VideoFeed />,
          },
          {
            path: "vertical",
            element: <VerticalVideoFeed />,
          },
          {
            path: "blog",
            element: <BlogFeed />,
          },
        ],
      },
      {
        path: "/profile/:id",
        element: <ProfilePage />,
      },
      {
        path: "/search",
        element: <SearchUser />,
      },
    ],
  },
  {
    path: "/settings",
    element: <SettingLayout />,
    children: [
      {
        index: true,
        element: <EditProfile />,
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
};

export default App;
