// App.jsx or any parent component

"use client";

import { useEffect } from "react";
import Antichess from "./Antichess";
import { toast } from "react-toastify";



function page() {
  useEffect(() => {
    toast.info("Player 1 - start!", {
      position: "top-right",
      closeButton: false,
    });
    toast.info("Click on any peice to start the game!", {
      position: "top-right",
      closeButton: false,
    });
  });
  return (
    <div className="App">
      <h1>C H A T U R A N G A </h1>
      <Antichess />
      <footer>
        <p className="copyright">© anti-chess | royabhishek47 | ♕ ♘ ♜ ♗</p>
      </footer>
    </div>
  );
}

export default page;
