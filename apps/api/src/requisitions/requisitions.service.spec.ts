import { RequisitionsService } from './requisitions.service';

const prismaMock = {
  ticket: {
    findMany: jest.fn(),
    count: jest.fn()
  }
} as any;

describe('RequisitionsService', () => {
  it('calculates estimated totals on list', async () => {
    prismaMock.ticket.findMany.mockResolvedValue([
      {
        id: '1',
        items: [{ quantity: 2, estimatedUnitCost: 150, totalCost: null }],
        requisition: null
      }
    ]);
    prismaMock.ticket.count.mockResolvedValue(1);

    const service = new RequisitionsService(prismaMock);
    const result = await service.list({});
    expect(result.items[0].estimatedTotal).toBe(300);
  });
});
