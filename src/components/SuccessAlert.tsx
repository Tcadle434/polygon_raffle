import { CheckCircleIcon } from "@heroicons/react/20/solid";

interface SuccessAlertProps {
  successMessage: string;
}

export default function SuccessAlert({ successMessage }: SuccessAlertProps) {
  return (
    <div className="mt-8 rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">{successMessage}</p>
        </div>
      </div>
    </div>
  );
}
