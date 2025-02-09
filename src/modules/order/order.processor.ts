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
import { ServiceTimeRepository } from '../service_time/service_time.repository';

@Processor('order')
export class OrderProcessor {
  private readonly logger = new Logger(OrderProcessor.name);

  constructor(
    private orderRepo: OrderRepository,
    private readonly serviceRepo: ServiceRepository,
    private readonly serviceTimeRepo: ServiceTimeRepository
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

            const serviceTime = await this.serviceTimeRepo.repo.findOne({ where: { id: order.service_time_id } });

            if (service) {
              const buffView = Math.floor(
                (service.rate * order.quantity) / 100,
              );

              try {
                const result = await axios.post(
                  service.sourceAddress,
                  JSON.stringify({
                    key: service.apiKey,
                    action: 'add',
                    service: serviceTime.sourceServiceId,
                    link: order.link,
                    quantity: buffView,
                  }),
                  { headers: { 'Content-Type': 'application/json' } },
                );

                if (result.status === 200) {
                  await this.orderRepo.repo.update(
                    { id: order.id },
                    { status: OrderStatus.COMPLETE, actual_quantity: buffView, source_order_id: result.data.order },
                  );
                } 

              } catch (error) {
                console.log(error);
              }
              
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
