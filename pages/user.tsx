import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

import Amplify from "aws-amplify";

function User() {
  return (
    <div>
      <h1 className="font-bold text-lg">Welcome</h1>
      {/* <AmplifySignOut /> */}

      <h2>My App Content</h2>
    </div>
  );
}

export default User;
