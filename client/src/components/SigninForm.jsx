import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

import mutation from "../mutations/Login";
import query from "../queries/CurrentUser";
import AuthForm from "./AuthForm";

function SigninForm() {
  const history = useHistory();

  const [login, { error }] = useMutation(mutation, {
    refetchQueries: [{ query }],
    onCompleted: () => {
      history.push("/");
    },
  });

  return (
    <div>
      <AuthForm title="Sign in" onSubmit={login} error={error} />
    </div>
  );
}

export default SigninForm;
