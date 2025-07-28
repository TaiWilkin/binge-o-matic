import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

import mutation from "../mutations/Signup";
import query from "../queries/CurrentUser";
import AuthForm from "./AuthForm";

function SignupForm() {
  const history = useHistory();

  const [signup, { error }] = useMutation(mutation, {
    refetchQueries: [{ query }],
    onCompleted: () => {
      history.push("/");
    },
  });

  return (
    <div>
      <AuthForm onSubmit={signup} title="Sign up" error={error} />
    </div>
  );
}

export default SignupForm;
