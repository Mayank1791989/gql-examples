/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import ChangeTodoStatusMutation from '../mutations/ChangeTodoStatusMutation';
import AddTodoMutation from '../mutations/AddTodoMutation';
import TodoTextInput from './TodoTextInput';
import TodoList from './TodoList';

class TodoApp extends React.Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object,
  };

  _handleTextInputSave = text => {
    AddTodoMutation.commit(
      this.props.relay.environment,
      text,
      false,
      this.props.viewer.id,
    );
  };

  _handleMarkAll = () => {
    const numRemainingTodos = this.props.viewer.allTodoes.edges.filter(
      x => !x.node.complete,
    ).length;
    const newStatus = numRemainingTodos !== 0;

    this.props.viewer.allTodoes.edges
      .map(x => x.node)
      .filter(x => x.complete !== newStatus)
      .forEach(todo => {
        this.props.relay.environment.commitUpdate(
          new ChangeTodoStatusMutation({
            complete: newStatus,
            todo: todo,
            viewer: this.props.viewer,
          }),
        );
      });
  };

  render() {
    const numRemainingTodos = this.props.viewer.allTodoes.edges.filter(
      x => !x.node.complete,
    ).length;
    return (
      <div>
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <input
              onClick={this._handleMarkAll}
              type="checkbox"
              checked={numRemainingTodos === 0}
              className="toggle-all"
              readOnly
            />
            <TodoTextInput
              autoFocus
              className="new-todo"
              onSave={this._handleTextInputSave}
              placeholder="What needs to be done?"
            />
          </header>

          <TodoList
            viewer={this.props.viewer}
            params={{
              status: 'all',
            }}
          />
        </section>
        <footer className="info">
          <p>Double-click to edit a todo</p>
          <p>
            Created by the{' '}
            <a href="https://facebook.github.io/relay/">Relay team</a>
          </p>
          <p>
            Part of <a href="http://todomvc.com">TodoMVC</a>
          </p>
        </footer>
      </div>
    );
  }
}

export default createFragmentContainer(TodoApp, {
  viewer: graphql`
    fragment TodoApp_viewer on Viewer {
      allTodoes(first: 1000) {
        edges {
          node {
            ...ChangeTodoStatusMutation_todo
            id
            complete
          }
        }
      }
      ...ChangeTodoStatusMutation_viewer
      ...TodoList_viewer
      id
    }
  `,
});
