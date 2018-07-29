/* @flow */
import React from 'react';
// import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import classnames from 'classnames';
import ChangeTodoStatusMutation from '../mutations/ChangeTodoStatusMutation';
import RemoveTodoMutation from '../mutations/RemoveTodoMutation';
import RenameTodoMutation from '../mutations/RenameTodoMutation';
import TodoTextInput from './TodoTextInput';

import { type Todo_todo } from './__generated__/Todo_todo.graphql';
import { type Todo_viewer } from './__generated__/Todo_viewer.graphql';

type Props = {
  todo: Todo_todo,
  viewer: Todo_viewer,
};

type State = {
  isEditing: boolean,
};

class Todo extends React.Component<Props, State> {
  // static propTypes = {
  //   todo: PropTypes.object.isRequired,
  //   viewer: PropTypes.object.isRequired,
  //   relay: PropTypes.object.isRequired,
  // };

  state = {
    isEditing: false,
  };

  _handleCompleteChange = e => {
    const complete = e.target.checked;
    // TODO props.relay.* APIs do not exist on compat containers
    this.props.relay.environment.commitUpdate(
      new ChangeTodoStatusMutation({
        complete,
        todo: this.props.todo,
        viewer: this.props.viewer.id,
      }),
    );
  };

  _handleDestroyClick = () => {
    this._removeTodo();
  };

  _handleLabelDoubleClick = () => {
    this._setEditMode(true);
  };

  _handleTextInputCancel = () => {
    this._setEditMode(false);
  };

  _handleTextInputDelete = () => {
    this._setEditMode(false);
    this._removeTodo();
  };

  _handleTextInputSave = text => {
    this._setEditMode(false);
    // TODO props.relay.* APIs do not exist on compat containers
    this.props.relay.environment.commitUpdate(
      new RenameTodoMutation({ todo: this.props.todo, text }),
    );
  };

  _removeTodo() {
    // TODO props.relay.* APIs do not exist on compat containers
    // this.props.relay.environment.commitUpdate(
    RemoveTodoMutation.commit(
      this.props.relay.environment,
      this.props.todo.id,
      this.props.viewer.id,
    );
    // );
  }

  _setEditMode = shouldEdit => {
    this.setState({ isEditing: shouldEdit });
  };

  renderTextInput() {
    return (
      <TodoTextInput
        className="edit"
        commitOnBlur={true}
        initialValue={this.props.todo.text}
        onCancel={this._handleTextInputCancel}
        onDelete={this._handleTextInputDelete}
        onSave={this._handleTextInputSave}
      />
    );
  }

  render() {
    return (
      <li
        className={classnames({
          completed: this.props.todo.complete,
          editing: this.state.isEditing,
        })}
      >
        <div className="view">
          <input
            checked={this.props.todo.complete}
            className="toggle"
            onChange={this._handleCompleteChange}
            type="checkbox"
          />
          <label onDoubleClick={this._handleLabelDoubleClick}>
            {this.props.todo.text}
          </label>
          <button
            type="button"
            className="destroy"
            onClick={this._handleDestroyClick}
          />
        </div>
        {this.state.isEditing && this.renderTextInput()}
      </li>
    );
  }
}

export default createFragmentContainer(Todo, {
  todo: graphql`
    fragment Todo_todo on Todo {
      id
      text
      complete
      ...ChangeTodoStatusMutation_todo
      ...RenameTodoMutation_todo
    }
  `,
  viewer: graphql`
    fragment Todo_viewer on Viewer {
      id
      ...ChangeTodoStatusMutation_viewer
    }
  `,
});
