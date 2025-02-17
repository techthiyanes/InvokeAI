import { Flex } from '@chakra-ui/react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import IAIDndImage from 'common/components/IAIDndImage';
import IAIDndImageIcon from 'common/components/IAIDndImageIcon';
import { InvText } from 'common/components/InvText/wrapper';
import type {
  TypesafeDraggableData,
  TypesafeDroppableData,
} from 'features/dnd/types';
import { fieldImageValueChanged } from 'features/nodes/store/nodesSlice';
import type {
  ImageFieldInputInstance,
  ImageFieldInputTemplate,
} from 'features/nodes/types/field';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUndo } from 'react-icons/fa';
import { useGetImageDTOQuery } from 'services/api/endpoints/images';
import type { PostUploadAction } from 'services/api/types';

import type { FieldComponentProps } from './types';

const ImageFieldInputComponent = (
  props: FieldComponentProps<ImageFieldInputInstance, ImageFieldInputTemplate>
) => {
  const { nodeId, field } = props;
  const dispatch = useAppDispatch();
  const isConnected = useAppSelector((state) => state.system.isConnected);
  const { currentData: imageDTO, isError } = useGetImageDTOQuery(
    field.value?.image_name ?? skipToken
  );

  const handleReset = useCallback(() => {
    dispatch(
      fieldImageValueChanged({
        nodeId,
        fieldName: field.name,
        value: undefined,
      })
    );
  }, [dispatch, field.name, nodeId]);

  const draggableData = useMemo<TypesafeDraggableData | undefined>(() => {
    if (imageDTO) {
      return {
        id: `node-${nodeId}-${field.name}`,
        payloadType: 'IMAGE_DTO',
        payload: { imageDTO },
      };
    }
  }, [field.name, imageDTO, nodeId]);

  const droppableData = useMemo<TypesafeDroppableData | undefined>(
    () => ({
      id: `node-${nodeId}-${field.name}`,
      actionType: 'SET_NODES_IMAGE',
      context: { nodeId, fieldName: field.name },
    }),
    [field.name, nodeId]
  );

  const postUploadAction = useMemo<PostUploadAction>(
    () => ({
      type: 'SET_NODES_IMAGE',
      nodeId,
      fieldName: field.name,
    }),
    [nodeId, field.name]
  );

  useEffect(() => {
    if (isConnected && isError) {
      handleReset();
    }
  }, [handleReset, isConnected, isError]);

  return (
    <Flex
      className="nodrag"
      w="full"
      h="full"
      alignItems="center"
      justifyContent="center"
    >
      <IAIDndImage
        imageDTO={imageDTO}
        droppableData={droppableData}
        draggableData={draggableData}
        postUploadAction={postUploadAction}
        useThumbailFallback
        uploadElement={<UploadElement />}
        dropLabel={<DropLabel />}
        minSize={8}
      >
        <IAIDndImageIcon
          onClick={handleReset}
          icon={imageDTO ? <FaUndo /> : undefined}
          tooltip="Reset Image"
        />
      </IAIDndImage>
    </Flex>
  );
};

export default memo(ImageFieldInputComponent);

const UploadElement = memo(() => {
  const { t } = useTranslation();
  return (
    <InvText fontSize={16} fontWeight="semibold">
      {t('gallery.dropOrUpload')}
    </InvText>
  );
});

UploadElement.displayName = 'UploadElement';

const DropLabel = memo(() => {
  const { t } = useTranslation();
  return (
    <InvText fontSize={16} fontWeight="semibold">
      {t('gallery.drop')}
    </InvText>
  );
});

DropLabel.displayName = 'DropLabel';
