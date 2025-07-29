import { NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';

export function handleApiError(error: AxiosError) {
  if (error.response?.status === 404) {
    throw new NotFoundException();
  }
  throw error;
}
