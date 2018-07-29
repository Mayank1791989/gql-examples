import Relay from 'react-relay'

export default class RemoveTodoMutation extends Relay.Mutation {
  static fragments = {
    // TODO: Mark complete as optional
    todo: () => Relay.QL`
      fragment on Todo {
        complete,
        id,
      }
    `,
    // TODO: Mark completedCount and totalCount as optional
    viewer: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  }
  getMutation () {
    return Relay.QL`mutation{removeTodo}`
  }
  getFatQuery () {
    return Relay.QL`
      fragment on RemoveTodoPayload @relay(pattern: true) {
        deletedTodoId
        viewer {
          todos
        }
      }
    `
  }
  getConfigs () {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'todos',
      deletedIDFieldName: 'deletedId',
    }]
  }
  getVariables () {
    return {
      id: this.props.todo.id,
    }
  }
  getOptimisticResponse () {
    return {
      deletedId: this.props.todo.id,
      todo: { id: this.props.todo.id },
      viewer: {id: this.props.viewer.id},
    }
  }
}
