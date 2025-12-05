import {
  useMultistepContext,
  type StepConfig,
} from "@/contexts/shared/MultistepContext";
import { useCallback, useMemo, useState } from "react";

export interface UseMultistepOptions {
  onStepChange?: (step: number, previousStep: number) => void;
  onStepComplete?: (step: number) => void;
  onFinish?: () => void;
  onError?: (error: Error) => void;
  validateOnChange?: boolean;
  autoMarkCompleted?: boolean;
  stepConfigs?: StepConfig[];
}

export interface UseMultistepReturn {
  nextStep: () => Promise<boolean>;
  previousStep: () => Promise<boolean>;
  goToStep: (step: number) => Promise<boolean>;
  goToFirstStep: () => void;
  goToLastStep: () => void;
  markStepCompleted: (step: number) => void;
  markStepIncomplete: (step: number) => void;
  resetSteps: () => void;
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
  isTransitioning: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isStepCompleted: (step: number) => boolean;
  isStepValid: (step: number) => Promise<boolean>;
  isCurrentStepValid: () => Promise<boolean>;
  progress: {
    percentage: number;
    completedCount: number;
    remainingCount: number;
  };
  stepInfo: {
    current: {
      index: number;
      isFirst: boolean;
      isLast: boolean;
      isCompleted: boolean;
      config?: StepConfig;
    };
    all: StepConfig[];
  };
}

export default function useMultistep(
  options: UseMultistepOptions = {}
): UseMultistepReturn {
  const {
    onFinish,
    onError,
    validateOnChange = true,
    stepConfigs = [],
  } = options;

  const context = useMultistepContext();
  const [isLoading, setIsLoading] = useState(false);

  const nextStep = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      if (validateOnChange) {
        const isValid = await context.isStepValid(context.currentStep);
        if (!isValid) {
          onError?.(new Error(`Step ${context.currentStep} is not valid`));
          return false;
        }
      }
      const success = await context.nextStep();
      if (success) {
        if (context.currentStep === context.totalSteps - 1) {
          onFinish?.();
        }
      }
      return success;
    } catch (error) {
      onError?.(error as Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [context, validateOnChange, onFinish, onError]);

  const previousStep = useCallback(async (): Promise<boolean> => {
    try {
      return await context.previousStep();
    } catch (error) {
      onError?.(error as Error);
      return false;
    }
  }, [context, onError]);

  const goToStep = useCallback(
    async (step: number): Promise<boolean> => {
      try {
        setIsLoading(true);
        if (validateOnChange && step !== context.currentStep) {
          const isValid = await context.isStepValid(context.currentStep);
          if (!isValid) {
            onError?.(new Error(`Step ${context.currentStep} is not valid`));
            return false;
          }
        }
        const success = await context.goToStep(step);
        return success;
      } catch (error) {
        onError?.(error as Error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [context, validateOnChange, onError]
  );

  const isCurrentStepValid = useCallback(async (): Promise<boolean> => {
    try {
      return await context.isStepValid(context.currentStep);
    } catch (error) {
      onError?.(error as Error);
      return false;
    }
  }, [context, onError]);

  const progress = useMemo(() => {
    const completedCount = context.completedSteps.size;
    const totalCount = context.totalSteps;
    const percentage =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      percentage,
      completedCount,
      remainingCount: totalCount - completedCount,
    };
  }, [context.completedSteps.size, context.totalSteps]);

  const stepInfo = useMemo(() => {
    const currentConfig = stepConfigs[context.currentStep];

    return {
      current: {
        index: context.currentStep,
        isFirst: context.currentStep === 0,
        isLast: context.currentStep === context.totalSteps - 1,
        isCompleted: context.isStepCompleted(context.currentStep),
        config: currentConfig,
      },
      all: stepConfigs,
    };
  }, [context, stepConfigs]);

  return {
    nextStep,
    previousStep,
    goToStep,
    goToFirstStep: context.goToFirstStep,
    goToLastStep: context.goToLastStep,
    markStepCompleted: context.markStepCompleted,
    markStepIncomplete: context.markStepIncomplete,
    resetSteps: context.resetSteps,
    currentStep: context.currentStep,
    totalSteps: context.totalSteps,
    completedSteps: context.completedSteps,
    isTransitioning: context.isTransitioning || isLoading,
    canGoNext: context.canGoNext,
    canGoPrevious: context.canGoPrevious,
    isStepCompleted: context.isStepCompleted,
    isStepValid: context.isStepValid,
    isCurrentStepValid,
    progress,
    stepInfo,
  };
}

export function useMultistepProgress() {
  const context = useMultistepContext();

  return useMemo(() => {
    const completedCount = context.completedSteps.size;
    const totalCount = context.totalSteps;
    const percentage =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      percentage,
      completedCount,
      remainingCount: totalCount - completedCount,
      currentStep: context.currentStep,
      totalSteps: context.totalSteps,
    };
  }, [context.completedSteps.size, context.totalSteps, context.currentStep]);
}

export function useMultistepValidation() {
  const context = useMultistepContext();

  const validateCurrentStep = useCallback(async () => {
    return context.isStepValid(context.currentStep);
  }, [context]);

  const validateStep = useCallback(
    async (step: number) => {
      return context.isStepValid(step);
    },
    [context]
  );

  return {
    validateCurrentStep,
    validateStep,
    isStepCompleted: context.isStepCompleted,
  };
}
