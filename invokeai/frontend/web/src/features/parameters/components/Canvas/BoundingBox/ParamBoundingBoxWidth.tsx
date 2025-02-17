import { createMemoizedSelector } from 'app/store/createMemoizedSelector';
import { stateSelector } from 'app/store/store';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { InvControl } from 'common/components/InvControl/InvControl';
import { InvSlider } from 'common/components/InvSlider/InvSlider';
import { roundToMultiple } from 'common/util/roundDownToMultiple';
import { isStagingSelector } from 'features/canvas/store/canvasSelectors';
import { setBoundingBoxDimensions } from 'features/canvas/store/canvasSlice';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const selector = createMemoizedSelector(
  [stateSelector, isStagingSelector],
  ({ canvas, generation }, isStaging) => {
    const { boundingBoxDimensions } = canvas;
    const { model, aspectRatio } = generation;
    return {
      model,
      boundingBoxDimensions,
      isStaging,
      aspectRatio,
    };
  }
);

const ParamBoundingBoxWidth = () => {
  const dispatch = useAppDispatch();
  const { model, boundingBoxDimensions, isStaging, aspectRatio } =
    useAppSelector(selector);

  const initial = ['sdxl', 'sdxl-refiner'].includes(model?.base_model as string)
    ? 1024
    : 512;

  const { t } = useTranslation();

  const handleChangeWidth = useCallback(
    (v: number) => {
      dispatch(
        setBoundingBoxDimensions({
          ...boundingBoxDimensions,
          width: Math.floor(v),
        })
      );
      if (aspectRatio) {
        const newHeight = roundToMultiple(v / aspectRatio.value, 64);
        dispatch(
          setBoundingBoxDimensions({
            width: Math.floor(v),
            height: newHeight,
          })
        );
      }
    },
    [aspectRatio, boundingBoxDimensions, dispatch]
  );

  const handleResetWidth = useCallback(() => {
    dispatch(
      setBoundingBoxDimensions({
        ...boundingBoxDimensions,
        width: Math.floor(initial),
      })
    );
    if (aspectRatio) {
      const newHeight = roundToMultiple(initial / aspectRatio.value, 64);
      dispatch(
        setBoundingBoxDimensions({
          width: Math.floor(initial),
          height: newHeight,
        })
      );
    }
  }, [aspectRatio, boundingBoxDimensions, dispatch, initial]);

  return (
    <InvControl label={t('parameters.width')} isDisabled={isStaging}>
      <InvSlider
        min={64}
        max={1536}
        step={64}
        value={boundingBoxDimensions.width}
        onChange={handleChangeWidth}
        onReset={handleResetWidth}
        withNumberInput
        numberInputMax={4096}
        marks
      />
    </InvControl>
  );
};

export default memo(ParamBoundingBoxWidth);
