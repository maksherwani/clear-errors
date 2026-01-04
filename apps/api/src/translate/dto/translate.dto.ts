import { IsObject, IsOptional, IsString, IsBoolean } from 'class-validator';
import { NormalizedError } from '@ahmedsherwani/clearerrors-core';

export class TranslateDto {
  @IsObject()
  error: NormalizedError;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsString()
  tone?: 'friendly' | 'professional' | 'casual';

  @IsOptional()
  @IsBoolean()
  useAI?: boolean;
}

