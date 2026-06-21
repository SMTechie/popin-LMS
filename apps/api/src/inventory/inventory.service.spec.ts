import { InventoryService } from './inventory.service';

const prismaMock = {
  inventoryAuditLog: { create: jest.fn() },
  inventoryLocationAccess: { findUnique: jest.fn() },
  inventoryStockBalance: { findMany: jest.fn(), findFirst: jest.fn(), upsert: jest.fn(), update: jest.fn() },
  inventoryItem: { findMany: jest.fn(), findUnique: jest.fn(), count: jest.fn(), create: jest.fn(), update: jest.fn() },
  inventoryBatch: { findMany: jest.fn(), create: jest.fn() },
  inventoryRequest: { count: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  inventoryStockMovement: { findMany: jest.fn(), create: jest.fn() },
  inventoryLocation: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  inventoryRequestLine: { updateMany: jest.fn(), findMany: jest.fn() },
  inventoryRequestApproval: { create: jest.fn() },
  inventoryIssueNote: { create: jest.fn() },
  inventoryTransfer: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  inventoryAdjustment: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  inventoryAdjustmentLine: { },
  inventoryCountSession: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  inventoryCountLine: { create: jest.fn(), deleteMany: jest.fn() },
  inventoryAlert: { findMany: jest.fn(), create: jest.fn(), findFirst: jest.fn() },
  inventorySerial: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
  $transaction: jest.fn(async (cb: any) => cb(prismaMock))
} as any;

describe('InventoryService', () => {
  it('calculates valuation totals', async () => {
    prismaMock.inventoryStockBalance.findMany.mockResolvedValue([
      { quantityOnHand: 10, averageCost: 50 },
      { quantityOnHand: 2, averageCost: 100 }
    ]);
    const service = new InventoryService(prismaMock);
    const result = await service.reportValuation();
    expect(result.totalValue).toBe(10 * 50 + 2 * 100);
  });
});
