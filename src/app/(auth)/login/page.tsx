"use client";

import React from "react";
import { signIn, useSession } from "next-auth/react";

function LoginForm() {
  const session = useSession();
  // console.log(session)

  if (session.status == "unauthenticated") {
    return <button onClick={() => signIn()}>Login</button>;
  } else {
    return <div>LoginForm</div>;
  }
}

export default LoginForm;
