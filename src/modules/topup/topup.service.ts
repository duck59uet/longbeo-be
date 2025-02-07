import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos';
import { ErrorMap } from '../../common/error.map';
import { TopupRepository } from './topup.repository';
import { CommonUtil } from '../../utils/common.util';
import { CreateTopupDto } from './dto/request/topup.dto';
import { BalanceRepository } from '../balance/balance.repository';
import { GetTopupRequestDto } from './dto/request/get-topup.req';
import { UserRole } from '../../common/constants/app.constant';
import { ExportCsvTopupDto } from './dto/request/export-csv.req';
import * as csvWriter from 'csv-writer';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class TopupService {
  private readonly logger = new Logger(TopupService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(
    private topupRepo: TopupRepository,
    private balanceRepo: BalanceRepository,
    private teleService: TelegramService,
  ) {
    this.logger.log('============== Constructor Order Service ==============');
  }

  async createTopup(createTopupDto: CreateTopupDto): Promise<ResponseDto<any>> {
    try {
      const authInfo = this.commonUtil.getAuthInfo();

      if (![UserRole.ADMIN, UserRole.SUPERADMIN].includes(authInfo.role)) {
        return ResponseDto.responseError(
          TopupService.name,
          ErrorMap.PERMISSION_DENIED,
        );
      }

      const data = await this.topupRepo.createTopup(
        createTopupDto,
        authInfo.id,
      );

      await this.balanceRepo.updateBalance({
        user_id: createTopupDto.user_id,
        amount: createTopupDto.amount,
      });

      // await this.teleService.sendMessage(
      //   `Admin ${authInfo.username} đã nạp ${createTopupDto.amount} cho tài khoản ${createTopupDto.user_id}`,
      // );
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(TopupService.name, error);
    }
  }

  async getUserTopupHistory(
    query: GetTopupRequestDto,
  ): Promise<ResponseDto<any>> {
    try {
      const { pageSize, pageIndex } = query;

      const authInfo = this.commonUtil.getAuthInfo();

      const data = await this.topupRepo.getUserTopupHistory(
        authInfo.id,
        pageSize,
        pageIndex,
      );

      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(TopupService.name, error);
    }
  }

  async getAdminTopupHistory(
    query: GetTopupRequestDto,
  ): Promise<ResponseDto<any>> {
    try {
      const { pageSize, pageIndex } = query;

      const data = await this.topupRepo.getAdminTopupHistory(
        pageSize,
        pageIndex,
      );

      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(TopupService.name, error);
    }
  }

  async generateCsv(query: ExportCsvTopupDto): Promise<any> {
    try {
      const { startDate, endDate } = query;

      const data = await this.topupRepo.exportTopupHistory(startDate, endDate);

      const csvHeaders = ['Tai khoan', 'So tien', 'Nguoi gui', 'Thoi gian', 'Admin'];
      const csvData = data.map((record: any) => ({
        'Tai khoan': record.username,
        'So tien': record.amount,
        'Nguoi gui': record.sender,
        'Thoi gian': record.createdAt,
        Admin: record.admin,
      }));

      // Create CSV string
      const createCsvWriter = csvWriter.createObjectCsvStringifier({
        header: csvHeaders.map((header) => ({ id: header, title: header })),
      });

      return (
        createCsvWriter.getHeaderString() +
        createCsvWriter.stringifyRecords(csvData)
      );
    } catch (error) {
      return ResponseDto.responseError(TopupService.name, error);
    }
  }
}
