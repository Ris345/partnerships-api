import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DB_TOKEN, KyselyDB } from '../database/database.module';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { UpsertRewardTranslationDto } from './dto/upsert-reward-translation.dto';

@Injectable()
export class RewardService {
  constructor(@Inject(DB_TOKEN) private readonly db: KyselyDB) {}

  async createReward(partnerId: number, dto: CreateRewardDto): Promise<unknown> {
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  async listRewardsForPartner(partnerId: number): Promise<unknown[]> {
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  async getReward(id: string): Promise<unknown> {
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  async updateReward(id: string, dto: UpdateRewardDto): Promise<unknown> {
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  async deleteReward(id: string): Promise<void> {
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  async upsertTranslation(
    id: string,
    lang: string,
    dto: UpsertRewardTranslationDto,
  ): Promise<unknown> {
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  async deleteTranslation(id: string, lang: string): Promise<void> {
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  async addCategory(id: string, categoryId: number): Promise<void> {
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
  }

  async removeCategory(id: string, categoryId: number): Promise<void> {
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
  }
}
