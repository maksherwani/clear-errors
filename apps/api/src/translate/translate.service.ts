import { Injectable } from '@nestjs/common';
import { translateError, NormalizedError, TranslationOptions } from '@ahmedsherwani/clearerrors-core';

@Injectable()
export class TranslateService {
  async translate(
    error: NormalizedError,
    options: TranslationOptions
  ) {
    // No authentication or usage limits - completely free!
    return translateError(error, options);
  }
}

