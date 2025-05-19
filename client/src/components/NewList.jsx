import React from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";

import mutation from "../mutations/CreateList";
import query from "../queries/Nav";
import Errors from "./Errors";

class NewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      error: "",
    };
    this.addList = this.addList.bind(this);
  }

  onChange(e) {
    this.setState({ name: e.target.value, error: "" });
  }

  addList(e, createList) {
    e.preventDefault();
    const { name } = this.state;
    if (name.includes("/")) {
      this.setState({ error: "Invalid character: /", name: "" });
      // } else if (this.props.lists.find(list => list.name === name)) {
      //   this.setState({ error: 'List already exists.', name: '' });
    } else {
      createList({ variables: { name: this.state.name } });
    }
  }

  render() {
    return (
      <Mutation
        mutation={mutation}
        refetchQueries={[{ query }]}
        onCompleted={(data) => {
          if (data && data.createList) {
            this.props.history.push(`/lists/${data.createList.id}`);
          }
        }}
      >
        {(createList, { error }) => (
          <main>
            <div className="subheader">
              <h2>New List</h2>
              <button
                className="edit-btn"
                onClick={() => this.props.history.push("/")}
              >
                CANCEL
              </button>
              <h3>Choose Title</h3>
              <h3 className="error">{this.state.error}</h3>
              <form className="search">
                <input
                  type="text"
                  placeholder="Star Trek"
                  value={this.state.name}
                  required
                  onChange={(e) => this.onChange(e)}
                />
                <Errors error={error} />
                <button
                  type="submit"
                  onClick={(e) => this.addList(e, createList)}
                >
                  CREATE
                </button>
              </form>
            </div>
          </main>
        )}
      </Mutation>
    );
  }
}

export default withRouter(NewList);
