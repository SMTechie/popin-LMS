"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requisitions_service_1 = require("./requisitions.service");
const prismaMock = {
    ticket: {
        findMany: jest.fn(),
        count: jest.fn()
    }
};
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
        const service = new requisitions_service_1.RequisitionsService(prismaMock);
        const result = await service.list({});
        expect(result.items[0].estimatedTotal).toBe(300);
    });
});
//# sourceMappingURL=requisitions.service.spec.js.map