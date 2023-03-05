import { XCircleIcon } from "@heroicons/react/20/solid";

interface ErrorAlertProps {
  errorMessage: string;
}

export default function ErrorAlert({ errorMessage }: ErrorAlertProps) {
  return (
    <div className="mt-8 rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3 line-clamp-1">
          <p className="block truncate text-sm font-medium text-red-800">
            {errorMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
