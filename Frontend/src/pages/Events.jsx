import { useEffect, useState, useContext } from "react";
import RegisterEvent from "../layouts/RegisterEvent";

export default function Events() {
  

  return(
    <div>
      <h1>Events</h1>
       {/* <p>{message}</p> */}
       <RegisterEvent />
    </div>
  );
}
