import { IsString, Matches, MaxLength } from 'class-validator';

export const MAX_PRODUCT_NAME_LENGTH = 120;

export class CreateProductDto {
  @IsString()
  // Rejeita nome vazio e nome só com espaços (ADR-004); a mensagem se mantém a do contrato anterior.
  @Matches(/\S/, { message: 'name should not be empty' })
  @MaxLength(MAX_PRODUCT_NAME_LENGTH)
  name!: string;
}
