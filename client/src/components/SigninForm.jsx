import { useMutation } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";

import mutation from "../mutations/Login";
import query from "../queries/CurrentUser";
import AuthForm from "./AuthForm";

function SigninForm() {
  const navigate = useNavigate();

  const [login, { error }] = useMutation(mutation, {
    refetchQueries: [{ query }],
    onCompleted: () => {
      navigate("/");
    },
  });

  return (
    <div>
      <AuthForm title="Sign in" onSubmit={login} error={error} />
    </div>
  );
}

export default SigninForm;
