import { createMemoizedSelector } from 'app/store/createMemoizedSelector';
import { stateSelector } from 'app/store/store';
import { useAppSelector } from 'app/store/storeHooks';
import { isInvocationNode } from 'features/nodes/types/invocation';
import { getNeedsUpdate } from 'features/nodes/util/node/nodeUpdate';

const selector = createMemoizedSelector(stateSelector, (state) =>
  state.nodes.nodes.filter(isInvocationNode).some((node) => {
    const template = state.nodeTemplates.templates[node.data.type];
    if (!template) {
      return false;
    }
    return getNeedsUpdate(node, template);
  })
);

export const useGetNodesNeedUpdate = () => {
  const getNeedsUpdate = useAppSelector(selector);
  return getNeedsUpdate;
};
