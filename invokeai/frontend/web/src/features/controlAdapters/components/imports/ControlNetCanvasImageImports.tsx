import { Flex } from '@chakra-ui/react';
import { useAppDispatch } from 'app/store/storeHooks';
import { InvIconButton } from 'common/components/InvIconButton/InvIconButton';
import {
  canvasImageToControlAdapter,
  canvasMaskToControlAdapter,
} from 'features/canvas/store/actions';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaImage, FaMask } from 'react-icons/fa';

type ControlNetCanvasImageImportsProps = {
  id: string;
};

const ControlNetCanvasImageImports = (
  props: ControlNetCanvasImageImportsProps
) => {
  const { id } = props;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleImportImageFromCanvas = useCallback(() => {
    dispatch(canvasImageToControlAdapter({ id }));
  }, [id, dispatch]);

  const handleImportMaskFromCanvas = useCallback(() => {
    dispatch(canvasMaskToControlAdapter({ id }));
  }, [id, dispatch]);

  return (
    <Flex gap={2}>
      <InvIconButton
        size="sm"
        icon={<FaImage />}
        tooltip={t('controlnet.importImageFromCanvas')}
        aria-label={t('controlnet.importImageFromCanvas')}
        onClick={handleImportImageFromCanvas}
      />
      <InvIconButton
        size="sm"
        icon={<FaMask />}
        tooltip={t('controlnet.importMaskFromCanvas')}
        aria-label={t('controlnet.importMaskFromCanvas')}
        onClick={handleImportMaskFromCanvas}
      />
    </Flex>
  );
};

export default memo(ControlNetCanvasImageImports);
