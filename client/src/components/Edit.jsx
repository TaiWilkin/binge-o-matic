import React from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import deleteListMutation from "../mutations/DeleteList";
import editListMutation from "../mutations/EditList";
import listQuery from "../queries/List";
import QueryHandler from "./QueryHandler";

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
  }

  onChange(e) {
    this.setState({ text: e.target.value });
  }

  render() {
    const { match, history } = this.props;
    const { text } = this.state;
    return (
      <QueryHandler query={listQuery} variables={{ id: match.params.id }}>
        {({ data, client }) => {
          if (!data.list) {
            return <p style={{ color: "red" }}> Error: List not found!</p>;
          }
          const isOwner =
            data.user && data.list.user.toString() === data.user.id.toString();
          if (!isOwner)
            return <p style={{ color: "red" }}>Error: Unauthorized</p>;
          return (
            <main>
              <div className="subheader">
                <h2>Editing {data.list.name}</h2>
                <button
                  type="button"
                  className="right"
                  onClick={() => history.push(`/lists/${match.params.id}`)}
                >
                  RETURN TO LIST
                </button>
                <h3 className="simple-header">Change Title</h3>
                <form className="search">
                  <input
                    type="text"
                    placeholder="Enter new title"
                    value={text}
                    onChange={(e) => this.onChange(e)}
                  />
                  <Mutation
                    mutation={editListMutation}
                    refetchQueries={[
                      {
                        query: listQuery,
                        variables: { id: match.params.id },
                      },
                    ]}
                    onCompleted={() => {
                      history.push(`/lists/${match.params.id}`);
                    }}
                  >
                    {(editList) => (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          editList({
                            variables: {
                              id: match.params.id,
                              name: text,
                            },
                          });
                        }}
                      >
                        SUBMIT
                      </button>
                    )}
                  </Mutation>
                </form>
                <h3 className="simple-header">Delete List</h3>
                <Mutation
                  mutation={deleteListMutation}
                  onCompleted={() => {
                    client.resetStore();
                    history.push("/");
                  }}
                >
                  {(deleteList) => (
                    <button
                      type="button"
                      className="standalone-btn"
                      onClick={() =>
                        deleteList({
                          variables: { id: match.params.id },
                        })
                      }
                    >
                      DELETE
                    </button>
                  )}
                </Mutation>
              </div>
            </main>
          );
        }}
      </QueryHandler>
    );
  }
}

export default withRouter(Edit);
