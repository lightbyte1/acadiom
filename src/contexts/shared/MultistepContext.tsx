import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  isCompleted?: boolean;
  isOptional?: boolean;
  validationFn?: () => boolean | Promise<boolean>;
}

export interface MultistepState {
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
  isTransitioning: boolean;
  isNextTransitioning: boolean;
  isBackTransitioning: boolean;
  stepConfigs: StepConfig[];
}

export interface MultistepActions {
  goToStep: (step: number) => Promise<boolean>;
  nextStep: () => Promise<boolean>;
  previousStep: () => Promise<boolean>;
  goToFirstStep: () => void;
  goToLastStep: () => void;
  markStepCompleted: (step: number) => void;
  markStepIncomplete: (step: number) => void;
  resetSteps: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isStepCompleted: (step: number) => boolean;
  isStepValid: (step: number) => Promise<boolean>;
}

export interface MultistepContextValue
  extends MultistepState,
    MultistepActions {}

export const MultistepContext = createContext<MultistepContextValue | null>(
  null
);

export function useMultistepContext(): MultistepContextValue {
  const context = useContext(MultistepContext);
  if (!context) {
    throw new Error(
      "useMultistepContext must be used within a MultistepProvider"
    );
  }
  return context;
}

interface MultistepProviderProps {
  steps: ReactNode[];
  stepConfigs?: StepConfig[];
  onStepChange?: (step: number, previousStep: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  enableValidation?: boolean;
  allowSkipping?: boolean;
  className?: string;
}

export default function MultistepProvider({
  steps,
  stepConfigs = [],
  onStepChange,
  onComplete,
  onError,
  enableValidation = true,
  allowSkipping = false,
  className,
}: MultistepProviderProps) {
  const [state, setState] = useState<MultistepState>({
    currentStep: 0,
    totalSteps: steps.length,
    completedSteps: new Set(),
    isTransitioning: false,
    isNextTransitioning: false,
    isBackTransitioning: false,
    stepConfigs,
  });

  const isValidStep = useCallback(
    (step: number): boolean => {
      return step >= 0 && step < state.totalSteps;
    },
    [state.totalSteps]
  );

  const canNavigateToStep = useCallback(
    async (targetStep: number): Promise<boolean> => {
      if (!isValidStep(targetStep)) {
        return false;
      }

      if (!enableValidation) {
        return true;
      }

      if (!allowSkipping && targetStep > state.currentStep) {
        for (let i = 0; i < state.currentStep; i++) {
          if (!state.completedSteps.has(i)) {
            return false;
          }
        }
      }

      if (state.currentStep !== targetStep) {
        const currentStepConfig = state.stepConfigs[state.currentStep];
        if (currentStepConfig?.validationFn) {
          try {
            const isValid = await currentStepConfig.validationFn();
            if (!isValid) {
              return false;
            }
          } catch (error) {
            onError?.(error as Error);
            return false;
          }
        }
      }

      return true;
    },
    [state, enableValidation, allowSkipping, isValidStep, onError]
  );

  const goToStep = useCallback(
    async (step: number): Promise<boolean> => {
      if (!isValidStep(step)) {
        onError?.(
          new Error(
            `Invalid step: ${step}. Must be between 0 and ${
              state.totalSteps - 1
            }`
          )
        );
        return false;
      }

      const canNavigate = await canNavigateToStep(step);
      if (!canNavigate) {
        return false;
      }

      const previousStep = state.currentStep;
      const isMovingForward = step > previousStep;
      const isMovingBackward = step < previousStep;

      setState((prev) => ({
        ...prev,
        isTransitioning: true,
        isNextTransitioning: isMovingForward,
        isBackTransitioning: isMovingBackward,
      }));

      await new Promise((resolve) => setTimeout(resolve, 250));

      if (isMovingForward) {
        setState((prev) => ({
          ...prev,
          currentStep: step,
          isTransitioning: false,
          isNextTransitioning: false,
          isBackTransitioning: false,
          completedSteps: new Set([...prev.completedSteps, previousStep]),
        }));
      } else {
        setState((prev) => ({
          ...prev,
          currentStep: step,
          isTransitioning: false,
          isNextTransitioning: false,
          isBackTransitioning: false,
        }));
      }

      onStepChange?.(step, previousStep);
      return true;
    },
    [
      state.currentStep,
      state.totalSteps,
      canNavigateToStep,
      isValidStep,
      onStepChange,
      onError,
    ]
  );

  const nextStep = useCallback(async (): Promise<boolean> => {
    if (state.currentStep >= state.totalSteps - 1) {
      onComplete?.();
      return false;
    }
    return goToStep(state.currentStep + 1);
  }, [state.currentStep, state.totalSteps, goToStep, onComplete]);

  const previousStep = useCallback(async (): Promise<boolean> => {
    if (state.currentStep <= 0) {
      return false;
    }
    return goToStep(state.currentStep - 1);
  }, [state.currentStep, goToStep]);

  const goToFirstStep = useCallback(() => {
    goToStep(0);
  }, [goToStep]);

  const goToLastStep = useCallback(() => {
    goToStep(state.totalSteps - 1);
  }, [goToStep, state.totalSteps]);

  const markStepCompleted = useCallback(
    (step: number) => {
      if (isValidStep(step)) {
        setState((prev) => ({
          ...prev,
          completedSteps: new Set([...prev.completedSteps, step]),
        }));
      }
    },
    [isValidStep]
  );

  const markStepIncomplete = useCallback(
    (step: number) => {
      if (isValidStep(step)) {
        setState((prev) => {
          const newCompletedSteps = new Set(prev.completedSteps);
          newCompletedSteps.delete(step);
          return {
            ...prev,
            completedSteps: newCompletedSteps,
          };
        });
      }
    },
    [isValidStep]
  );

  const resetSteps = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: 0,
      completedSteps: new Set(),
      isTransitioning: false,
      isNextTransitioning: false,
      isBackTransitioning: false,
    }));
  }, []);

  const canGoNext = useMemo(() => {
    return state.currentStep < state.totalSteps - 1;
  }, [state.currentStep, state.totalSteps]);

  const canGoPrevious = useMemo(() => {
    return state.currentStep > 0;
  }, [state.currentStep]);

  const isStepCompleted = useCallback(
    (step: number) => {
      return state.completedSteps.has(step);
    },
    [state.completedSteps]
  );

  const isStepValid = useCallback(
    async (step: number): Promise<boolean> => {
      if (!isValidStep(step)) {
        return false;
      }

      const stepConfig = state.stepConfigs[step];
      if (!stepConfig?.validationFn) {
        return true;
      }

      try {
        return await stepConfig.validationFn();
      } catch {
        return false;
      }
    },
    [state.stepConfigs, isValidStep]
  );

  useEffect(() => {
    if (state.currentStep > 0) {
      markStepCompleted(state.currentStep - 1);
    }
  }, [state.currentStep, markStepCompleted]);

  const contextValue: MultistepContextValue = useMemo(
    () => ({
      ...state,
      goToStep,
      nextStep,
      previousStep,
      goToFirstStep,
      goToLastStep,
      markStepCompleted,
      markStepIncomplete,
      resetSteps,
      canGoNext,
      canGoPrevious,
      isStepCompleted,
      isStepValid,
    }),
    [
      state,
      goToStep,
      nextStep,
      previousStep,
      goToFirstStep,
      goToLastStep,
      markStepCompleted,
      markStepIncomplete,
      resetSteps,
      canGoNext,
      canGoPrevious,
      isStepCompleted,
      isStepValid,
    ]
  );

  return (
    <MultistepContext.Provider value={contextValue}>
      <div className={className} data-current-step={state.currentStep}>
        {steps[state.currentStep]}
      </div>
    </MultistepContext.Provider>
  );
}
