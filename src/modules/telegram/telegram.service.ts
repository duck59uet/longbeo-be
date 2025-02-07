import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly apiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!this.botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN chưa được cấu hình');
    }
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendMessage(chatId: string | number, message: string): Promise<any> {
    try {
      const url = `${this.apiUrl}/sendMessage`;
      const response = await axios.post(url, {
        chat_id: chatId,
        text: message,
      });
      this.logger.log(`Tin nhắn đã gửi: ${JSON.stringify(response.data)}`);
    } catch (error) {
      this.logger.error(`Gửi tin nhắn thất bại: ${error}`);
    }
  }
}
