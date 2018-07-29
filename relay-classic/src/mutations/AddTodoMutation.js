import Relay from 'react-relay'

export default class AddTodoMutation extends Relay.Mutation {

  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  }

  getMutation () {
    return Relay.QL`mutation{ addTodo }`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddTodoPayload @relay(pattern: true) {
        todoEdge,
        viewer {
          todos
        }
      }
    `
  }

  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'allTodoes',
      edgeName: 'edge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      text: this.props.text,
      complete: false,
    }
  }

  getOptimisticResponse () {
    return {
      edge: {
        node: {
          complete: false,
          text: this.props.text,
        },
      },
      viewer: {
        id: this.props.viewer.id,
      },
    }
  }
}
