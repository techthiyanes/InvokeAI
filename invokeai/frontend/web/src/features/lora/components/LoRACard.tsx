import { useAppDispatch } from 'app/store/storeHooks';
import {
  InvCard,
  InvCardBody,
  InvCardHeader,
} from 'common/components/InvCard/wrapper';
import { InvIconButton } from 'common/components/InvIconButton/InvIconButton';
import { InvNumberInput } from 'common/components/InvNumberInput/InvNumberInput';
import { InvSlider } from 'common/components/InvSlider/InvSlider';
import { InvText } from 'common/components/InvText/wrapper';
import type { LoRA } from 'features/lora/store/loraSlice';
import {
  loraRemoved,
  loraWeightChanged,
  loraWeightReset,
} from 'features/lora/store/loraSlice';
import { memo, useCallback } from 'react';
import { FaTrashCan } from 'react-icons/fa6';

type LoRACardProps = {
  lora: LoRA;
};

export const LoRACard = memo((props: LoRACardProps) => {
  const dispatch = useAppDispatch();
  const { lora } = props;

  const handleChange = useCallback(
    (v: number) => {
      dispatch(loraWeightChanged({ id: lora.id, weight: v }));
    },
    [dispatch, lora.id]
  );

  const onReset = useCallback(() => {
    dispatch(loraWeightReset(lora.id));
  }, [dispatch, lora.id]);

  const handleRemoveLora = useCallback(() => {
    dispatch(loraRemoved(lora.id));
  }, [dispatch, lora.id]);

  return (
    <InvCard variant="lora">
      <InvCardHeader>
        <InvText noOfLines={1} wordBreak="break-all">
          {lora.model_name}
        </InvText>
        <InvIconButton
          aria-label="Remove LoRA"
          variant="ghost"
          size="sm"
          onClick={handleRemoveLora}
          icon={<FaTrashCan />}
        />
      </InvCardHeader>
      <InvCardBody>
        <InvSlider
          value={lora.weight}
          onChange={handleChange}
          min={-1}
          max={2}
          step={0.01}
          onReset={onReset}
          marks={marks}
        />
        <InvNumberInput
          value={lora.weight}
          onChange={handleChange}
          min={-5}
          max={5}
          step={0.01}
          w={20}
          flexShrink={0}
        />
      </InvCardBody>
    </InvCard>
  );
});

LoRACard.displayName = 'LoRACard';

const marks = [-1, 0, 1, 2];
