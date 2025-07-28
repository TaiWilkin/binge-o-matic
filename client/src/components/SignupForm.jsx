import { useMutation } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";

import mutation from "../mutations/Signup";
import query from "../queries/CurrentUser";
import AuthForm from "./AuthForm";

function SignupForm() {
  const navigate = useNavigate();

  const [signup, { error }] = useMutation(mutation, {
    refetchQueries: [{ query }],
    onCompleted: () => {
      navigate("/");
    },
  });

  return (
    <div>
      <AuthForm onSubmit={signup} title="Sign up" error={error} />
    </div>
  );
}

export default SignupForm;
