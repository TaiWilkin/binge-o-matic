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
    return (
      <QueryHandler
        query={listQuery}
        variables={{ id: this.props.match.params.id }}
      >
        {({ data, loading, error, client }) => {
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
                <h2>
                  Editing
                  {data.list.name}
                </h2>
                <button
                  className="right"
                  onClick={() =>
                    this.props.history.push(
                      `/lists/${this.props.match.params.id}`,
                    )
                  }
                >
                  RETURN TO LIST
                </button>
                <h3 className="simple-header">Change Title</h3>
                <form className="search">
                  <input
                    type="text"
                    placeholder="Enter new title"
                    value={this.state.text}
                    onChange={(e) => this.onChange(e)}
                  />
                  <Mutation
                    mutation={editListMutation}
                    refetchQueries={[
                      {
                        query: listQuery,
                        variables: { id: this.props.match.params.id },
                      },
                    ]}
                    onCompleted={() => {
                      this.props.history.push(
                        `/lists/${this.props.match.params.id}`,
                      );
                    }}
                  >
                    {(editList, { loading, error }) => (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          editList({
                            variables: {
                              id: this.props.match.params.id,
                              name: this.state.text,
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
                    this.props.history.push("/");
                  }}
                >
                  {(deleteList, { loading, error }) => (
                    <button
                      className="standalone-btn"
                      onClick={() =>
                        deleteList({
                          variables: { id: this.props.match.params.id },
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
