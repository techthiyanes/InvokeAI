import { createMemoizedSelector } from 'app/store/createMemoizedSelector';
import type { RootState } from 'app/store/store';
import { selectControlAdapterAll } from 'features/controlAdapters/store/controlAdaptersSlice';
import { isControlNetOrT2IAdapter } from 'features/controlAdapters/store/types';
import { isImageFieldInputInstance } from 'features/nodes/types/field';
import { isInvocationNode } from 'features/nodes/types/invocation';
import { some } from 'lodash-es';

import type { ImageUsage } from './types';

export const getImageUsage = (state: RootState, image_name: string) => {
  const { generation, canvas, nodes, controlAdapters } = state;
  const isInitialImage = generation.initialImage?.imageName === image_name;

  const isCanvasImage = canvas.layerState.objects.some(
    (obj) => obj.kind === 'image' && obj.imageName === image_name
  );

  const isNodesImage = nodes.nodes.filter(isInvocationNode).some((node) => {
    return some(
      node.data.inputs,
      (input) =>
        isImageFieldInputInstance(input) &&
        input.value?.image_name === image_name
    );
  });

  const isControlImage = selectControlAdapterAll(controlAdapters).some(
    (ca) =>
      ca.controlImage === image_name ||
      (isControlNetOrT2IAdapter(ca) && ca.processedControlImage === image_name)
  );

  const imageUsage: ImageUsage = {
    isInitialImage,
    isCanvasImage,
    isNodesImage,
    isControlImage,
  };

  return imageUsage;
};

export const selectImageUsage = createMemoizedSelector(
  [(state: RootState) => state],
  (state) => {
    const { imagesToDelete } = state.deleteImageModal;

    if (!imagesToDelete.length) {
      return [];
    }

    const imagesUsage = imagesToDelete.map((i) =>
      getImageUsage(state, i.image_name)
    );

    return imagesUsage;
  }
);
