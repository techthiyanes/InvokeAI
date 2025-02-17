import { Flex } from '@chakra-ui/react';
import { createMemoizedSelector } from 'app/store/createMemoizedSelector';
import { stateSelector } from 'app/store/store';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { InvCheckbox } from 'common/components/InvCheckbox/wrapper';
import { InvControl } from 'common/components/InvControl/InvControl';
import {
  InvPopoverBody,
  InvPopoverContent,
  InvPopoverTrigger,
} from 'common/components/InvPopover/wrapper';
import ClearCanvasHistoryButtonModal from 'features/canvas/components/ClearCanvasHistoryButtonModal';
import {
  setShouldAntialias,
  setShouldAutoSave,
  setShouldCropToBoundingBoxOnSave,
  setShouldDarkenOutsideBoundingBox,
  setShouldRestrictStrokesToBox,
  setShouldShowCanvasDebugInfo,
  setShouldShowGrid,
  setShouldShowIntermediates,
  setShouldSnapToGrid,
} from 'features/canvas/store/canvasSlice';
import { InvIconButton, InvPopover } from 'index';
import type { ChangeEvent } from 'react';
import { memo, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { FaWrench } from 'react-icons/fa';

export const canvasControlsSelector = createMemoizedSelector(
  [stateSelector],
  ({ canvas }) => {
    const {
      shouldAutoSave,
      shouldCropToBoundingBoxOnSave,
      shouldDarkenOutsideBoundingBox,
      shouldShowCanvasDebugInfo,
      shouldShowGrid,
      shouldShowIntermediates,
      shouldSnapToGrid,
      shouldRestrictStrokesToBox,
      shouldAntialias,
    } = canvas;

    return {
      shouldAutoSave,
      shouldCropToBoundingBoxOnSave,
      shouldDarkenOutsideBoundingBox,
      shouldShowCanvasDebugInfo,
      shouldShowGrid,
      shouldShowIntermediates,
      shouldSnapToGrid,
      shouldRestrictStrokesToBox,
      shouldAntialias,
    };
  }
);

const IAICanvasSettingsButtonPopover = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const {
    shouldAutoSave,
    shouldCropToBoundingBoxOnSave,
    shouldDarkenOutsideBoundingBox,
    shouldShowCanvasDebugInfo,
    shouldShowGrid,
    shouldShowIntermediates,
    shouldSnapToGrid,
    shouldRestrictStrokesToBox,
    shouldAntialias,
  } = useAppSelector(canvasControlsSelector);

  useHotkeys(
    ['n'],
    () => {
      dispatch(setShouldSnapToGrid(!shouldSnapToGrid));
    },
    {
      enabled: true,
      preventDefault: true,
    },
    [shouldSnapToGrid]
  );

  const handleChangeShouldSnapToGrid = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      dispatch(setShouldSnapToGrid(e.target.checked)),
    [dispatch]
  );

  const handleChangeShouldShowIntermediates = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      dispatch(setShouldShowIntermediates(e.target.checked)),
    [dispatch]
  );
  const handleChangeShouldShowGrid = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      dispatch(setShouldShowGrid(e.target.checked)),
    [dispatch]
  );
  const handleChangeShouldDarkenOutsideBoundingBox = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      dispatch(setShouldDarkenOutsideBoundingBox(e.target.checked)),
    [dispatch]
  );
  const handleChangeShouldAutoSave = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      dispatch(setShouldAutoSave(e.target.checked)),
    [dispatch]
  );
  const handleChangeShouldCropToBoundingBoxOnSave = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      dispatch(setShouldCropToBoundingBoxOnSave(e.target.checked)),
    [dispatch]
  );
  const handleChangeShouldRestrictStrokesToBox = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      dispatch(setShouldRestrictStrokesToBox(e.target.checked)),
    [dispatch]
  );
  const handleChangeShouldShowCanvasDebugInfo = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      dispatch(setShouldShowCanvasDebugInfo(e.target.checked)),
    [dispatch]
  );
  const handleChangeShouldAntialias = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      dispatch(setShouldAntialias(e.target.checked)),
    [dispatch]
  );

  return (
    <InvPopover>
      <InvPopoverTrigger>
        <InvIconButton
          tooltip={t('unifiedCanvas.canvasSettings')}
          aria-label={t('unifiedCanvas.canvasSettings')}
          icon={<FaWrench />}
        />
      </InvPopoverTrigger>
      <InvPopoverContent>
        <InvPopoverBody>
          <Flex direction="column" gap={2}>
            <InvControl label={t('unifiedCanvas.showIntermediates')}>
              <InvCheckbox
                isChecked={shouldShowIntermediates}
                onChange={handleChangeShouldShowIntermediates}
              />
            </InvControl>
            <InvControl label={t('unifiedCanvas.showGrid')}>
              <InvCheckbox
                isChecked={shouldShowGrid}
                onChange={handleChangeShouldShowGrid}
              />
            </InvControl>
            <InvControl label={t('unifiedCanvas.snapToGrid')}>
              <InvCheckbox
                isChecked={shouldSnapToGrid}
                onChange={handleChangeShouldSnapToGrid}
              />
            </InvControl>
            <InvControl label={t('unifiedCanvas.darkenOutsideSelection')}>
              <InvCheckbox
                isChecked={shouldDarkenOutsideBoundingBox}
                onChange={handleChangeShouldDarkenOutsideBoundingBox}
              />
            </InvControl>
            <InvControl label={t('unifiedCanvas.autoSaveToGallery')}>
              <InvCheckbox
                isChecked={shouldAutoSave}
                onChange={handleChangeShouldAutoSave}
              />
            </InvControl>
            <InvControl label={t('unifiedCanvas.saveBoxRegionOnly')}>
              <InvCheckbox
                isChecked={shouldCropToBoundingBoxOnSave}
                onChange={handleChangeShouldCropToBoundingBoxOnSave}
              />
            </InvControl>
            <InvControl label={t('unifiedCanvas.limitStrokesToBox')}>
              <InvCheckbox
                isChecked={shouldRestrictStrokesToBox}
                onChange={handleChangeShouldRestrictStrokesToBox}
              />
            </InvControl>
            <InvControl label={t('unifiedCanvas.showCanvasDebugInfo')}>
              <InvCheckbox
                isChecked={shouldShowCanvasDebugInfo}
                onChange={handleChangeShouldShowCanvasDebugInfo}
              />
            </InvControl>
            <InvControl label={t('unifiedCanvas.antialiasing')}>
              <InvCheckbox
                isChecked={shouldAntialias}
                onChange={handleChangeShouldAntialias}
              />
            </InvControl>
            <ClearCanvasHistoryButtonModal />
          </Flex>
        </InvPopoverBody>
      </InvPopoverContent>
    </InvPopover>
  );
};

export default memo(IAICanvasSettingsButtonPopover);
