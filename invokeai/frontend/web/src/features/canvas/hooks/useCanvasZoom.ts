import { useStore } from '@nanostores/react';
import { createMemoizedSelector } from 'app/store/createMemoizedSelector';
import { stateSelector } from 'app/store/store';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { $isMoveStageKeyHeld } from 'features/canvas/store/canvasNanostore';
import {
  setStageCoordinates,
  setStageScale,
} from 'features/canvas/store/canvasSlice';
import {
  CANVAS_SCALE_BY,
  MAX_CANVAS_SCALE,
  MIN_CANVAS_SCALE,
} from 'features/canvas/util/constants';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { clamp } from 'lodash-es';
import type { MutableRefObject } from 'react';
import { useCallback } from 'react';

const selector = createMemoizedSelector(
  [stateSelector],
  (state) => state.canvas.stageScale
);

const useCanvasWheel = (stageRef: MutableRefObject<Konva.Stage | null>) => {
  const dispatch = useAppDispatch();
  const stageScale = useAppSelector(selector);
  const isMoveStageKeyHeld = useStore($isMoveStageKeyHeld);

  return useCallback(
    (e: KonvaEventObject<WheelEvent>) => {
      // stop default scrolling
      if (!stageRef.current || isMoveStageKeyHeld) {
        return;
      }

      e.evt.preventDefault();

      const cursorPos = stageRef.current.getPointerPosition();

      if (!cursorPos) {
        return;
      }

      const mousePointTo = {
        x: (cursorPos.x - stageRef.current.x()) / stageScale,
        y: (cursorPos.y - stageRef.current.y()) / stageScale,
      };

      let delta = e.evt.deltaY;

      // when we zoom on trackpad, e.evt.ctrlKey is true
      // in that case lets revert direction
      if (e.evt.ctrlKey) {
        delta = -delta;
      }

      const newScale = clamp(
        stageScale * CANVAS_SCALE_BY ** delta,
        MIN_CANVAS_SCALE,
        MAX_CANVAS_SCALE
      );

      const newCoordinates = {
        x: cursorPos.x - mousePointTo.x * newScale,
        y: cursorPos.y - mousePointTo.y * newScale,
      };

      dispatch(setStageScale(newScale));
      dispatch(setStageCoordinates(newCoordinates));
    },
    [stageRef, isMoveStageKeyHeld, stageScale, dispatch]
  );
};

export default useCanvasWheel;
