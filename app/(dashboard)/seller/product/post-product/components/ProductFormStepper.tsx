import { Check, Circle, Clock } from "lucide-react";

interface ProductFormStepperProps {
  currentStep: number;
}

interface StepItem {
  number: number;
  title: string;
  description: string;
}

export const ProductFormStepper = ({
  currentStep,
}: ProductFormStepperProps) => {
  const steps: StepItem[] = [
    {
      number: 1,
      title: "Category",
      description: "Choose product category",
    },
    {
      number: 2,
      title: "Details",
      description: "Add product information",
    },
    {
      number: 3,
      title: "Review",
      description: "Final review & submit",
    },
  ];

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Mobile Progress Bar */}
      <div className="md:hidden mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(progressPercentage)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#1F058F] to-[#3b0ac7] h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:block">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Post Your Product
          </h3>
          <p className="text-sm text-gray-600">
            Follow these steps to list your product
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <div key={step.number} className="relative flex items-start">
                {/* Step Circle */}
                <div className="flex-shrink-0">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${
                        isCompleted
                          ? "bg-green-500 text-white shadow-lg"
                          : isCurrent
                          ? "bg-[#1F058F] text-white shadow-lg ring-4 ring-[#1F058F]/20"
                          : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : isCurrent ? (
                      <Circle className="w-5 h-5 fill-current" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Step Content */}
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`
                        text-sm font-medium transition-colors duration-300
                        ${
                          isCompleted || isCurrent
                            ? "text-gray-900"
                            : "text-gray-500"
                        }
                      `}
                    >
                      {step.title}
                    </h4>
                    {isCurrent && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#1F058F]/10 text-[#1F058F]">
                        Current
                      </span>
                    )}
                  </div>
                  <p
                    className={`
                      text-xs mt-1 transition-colors duration-300
                      ${
                        isCompleted || isCurrent
                          ? "text-gray-600"
                          : "text-gray-400"
                      }
                    `}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Connector Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-5 top-10 w-0.5 h-6 bg-gray-200">
                    <div
                      className={`w-full bg-green-500 transition-all duration-500 ${
                        isCompleted ? "h-full" : "h-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-8 p-4 bg-gradient-to-r from-[#1F058F]/5 to-[#3b0ac7]/5 rounded-lg border border-[#1F058F]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Progress</p>
              <p className="text-xs text-gray-500 mt-1">
                Step {currentStep} of {steps.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#1F058F]">
                {Math.round(progressPercentage)}%
              </p>
              <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-gradient-to-r from-[#1F058F] to-[#3b0ac7] h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Compact Stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-green-500 text-white shadow-md"
                        : isCurrent
                        ? "bg-[#1F058F] text-white shadow-md ring-2 ring-[#1F058F]/30"
                        : "bg-gray-100 text-gray-400 border border-gray-200"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{step.number}</span>
                  )}
                </div>
                <span
                  className={`
                    text-xs font-medium text-center leading-tight transition-colors duration-300
                    ${
                      isCompleted || isCurrent
                        ? "text-gray-900"
                        : "text-gray-500"
                    }
                  `}
                >
                  {step.title}
                </span>

                {/* Connector Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200 -z-10">
                    <div
                      className={`h-full bg-green-500 transition-all duration-500 ${
                        isCompleted ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
