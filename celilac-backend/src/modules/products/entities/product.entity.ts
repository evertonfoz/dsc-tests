export class Product {
  constructor(
    public readonly productId: string,
    public readonly name: string,
    /** Soft delete (ADR-005): `null` indica produto ativo. */
    public readonly deletedAt: Date | null = null,
  ) {}
}
