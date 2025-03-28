import { Body, Controller, Get, Logger, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CONTROLLER_CONSTANTS } from '../../common/constants/api.constant';
import { TopupService } from './topup.service';
import {
  CommonAuthGet,
  CommonAuthPost,
  Roles,
} from '../../decorators/common.decorator';
import { ResponseDto } from '../../common/dtos';
import { CreateTopupDto } from './dto/request/topup.dto';
import { GetTopupRequestDto } from './dto/request/get-topup.req';
import { UserRole } from '../../common/constants/app.constant';
import { ExportCsvTopupDto } from './dto/request/export-csv.req';
import { Response } from 'express';

@Controller(CONTROLLER_CONSTANTS.TOPUP)
@ApiTags(CONTROLLER_CONSTANTS.TOPUP)
export class TopupController {
  public readonly logger = new Logger(TopupController.name);

  constructor(private topupService: TopupService) {}
  @CommonAuthPost({
    url: 'create',
    summary: 'admin topup user',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'create order',
      schema: {},
    },
  })
  @Roles(UserRole.ADMIN)
  async createOrder(
    @Body() createOrderDto: CreateTopupDto,
  ): Promise<ResponseDto<any>> {
    return this.topupService.createTopup(createOrderDto);
  }

  @CommonAuthGet({
    url: 'user/history',
    summary: 'user get topup history',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'user get topup history',
      schema: {},
    },
  })
  @Roles(UserRole.USER)
  async getUserTopupHistory(
    @Query() query: GetTopupRequestDto,
  ): Promise<ResponseDto<any>> {
    return this.topupService.getUserTopupHistory(query);
  }

  @CommonAuthGet({
    url: 'admin/history',
    summary: 'user get topup history',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'user get topup history',
      schema: {},
    },
  })
  // @Roles(UserRole.USER)
  async getAdminTopupHistory(
    @Query() query: GetTopupRequestDto,
  ): Promise<ResponseDto<any>> {
    return this.topupService.getAdminTopupHistory(query);
  }

  @CommonAuthGet({
    url: 'admin/topup/exportHistory',
    summary: 'admin export topup history',
    apiOkResponseOptions: {
      status: 200,
      type: ResponseDto,
      description: 'admin export topup history',
      schema: {},
    },
  })
  async exportTopupHistory(
    @Query() query: ExportCsvTopupDto,
    @Res() res: Response,
  ) {
    try {
      const csvBuffer = await this.topupService.generateCsv(query);

      // Set response headers for file download
      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=topup`,
      });
      return res.send(csvBuffer);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      res.status(500).send('An error occurred while exporting CSV');
    }
  }
}
