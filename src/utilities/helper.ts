import { InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { EMAIL_VERIFICATION_EXPIRATION_IN_HOURS } from 'src/const/app.const';

export function isEmpty(data: any): boolean {
  if (data === null || data === undefined) {
    return true;
  }

  //check if the provided data is a string and an empty one
  if (typeof data === 'string' && data.trim() === '') {
    return true;
  }

  //check if the provided data is an array and an empty one
  if (Array.isArray(data) && data.length === 0) {
    return true;
  }

  //check if the provided data is an object and an empty one
  if (typeof data === 'object' && Object.keys(data).length === 0) {
    return true;
  }

  return false;
}

export function handleHttpError(error: any) {
  if (error instanceof NotFoundException || error instanceof UnprocessableEntityException) throw error;

  throw new InternalServerErrorException(error?.message);
}

export function generateOtp(): string {
  return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

export function getOtpExpirationTime(): Date {
  const now = new Date();
  now.setHours(now.getHours() + EMAIL_VERIFICATION_EXPIRATION_IN_HOURS);
  return now;
}

export function dateHasPassed(inputDate: Date): boolean {
  const now = new Date();
  return inputDate < now;
}