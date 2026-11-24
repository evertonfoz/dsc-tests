import { IsString, Matches, MaxLength } from 'class-validator';
import { MAX_PRODUCT_NAME_LENGTH } from '../entities/product-name.rules.js';

// UC15: só `name` é alterável. Mesma regra do cadastro (ADR-004); campos extras são ignorados (whitelist).
export class UpdateProductDto {
  @IsString()
  @Matches(/\S/, { message: 'name should not be empty' })
  @MaxLength(MAX_PRODUCT_NAME_LENGTH)
  name!: string;
}
