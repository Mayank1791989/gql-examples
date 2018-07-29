import Relay from 'react-relay/classic'

export default class ChangeTodoStatusMutation extends Relay.Mutation {
  static fragments = {
    todo: () => Relay.QL`
      fragment on Todo {
        id,
        complete
        text
      }
    `,
    // TODO: Mark completedCount optional
    viewer: () => Relay.QL`
      fragment on Viewer {
        id,
      }
    `,
  }
  getMutation () {
    return Relay.QL`mutation{updateTodo}`
  }
  getFatQuery () {
    return Relay.QL`
      fragment on UpdateTodoPayload @relay(pattern: true) {
        todo {
          complete,
        },
        viewer {
          allTodoes,
        },
      }
    `
  }
  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        todo: this.props.todo.id,
        viewer: this.props.viewer.id,
      },
    }]
  }
  getVariables () {
    return {
      complete: this.props.complete,
      id: this.props.todo.id,
    }
  }
  getOptimisticResponse () {
    var viewerPayload = {id: this.props.viewer.id}
    return {
      todo: {
        complete: this.props.complete,
        id: this.props.todo.id,
      },
      viewer: viewerPayload,
    }
  }
}
