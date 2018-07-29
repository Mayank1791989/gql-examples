/* @flow */
import { commitMutation, graphql } from 'react-relay/compat';

const mutation = graphql`
  mutation CreateTodoMutation($input: CreateTodoInput!) {
    createTodo(input: $input) {
      todo {
        id
        # text
        complete
      }
      edge {
        cursor
        node {
          id
          complete
        }
      }
      viewer {
        id
        allTodoes(last: 1000) {
          edges {
            cursor
            node {
              id
              complete
            }
          }
        }
      }
    }
  }
`;

function getOptimisticResponse(text, viewerId) {
  return {
    edge: {
      node: {
        complete: false,
        text,
      },
    },
    viewer: {
      id: viewerId,
    },
  };
}

function getConfigs(viewerId) {
  return [
    {
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: viewerId,
      connectionName: 'allTodoes',
      edgeName: 'edge',
      rangeBehaviors: {
        '': 'append',
      },
    },
  ];
}

function commit(environment, text, complete, viewerId) {
  return commitMutation(environment, {
    mutation,
    variables: { input: { text, complete, clientMutationId: 'asd' } },
    configs: getConfigs(viewerId),
    // optimisticResponse: () => getOptimisticResponse(text, viewerId),
  });
}

export default { commit };
