import React, { useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { gray } from "@ant-design/colors";
import Navbar from "./components/Navbar";
import WelcomeMessage from "./components/WelcomeMessage";
import MainApp from "./MainApp";

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div
        style={{
          position: "relative",
          background: gray[7],
          display: "block",
        }}
      >
        <Navbar user={user} setUser={setUser} handleLogout={handleLogout} />
        {user ? <MainApp user={user} /> : <WelcomeMessage />}
      </div>
    </QueryClientProvider>
  );
}

export default App;
