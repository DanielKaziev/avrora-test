import { createBrowserRouter } from "react-router";
import FormConstructor from "../pages/FormConstructor";
import Board from "../pages/Kanban";
import App from "../pages/App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/forms",
        element: <FormConstructor />,
      },
      {
        path: "/board",
        element: <Board />,
      },
    ],
  },
]);

export default router;
