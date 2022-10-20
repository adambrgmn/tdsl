import { ListPlus } from 'lucide-react';
import { useState } from 'react';
import { Form, useActionData } from 'react-router-dom';
import { ZodError } from 'zod';

import { HStack, VStack } from './Stack';

export type CreateInputProps = {
  action?: string;
  label: React.ReactNode;
  name: string;
  placeholder?: string;
  autoFocus?: boolean;
  submitLabel: string;
};

export const CreateInput: React.FC<CreateInputProps> = ({
  action,
  label,
  name,
  placeholder,
  autoFocus,
  submitLabel,
}) => {
  let actionData = useActionData();
  let contentError = getErrorMessage('content', actionData);

  const [value, setValue] = useState('');

  return (
    <Form method="post" action={action} onSubmit={() => setValue('')}>
      <HStack padding="2" background="white" items="stretch" rounded="normal">
        <VStack element="label" flex="fill">
          <VStack gap="4" text="xs" tracking="wider">
            <span className="text-gray-700">{label}</span>
            {contentError != null ? (
              <span role="alert" className="text-red-500">
                {contentError.message}
              </span>
            ) : null}
          </VStack>

          <input
            type="text"
            name={name}
            placeholder={placeholder}
            autoFocus={autoFocus}
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            className="placeholder:text-gray-400"
            aria-invalid={contentError != null}
            aria-required
          />
        </VStack>

        <button type="submit" name="action" value="create" aria-label={submitLabel} className="hover:text-blue-500">
          <ListPlus />
        </button>
      </HStack>
    </Form>
  );
};

function getErrorMessage(name: string, error: unknown) {
  if (!isValidationError(error)) return null;
  return error.issues.find((err) => err.path[0] === name) ?? null;
}

function isValidationError(error: unknown): error is ZodError {
  return error != null && 'issues' in error;
}
