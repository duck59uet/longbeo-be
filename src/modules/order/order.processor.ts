// import { Contract, JsonRpcProvider } from 'ethers';

import { Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IsNull } from 'typeorm';
import axios from 'axios';
import { OrderRepository } from './order.repository';
import { OrderStatus } from '../../common/constants/app.constant';
import { Order } from './entities/order.entity';
import { ServiceRepository } from '../service/service.repository';

@Processor('order')
export class OrderProcessor {
  private readonly logger = new Logger(OrderProcessor.name);

  constructor(
    private orderRepo: OrderRepository,
    private readonly serviceRepo: ServiceRepository,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron(): Promise<void> {
    this.logger.log(`Run buff order`);

    try {
      const orders = await this.orderRepo.repo.find({
        where: {
          status: OrderStatus.PENDING,
        },
      });
      if (!orders) {
        this.logger.log(`There is no active orders`);
      }
      const processBuffView = async (order: Order) => {
        try {
          this.logger.log(`Create buff view for ${order.link}`);
          try {
            const service = await this.serviceRepo.repo.findOne({
              where: { id: order.service_id },
            });

            if (service) {
            const buffView =  Math.floor(service.rate * order.quantity / 100);

              axios.post(
                service.sourceAddress,
                JSON.stringify({
                  data: {
                    key: service.apiKey,
                    action: 'add',
                    service: service.sourceServiceId,
                    link: order.link,
                    quantity: buffView,
                  },
                }),
                { headers: { 'Content-Type': 'application/json' } },
              );

              await this.orderRepo.repo.update(
                { id: order.id },
                { status: OrderStatus.COMPLETE, actual_quantity: buffView },
              );
            }
          } catch (error) {
            this.logger.error('POST request failed:', error);
          }
        } catch (error) {
          this.logger.error(error);
        }
      };

      for (const order of orders) {
        await processBuffView(order);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
